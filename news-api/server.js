require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'https://news.shivatechdigital.com',
    'http://localhost:3002'
  ]
}));

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

pool.query(`CREATE TABLE IF NOT EXISTS category_settings (
  category VARCHAR(50) PRIMARY KEY,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`).catch((error) => console.error('Category settings initialization failed:', error.message));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/categories', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.category AS name, COUNT(*) AS posts,
       COALESCE(MAX(cs.is_active), 1) AS is_active
       FROM articles a
       LEFT JOIN category_settings cs ON cs.category = a.category
       GROUP BY a.category
       ORDER BY a.category ASC`
    );
    res.json({ categories: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:category/status', async (req, res) => {
  try {
    const isActive = req.body.is_active ? 1 : 0;
    await pool.query(
      `INSERT INTO category_settings (category, is_active) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE is_active = VALUES(is_active)`,
      [req.params.category, isActive]
    );
    res.json({ category: req.params.category, is_active: Boolean(isActive) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const requestedLimit = Number(req.query.limit) || 20;
    const limit = Math.min(requestedLimit, req.query.admin === 'true' ? 1000 : 100);
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const includeAll = req.query.admin === 'true';

    const activeCategoryClause = `NOT EXISTS (
      SELECT 1 FROM category_settings cs
      WHERE cs.category = articles.category AND cs.is_active = 0
    )`;
    const where = category
      ? `${includeAll ? 'WHERE category = ?' : `WHERE status = ? AND category = ? AND ${activeCategoryClause}`}`
      : `${includeAll ? '' : `WHERE status = ? AND ${activeCategoryClause}`}`;

    const values = category
      ? (includeAll ? [category] : ['published', category])
      : (includeAll ? [] : ['published']);

    const [articles] = await pool.query(
      `SELECT * FROM articles ${where}
       ORDER BY published_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM articles ${where}`,
      values
    );

    const total = Number(countRows[0].total);

    res.json({
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM articles WHERE slug = ? AND status = ? LIMIT 1',
      [req.params.slug, 'published']
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
    const {
      title, slug, meta_description, content, summary, source_name,
      source_url, category, image_url, status
    } = req.body;
    const allowedCategories = ['india', 'world', 'business', 'sports', 'tech', 'entertainment', 'local'];

    if (!title || !slug || !content || !category || !allowedCategories.includes(category)) {
      return res.status(400).json({ error: 'Valid title, slug, content and category are required' });
    }

    const publishedAt = status === 'published' ? new Date() : null;
    const [result] = await pool.query(
      `UPDATE articles SET title = ?, slug = ?, meta_description = ?, content = ?,
       summary = ?, source_name = ?, source_url = ?, category = ?, image_url = ?,
       status = ?, published_at = COALESCE(?, published_at), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, slug, meta_description || '', content, summary || '', source_name || '', source_url || '', category, image_url || '', status || 'draft', publishedAt, req.params.id]
    );

    if (!result.affectedRows) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const {
      title,
      slug,
      meta_description,
      content,
      summary,
      source_name,
      source_url,
      category,
      image_url,
      status = 'draft'
    } = req.body;

    const allowedCategories = [
      'india',
      'world',
      'business',
      'sports',
      'tech',
      'entertainment',
      'local'
    ];

    if (!title || !slug || !content || !category) {
      return res.status(400).json({
        error: 'title, slug, content and category are required'
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid category'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO articles
      (title, slug, meta_description, content, summary, source_name,
       source_url, category, image_url, status, views, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        title,
        slug,
        meta_description || '',
        content,
        summary || '',
        source_name || '',
        source_url || '',
        category,
        image_url || '',
        status,
        status === 'published' ? new Date() : null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Article created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(Number(process.env.PORT || 3010), '0.0.0.0', () => {
  console.log(`News API running on port ${process.env.PORT || 3010}`);
});
