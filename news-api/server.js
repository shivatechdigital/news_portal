require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors({
  origin: [
    'https://news.shivatechdigital.com',
    'http://localhost:3002',
    'http://localhost:3003'
  ],
  credentials: true
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

pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'author') NOT NULL DEFAULT 'author',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`).catch((error) => console.error('Admin users initialization failed:', error.message));

pool.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
)`).catch((error) => console.error('Admin sessions initialization failed:', error.message));

const parseCookies = (request) => Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map((part) => {
  const index = part.indexOf('=');
  return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
}));
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
const verifyPassword = (password, stored) => {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), crypto.scryptSync(password, salt, 64));
};
const sessionHash = (token) => crypto.createHash('sha256').update(token).digest('hex');
const sessionCookie = (token, maxAge) => `news_admin_session=${token}; Path=/; Domain=.shivatechdigital.com; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

const requireAuth = async (req, res, next) => {
  try {
    const token = parseCookies(req).news_admin_session;
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.is_active
       FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1`,
      [sessionHash(token)]
    );
    if (!rows.length || !rows[0].is_active) return res.status(401).json({ error: 'Session expired' });
    req.adminUser = rows[0];
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const requireAdmin = (req, res, next) => req.adminUser?.role === 'admin' ? next() : res.status(403).json({ error: 'Admin role required' });

const permissionDefaults = {
  admin: ['dashboard.view', 'articles.view', 'articles.create', 'articles.edit', 'articles.delete', 'articles.publish', 'categories.view', 'categories.manage', 'categories.delete', 'users.view', 'users.create', 'users.edit', 'users.delete', 'roles.manage', 'analytics.view', 'sources.view', 'settings.manage', 'profile.edit'],
  editor: ['dashboard.view', 'articles.view', 'articles.create', 'articles.edit', 'articles.publish', 'categories.view', 'analytics.view', 'sources.view', 'profile.edit'],
  author: ['dashboard.view', 'articles.view', 'articles.create', 'profile.edit'],
};
const loadPermissions = async (role) => {
  const [rows] = await pool.query('SELECT permission FROM role_permissions WHERE role = ? ORDER BY permission', [role]);
  return rows.map((row) => row.permission);
};
const requirePermission = (permission) => async (req, res, next) => {
  const permissions = await loadPermissions(req.adminUser.role);
  return permissions.includes(permission) ? next() : res.status(403).json({ error: `Permission required: ${permission}` });
};

