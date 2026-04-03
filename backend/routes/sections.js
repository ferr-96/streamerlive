const express = require('express');
const router = express.Router();
const db = require('../db/init');

// Get all sections
router.get('/', (req, res) => {
  const { active, sectionType } = req.query;
  let query = 'SELECT * FROM sections WHERE 1=1';
  const params = [];

  if (active !== undefined) {
    query += ' AND active = ?';
    params.push(active === 'true' ? 1 : 0);
  }

  if (sectionType) {
    query += ' AND sectionType = ?';
    params.push(sectionType);
  }

  query += ' ORDER BY orderNum ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Parse JSON content field
    const parsedRows = rows.map(row => ({
      ...row,
      content: row.content ? JSON.parse(row.content) : null
    }));
    
    res.json({ success: true, data: parsedRows });
  });
});

// Get single section
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM sections WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Parse JSON content
    if (row.content) {
      row.content = JSON.parse(row.content);
    }
    
    res.json({ success: true, data: row });
  });
});

// Create section
router.post('/', (req, res) => {
  const { sectionType, title, subtitle, content, orderNum, active } = req.body;

  if (!sectionType) {
    return res.status(400).json({ error: 'sectionType is required' });
  }

  const validTypes = ['hero', 'features', 'streamers', 'download', 'footer'];
  if (!validTypes.includes(sectionType)) {
    return res.status(400).json({ error: 'Invalid sectionType' });
  }

  const query = `
    INSERT INTO sections (sectionType, title, subtitle, content, orderNum, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [
    sectionType,
    title || null,
    subtitle || null,
    content ? JSON.stringify(content) : null,
    orderNum || 0,
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

// Update section
router.put('/:id', (req, res) => {
  const { sectionType, title, subtitle, content, orderNum, active } = req.body;

  const query = `
    UPDATE sections
    SET sectionType = ?, title = ?, subtitle = ?, content = ?, orderNum = ?, active = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    sectionType,
    title || null,
    subtitle || null,
    content ? JSON.stringify(content) : null,
    orderNum || 0,
    active !== undefined ? (active ? 1 : 0) : 1,
    req.params.id
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  });
});

// Delete section
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM sections WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({ success: true, message: 'Section deleted' });
  });
});

module.exports = router;
