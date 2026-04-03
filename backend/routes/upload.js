const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const path = require('path');

// Upload single file
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;

  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      path: req.file.path
    }
  });
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const files = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
    path: file.path
  }));

  res.json({
    success: true,
    data: files
  });
});

module.exports = router;
