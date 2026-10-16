import { z } from 'zod';
import { query, queryOne } from '../../config/db.js';
import { logActivity } from '../../services/activityLog.js';
import { getOrderDetail, changeOrderStatus, recordPayment, ORDER_STATUSES, TRANSITIONS } from '../../services/orderService.js';
import { notifyOrderStatus, retryEmail } from '../../services/notificationService.js';
import { pagination, pageMeta, likeTerm } from '../../utils/helpers.js';
import { text, optionalText, httpsUrl } from '../../utils/validators.js';
import { notFound } from '../../utils/httpError.js';

export const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  note: optionalText(500),
  cancelReason: optionalText(500),
  notifyCustomer: z.boolean().default(true),
});
export const noteSchema = z.object({ note: text(4000, 1) });
export const trackingSchema = z.object({
  tracking_carrier: optionalText(100),
  tracking_number: optionalText(100),
  tracking_url: z.union([httpsUrl, z.null()]).optional().transform((v) => v || null),
});
export const paymentSchema = z.object({
  status: z.enum(['paid', 'failed', 'refunded']),
  reference: optionalText(190),
  notes: optionalText(500),
});

/** IST calendar date (YYYY-MM-DD) → UTC instant of its midnight. */
const istDayStart = (s) => new Date(new Date(`${s}T00:00:00Z`).getTime() - 330 * 60_000);

export async function list(req, res) {
  const { page, limit, offset } = pagination(req.query, { defaultLimit: 20 });
  const where = [];
  const params = [];
  const q = String(req.query.q || '').trim();
  if (q) {
    where.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ? OR o.customer_phone LIKE ?)');
    const like = likeTerm(q);
    params.push(like, like, like, like.replace(/\s/g, ''));
  }
  if (ORDER_STATUSES.includes(req.query.status)) {
    where.push('o.status = ?');
    params.push(req.query.status);
  }
  if (['pending', 'paid', 'failed', 'refunded', 'cancelled'].includes(req.query.payment)) {
    where.push('o.payment_status = ?');
    params.push(req.query.payment);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.from || '')) {
    where.push('o.created_at >= ?');
    params.push(istDayStart(req.query.from));
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.to || '')) {
    where.push('o.created_at < ?');
    params.push(new Date(istDayStart(req.query.to).getTime() + 86_400_000));
  }
  if (req.query.customer) {
    where.push('o.customer_id = ?');
    params.push(Number(req.query.customer) || 0);
  }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM orders o ${w}`, params);
  const items = await query(
    `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone, o.total, o.status, o.payment_status, o.payment_method, o.created_at,
            (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id) AS item_count
       FROM orders o ${w} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  res.json({ items: items.map((i) => ({ ...i, item_count: Number(i.item_count) })), meta: pageMeta(page, limit, total) });
}

export async function get(req, res) {
  const order = await getOrderDetail('id = ?', [req.params.id], { includeInternal: true });
  if (!order) throw notFound('Order not found.');
  const [notes, payments, emails] = await Promise.all([
    query('SELECT n.id, n.note, n.created_at, a.name AS admin_name FROM order_internal_notes n LEFT JOIN admins a ON a.id = n.admin_id WHERE n.order_id = ? ORDER BY n.created_at DESC', [order.id]),
    query('SELECT p.id, p.method, p.amount, p.status, p.provider_reference, p.notes, p.paid_at, p.updated_at, a.name AS recorded_by FROM payments p LEFT JOIN admins a ON a.id = p.recorded_by WHERE p.order_id = ? ORDER BY p.id', [order.id]),
    query("SELECT id, type, recipient, status, error_message, attempts, last_attempt_at, sent_at, created_at FROM email_notification_logs WHERE related_type = 'order' AND related_id = ? ORDER BY id DESC", [order.id]),
  ]);
  res.json({ order, notes, payments, emails, allowedTransitions: TRANSITIONS[order.status] });
}

export async function updateStatus(req, res) {
  const id = Number(req.params.id);
  const d = req.valid.body;
  const result = await changeOrderStatus({ orderId: id, toStatus: d.status, admin: req.admin, note: d.note, cancelReason: d.cancelReason });
  await logActivity(req, 'order.status', 'order', id, { from: result.from, to: result.to, note: d.note || d.cancelReason || undefined });
  if (d.notifyCustomer && ['confirmed', 'shipped', 'delivered', 'cancelled'].includes(d.status)) setImmediate(() => notifyOrderStatus(id));
  res.json({ ok: true, ...result });
}

export async function addNote(req, res) {
  const id = Number(req.params.id);
  const exists = await queryOne('SELECT id FROM orders WHERE id = ?', [id]);
  if (!exists) throw notFound('Order not found.');
  await query('INSERT INTO order_internal_notes (order_id, admin_id, note) VALUES (?, ?, ?)', [id, req.admin.id, req.valid.body.note]);
  await logActivity(req, 'order.note', 'order', id);
  res.status(201).json({ ok: true });
}

export async function updateTracking(req, res) {
  const id = Number(req.params.id);
  const d = req.valid.body;
  const exists = await queryOne('SELECT id FROM orders WHERE id = ?', [id]);
  if (!exists) throw notFound('Order not found.');
  await query('UPDATE orders SET tracking_carrier = ?, tracking_number = ?, tracking_url = ? WHERE id = ?', [d.tracking_carrier, d.tracking_number, d.tracking_url, id]);
  await logActivity(req, 'order.tracking', 'order', id, d);
  res.json({ ok: true });
}

export async function updatePayment(req, res) {
  const id = Number(req.params.id);
  const d = req.valid.body;
  const result = await recordPayment({ orderId: id, admin: req.admin, reference: d.reference, notes: d.notes, status: d.status });
  await logActivity(req, 'order.payment', 'order', id, { ...result, reference: d.reference || undefined });
  res.json({ ok: true, ...result });
}

export async function retryNotification(req, res) {
  const result = await retryEmail(Number(req.params.logId));
  await logActivity(req, 'email.retry', 'email', req.params.logId, { status: result.status });
  res.json(result);
}