const seedAdmin = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'author') NOT NULL DEFAULT 'author',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash CHAR(64) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS role_permissions (
    role ENUM('admin', 'editor', 'author') NOT NULL,
    permission VARCHAR(80) NOT NULL,
    PRIMARY KEY (role, permission)
  )`);
  for (const [role, permissions] of Object.entries(permissionDefaults)) {
    const [existing] = await pool.query('SELECT COUNT(*) AS total FROM role_permissions WHERE role = ?', [role]);
    if (!Number(existing[0].total)) {
      await pool.query('INSERT INTO role_permissions (role, permission) VALUES ?', [permissions.map((permission) => [role, permission])]);
    }
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
  const [rows] = await pool.query('SELECT id FROM admin_users LIMIT 1');
  if (!rows.length) {
    await pool.query(
      'INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [process.env.ADMIN_NAME || 'Administrator', process.env.ADMIN_EMAIL.toLowerCase(), hashPassword(process.env.ADMIN_PASSWORD), 'admin']
    );
    console.log('Initial admin account created');
  }
};
seedAdmin().catch((error) => console.error('Initial admin setup failed:', error.message));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1', [email]);
    if (!rows.length || !verifyPassword(password, rows[0].password_hash)) return res.status(401).json({ error: 'Invalid email or password' });
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query('INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))', [sessionHash(token), rows[0].id]);
    res.setHeader('Set-Cookie', sessionCookie(token, 7 * 24 * 60 * 60));
    const permissions = await loadPermissions(rows[0].role);
    res.json({ user: { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role, permissions } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', requireAuth, async (req, res) => {
  const token = parseCookies(req).news_admin_session;
  await pool.query('DELETE FROM admin_sessions WHERE token_hash = ?', [sessionHash(token)]);
  res.setHeader('Set-Cookie', sessionCookie('', 0));
  res.json({ message: 'Signed out' });
});

app.get('/api/auth/me', requireAuth, async (req, res) => res.json({ user: { ...req.adminUser, permissions: await loadPermissions(req.adminUser.role) } }));

app.put('/api/auth/profile', requireAuth, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const currentPassword = String(req.body.current_password || '');
    const newPassword = String(req.body.new_password || '');
    if (!name) return res.status(400).json({ error: 'Name is required' });

    if (newPassword) {
      if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });
      const [rows] = await pool.query('SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1', [req.adminUser.id]);
      if (!rows.length || !verifyPassword(currentPassword, rows[0].password_hash)) return res.status(401).json({ error: 'Current password is incorrect' });
      await pool.query('UPDATE admin_users SET name = ?, password_hash = ? WHERE id = ?', [name, hashPassword(newPassword), req.adminUser.id]);
      await pool.query('DELETE FROM admin_sessions WHERE user_id = ? AND token_hash <> ?', [req.adminUser.id, sessionHash(parseCookies(req).news_admin_session)]);
    } else {
      await pool.query('UPDATE admin_users SET name = ? WHERE id = ?', [name, req.adminUser.id]);
    }

    res.json({ message: 'Profile updated', user: { ...req.adminUser, name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/roles', requireAuth, requireAdmin, async (_req, res) => {
  const roles = {};
  for (const role of ['admin', 'editor', 'author']) roles[role] = await loadPermissions(role);
  res.json({ roles, defaults: permissionDefaults });
});

app.put('/api/roles/:role/permissions', requireAuth, requireAdmin, async (req, res) => {
  const role = req.params.role;
  const permissions = Array.isArray(req.body.permissions) ? [...new Set(req.body.permissions.map(String))] : [];
  if (role === 'admin' && !permissions.includes('roles.manage')) permissions.push('roles.manage');
  if (!['admin', 'editor', 'author'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  const allowed = new Set(Object.values(permissionDefaults).flat());
  if (permissions.some((permission) => !allowed.has(permission))) return res.status(400).json({ error: 'Invalid permission' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM role_permissions WHERE role = ?', [role]);
    if (permissions.length) await connection.query('INSERT INTO role_permissions (role, permission) VALUES ?', [permissions.map((permission) => [role, permission])]);
    await connection.commit();
    res.json({ role, permissions });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/users', requireAuth, requirePermission('users.view'), async (_req, res) => {
  const [users] = await pool.query('SELECT id, name, email, role, is_active, created_at FROM admin_users ORDER BY id ASC');
  res.json({ users });
});

app.post('/api/users', requireAuth, requirePermission('users.create'), async (req, res) => {
  try {
    const { name, email, password, role = 'author' } = req.body;
    if (!name || !email || !password || password.length < 8 || !['admin', 'editor', 'author'].includes(role)) return res.status(400).json({ error: 'Valid name, email, password (8+ chars), and role are required' });
    const [result] = await pool.query('INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, String(email).toLowerCase(), hashPassword(password), role]);
    res.status(201).json({ id: result.insertId, message: 'User created' });
  } catch (error) {
    res.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ error: error.code === 'ER_DUP_ENTRY' ? 'Email already exists' : error.message });
  }
});

app.put('/api/users/:id', requireAuth, requirePermission('users.edit'), async (req, res) => {
  const { name, role, is_active } = req.body;
  if (!name || !['admin', 'editor', 'author'].includes(role)) return res.status(400).json({ error: 'Valid name and role required' });
  await pool.query('UPDATE admin_users SET name = ?, role = ?, is_active = ? WHERE id = ?', [name, role, is_active ? 1 : 0, req.params.id]);
  res.json({ message: 'User updated' });
});

app.delete('/api/users/:id', requireAuth, requirePermission('users.delete'), async (req, res) => {
  if (Number(req.params.id) === Number(req.adminUser.id)) return res.status(400).json({ error: 'You cannot delete your own account' });
  await pool.query('DELETE FROM admin_users WHERE id = ?', [req.params.id]);
  res.json({ message: 'User deleted' });
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

app.put('/api/categories/:category/status', requireAuth, requirePermission('categories.manage'), async (req, res) => {
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

app.delete('/api/categories/:category', requireAuth, requirePermission('categories.delete'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query('DELETE FROM articles WHERE category = ?', [req.params.category]);
    await connection.query('DELETE FROM category_settings WHERE category = ?', [req.params.category]);
    await connection.commit();
    res.json({ message: 'Category and all articles deleted', deleted_articles: result.affectedRows });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/articles', (req, res, next) => req.query.admin === 'true' ? requireAuth(req, res, () => requirePermission('articles.view')(req, res, next)) : next(), async (req, res) => {
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

app.put('/api/articles/:id', requireAuth, requirePermission('articles.edit'), async (req, res) => {
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

app.delete('/api/articles/:id', requireAuth, requirePermission('articles.delete'), async (req, res) => {
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
