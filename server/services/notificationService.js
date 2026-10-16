import { query, queryOne } from '../config/db.js';
import { env } from '../config/env.js';
import { getSettings, flag } from './settingsService.js';
import { sendLoggedEmail } from './emailService.js';
import * as T from './emailTemplates.js';
import { HttpError } from '../utils/httpError.js';

const adminRecipient = (settings) => settings.admin_notification_email || env.adminEmail || settings.business_email || '';

async function loadOrder(orderId) {
  const order = await queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!order) return null;
  const items = await query('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', [orderId]);
  return { order, items };
}

const orderUrlFor = (order) => (order.customer_id ? `${env.clientUrl}/account/orders/${order.order_number}` : null);

/** Renders and sends one order-related email. `logId` re-uses an existing log row (retries). */
async function sendOrderEmail(type, orderId, { logId = null } = {}) {
  const data = await loadOrder(orderId);
  if (!data) throw new HttpError(404, 'Order not found.');
  const { order, items } = data;
  const settings = await getSettings();
  let mail;
  let to;
  if (type === 'order_customer') {
    to = order.customer_email;
    mail = T.orderCustomerEmail({ order, items, settings, orderUrl: orderUrlFor(order) });
  } else if (type === 'order_admin') {
    to = adminRecipient(settings);
    if (!to) return { status: 'skipped', reason: 'No admin email configured' };
    mail = T.orderAdminEmail({ order, items, settings, adminUrl: `${env.clientUrl}/admin/orders/${order.id}` });
  } else if (type === 'order_status') {
    to = order.customer_email;
    mail = T.orderStatusEmail({ order, settings, orderUrl: orderUrlFor(order) });
  } else {
    throw new HttpError(400, 'Unknown email type.');
  }
  return sendLoggedEmail({ type, to, ...mail, relatedType: 'order', relatedId: order.id, logId });
}

/** Called after the order transaction commits. Failures are logged, never thrown. */
export async function notifyOrderPlaced(orderId) {
  try {
    const settings = await getSettings();
    if (flag(settings, 'email_notify_customer_orders')) await sendOrderEmail('order_customer', orderId);
    if (flag(settings, 'email_notify_admin_orders')) await sendOrderEmail('order_admin', orderId);
  } catch (err) {
    console.error(`[notify] order ${orderId} emails failed:`, err.message);
  }
}

export async function notifyOrderStatus(orderId) {
  try {
    const settings = await getSettings();
    if (flag(settings, 'email_notify_customer_orders')) await sendOrderEmail('order_status', orderId);
  } catch (err) {
    console.error(`[notify] order ${orderId} status email failed:`, err.message);
  }
}

async function sendEnquiryEmail(type, enquiryId, { logId = null } = {}) {
  const enquiry = await queryOne('SELECT * FROM enquiries WHERE id = ?', [enquiryId]);
  if (!enquiry) throw new HttpError(404, 'Enquiry not found.');
  const settings = await getSettings();
  if (type === 'enquiry_admin') {
    const to = adminRecipient(settings);
    if (!to) return { status: 'skipped', reason: 'No admin email configured' };
    const mail = T.enquiryAdminEmail({ enquiry, settings, adminUrl: `${env.clientUrl}/admin/enquiries?open=${enquiry.id}` });
    return sendLoggedEmail({ type, to, ...mail, relatedType: 'enquiry', relatedId: enquiry.id, logId });
  }
  if (type === 'enquiry_ack') {
    const mail = T.enquiryAckEmail({ enquiry, settings });
    return sendLoggedEmail({ type, to: enquiry.email, ...mail, relatedType: 'enquiry', relatedId: enquiry.id, logId });
  }
  throw new HttpError(400, 'Unknown email type.');
}

export async function notifyEnquiry(enquiryId) {
  try {
    const settings = await getSettings();
    if (flag(settings, 'email_notify_enquiries')) await sendEnquiryEmail('enquiry_admin', enquiryId);
    if (flag(settings, 'email_contact_ack')) await sendEnquiryEmail('enquiry_ack', enquiryId);
  } catch (err) {
    console.error(`[notify] enquiry ${enquiryId} emails failed:`, err.message);
  }
}

export async function sendEnquiryReply(enquiry, message) {
  const settings = await getSettings();
  const mail = T.adminReplyEmail({ enquiry, message, settings });
  return sendLoggedEmail({ type: 'enquiry_reply', to: enquiry.email, ...mail, relatedType: 'enquiry', relatedId: enquiry.id });
}

export async function notifyNewsletter(email, subscriberId) {
  try {
    const settings = await getSettings();
    const to = adminRecipient(settings);
    if (!flag(settings, 'email_notify_newsletter') || !to) return;
    const mail = T.newsletterAdminEmail({ email, settings });
    await sendLoggedEmail({ type: 'newsletter_admin', to, ...mail, relatedType: 'newsletter', relatedId: subscriberId });
  } catch (err) {
    console.error('[notify] newsletter email failed:', err.message);
  }
}

export async function sendPasswordReset(customer, link) {
  const settings = await getSettings();
  const mail = T.passwordResetEmail({ name: customer.name, link, settings });
  return sendLoggedEmail({ type: 'password_reset', to: customer.email, ...mail, relatedType: 'customer', relatedId: customer.id });
}

export async function sendTestEmail(to) {
  const settings = await getSettings();
  return sendLoggedEmail({ type: 'test', to, ...T.testEmail({ settings }) });
}

const RETRYABLE = new Set(['order_customer', 'order_admin', 'order_status', 'enquiry_admin', 'enquiry_ack']);

/** Re-renders the email from current records and retries delivery on the same log row. */
export async function retryEmail(logId) {
  const log = await queryOne('SELECT * FROM email_notification_logs WHERE id = ?', [logId]);
  if (!log) throw new HttpError(404, 'Email log not found.');
  if (log.status === 'sent') throw new HttpError(409, 'This email was already sent.');
  if (!RETRYABLE.has(log.type)) throw new HttpError(400, 'This type of email cannot be retried. Ask the customer to request it again.');
  if (log.related_type === 'order') return sendOrderEmail(log.type, log.related_id, { logId: log.id });
  return sendEnquiryEmail(log.type, log.related_id, { logId: log.id });
}
