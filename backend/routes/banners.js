const express = require('express');
const router = express.Router();
const db = require('../db/init');

// Get all banners
router.get('/', (req, res) => {
  const active = req.query.active;
  let query = 'SELECT * FROM banners';
  const params = [];

  if (active !== undefined) {
    query += ' WHERE active = ?';
    params.push(active === 'true' ? 1 : 0);
  }

  query += ' ORDER BY position ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// Get single banner
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM banners WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json({ success: true, data: row });
  });
});

// Create banner
router.post('/', (req, res) => {
  const { title, imageUrl, videoUrl, gifUrl, mediaType, width, height, position, effect, link, active } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const query = `
    INSERT INTO banners (title, imageUrl, videoUrl, gifUrl, mediaType, width, height, position, effect, link, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    title,
    imageUrl || null,
    videoUrl || null,
    gifUrl || null,
    mediaType || 'image',
    width || null,
    height || null,
    position || 0,
    effect || 'none',
    link || null,
    active !== undefined ? (active ? 1 : 0) : 1
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      success: true,
      data: {
        id: this.lastID,
        ...req.body
      }
    });
  });
});

// Update banner
router.put('/:id', (req, res) => {
  const { title, imageUrl, videoUrl, gifUrl, mediaType, width, height, position, effect, link, active } = req.body;

  const query = `
    UPDATE banners
    SET title = ?, imageUrl = ?, videoUrl = ?, gifUrl = ?, mediaType = ?, 
        width = ?, height = ?, position = ?, effect = ?, link = ?, active = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    title,
    imageUrl || null,
    videoUrl || null,
    gifUrl || null,
    mediaType || 'image',
    width || null,
    height || null,
    position || 0,
    effect || 'none',
    link || null,
    active !== undefined ? (active ? 1 : 0) : 1,
    req.params.id
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  });
});

// Delete banner
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM banners WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json({ success: true, message: 'Banner deleted' });
  });
});

module.exports = router;
