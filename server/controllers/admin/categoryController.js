import { z } from 'zod';
import { query, queryOne, withTransaction } from '../../config/db.js';
import { logActivity } from '../../services/activityLog.js';
import { slugify } from '../../utils/helpers.js';
import { text, optionalText, slug as slugField, imagePath } from '../../utils/validators.js';
import { HttpError, notFound, conflict } from '../../utils/httpError.js';

export const categorySchema = z.object({
  name: text(120, 2),
  slug: z.union([slugField, z.literal('')]).optional(),
  description: optionalText(1000),
  image_url: z.union([imagePath, z.null()]).optional().transform((v) => v || null),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
  status: z.enum(['active', 'coming_soon', 'inactive']),
  seo_title: optionalText(160),
  seo_description: optionalText(320),
});

export const reorderSchema = z.object({ ids: z.array(z.coerce.number().int().positive()).min(1).max(200) });
export const deleteCategorySchema = z.object({ reassignTo: z.coerce.number().int().positive().optional() });

export async function list(_req, res) {
  const items = await query(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
       FROM categories c ORDER BY c.sort_order, c.id`,
  );
  res.json({ items: items.map((c) => ({ ...c, product_count: Number(c.product_count) })) });
}

async function assertSlug(slug, id = 0) {
  const row = await queryOne('SELECT id FROM categories WHERE slug = ? AND id <> ?', [slug, id]);
  if (row) throw conflict('Another category already uses this slug.', { fields: { slug: 'Already in use.' } });
}

export async function create(req, res) {
  const d = req.valid.body;
  d.slug = d.slug || slugify(d.name);
  await assertSlug(d.slug);
  const r = await query(
    'INSERT INTO categories (name, slug, description, image_url, sort_order, status, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [d.name, d.slug, d.description, d.image_url, d.sort_order, d.status, d.seo_title, d.seo_description],
  );
  await logActivity(req, 'category.create', 'category', r.insertId, { name: d.name });
  res.status(201).json({ id: r.insertId });
}

export async function update(req, res) {
  const id = Number(req.params.id);
  const before = await queryOne('SELECT * FROM categories WHERE id = ?', [id]);
  if (!before) throw notFound('Category not found.');
  const d = req.valid.body;
  d.slug = d.slug || slugify(d.name);
  await assertSlug(d.slug, id);
  await query(
    'UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ?, sort_order = ?, status = ?, seo_title = ?, seo_description = ? WHERE id = ?',
    [d.name, d.slug, d.description, d.image_url, d.sort_order, d.status, d.seo_title, d.seo_description, id],
  );
  await logActivity(req, 'category.update', 'category', id, { name: d.name, status: before.status !== d.status ? { from: before.status, to: d.status } : undefined });
  res.json({ id });
}

export async function reorder(req, res) {
  const { ids } = req.valid.body;
  await withTransaction(async (conn) => {
    for (const [i, id] of ids.entries()) await conn.query('UPDATE categories SET sort_order = ? WHERE id = ?', [i + 1, id]);
  });
  await logActivity(req, 'category.reorder', 'category', null, { ids });
  res.json({ ok: true });
}

/** A category with products can only be deleted if its products are moved to another category first. */
export async function remove(req, res) {
  const id = Number(req.params.id);
  const cat = await queryOne('SELECT id, name FROM categories WHERE id = ?', [id]);
  if (!cat) throw notFound('Category not found.');
  const { reassignTo } = req.valid.body || {};
  const [{ n }] = await query('SELECT COUNT(*) AS n FROM products WHERE category_id = ?', [id]);
  if (Number(n) > 0) {
    if (!reassignTo) throw conflict(`This category has ${n} product(s). Move them to another category to delete it.`, { code: 'HAS_PRODUCTS', details: { productCount: Number(n) } });
    if (reassignTo === id) throw new HttpError(422, 'Choose a different category.');
    const target = await queryOne('SELECT id FROM categories WHERE id = ?', [reassignTo]);
    if (!target) throw new HttpError(422, 'The target category does not exist.');
  }
  await withTransaction(async (conn) => {
    if (Number(n) > 0) await conn.query('UPDATE products SET category_id = ? WHERE category_id = ?', [reassignTo, id]);
    await conn.query('DELETE FROM categories WHERE id = ?', [id]);
  });
  await logActivity(req, 'category.delete', 'category', id, { name: cat.name, reassignedTo: reassignTo || null, products: Number(n) });
  res.json({ ok: true });
}
