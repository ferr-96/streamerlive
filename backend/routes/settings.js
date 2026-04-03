const express = require('express');
const router = express.Router();
const db = require('../db/init');

// Get settings
router.get('/', (req, res) => {
  db.get('SELECT * FROM settings ORDER BY id DESC LIMIT 1', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    // Parse JSON socialLinks
    if (row.socialLinks) {
      row.socialLinks = JSON.parse(row.socialLinks);
    }
    
    res.json({ success: true, data: row });
  });
});

// Update settings
router.put('/', (req, res) => {
  const { logo, siteName, primaryColor, secondaryColor, accentColor, socialLinks } = req.body;

  // First check if settings exist
  db.get('SELECT id FROM settings LIMIT 1', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const socialLinksJson = socialLinks ? JSON.stringify(socialLinks) : null;

    if (row) {
      // Update existing settings
      const query = `
        UPDATE settings
        SET logo = ?, siteName = ?, primaryColor = ?, secondaryColor = ?, accentColor = ?, 
            socialLinks = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const params = [
        logo || null,
        siteName || 'StreamerLive',
        primaryColor || '#6366f1',
        secondaryColor || '#8b5cf6',
        accentColor || '#ec4899',
        socialLinksJson,
        row.id
      ];

      db.run(query, params, function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, data: { id: row.id, ...req.body } });
      });
    } else {
      // Create new settings
      const query = `
        INSERT INTO settings (logo, siteName, primaryColor, secondaryColor, accentColor, socialLinks)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const params = [
        logo || null,
        siteName || 'StreamerLive',
        primaryColor || '#6366f1',
        secondaryColor || '#8b5cf6',
        accentColor || '#ec4899',
        socialLinksJson
      ];

      db.run(query, params, function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ success: true, data: { id: this.lastID, ...req.body } });
      });
    }
  });
});

module.exports = router;
