const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'streamerlive.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // Banners table
    db.run(`
      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        imageUrl TEXT,
        videoUrl TEXT,
        gifUrl TEXT,
        mediaType TEXT CHECK(mediaType IN ('image', 'video', 'gif')) DEFAULT 'image',
        width INTEGER,
        height INTEGER,
        position INTEGER DEFAULT 0,
        effect TEXT CHECK(effect IN ('fade', 'slide', 'zoom', 'none')) DEFAULT 'none',
        link TEXT,
        active INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sections table
    db.run(`
      CREATE TABLE IF NOT EXISTS sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sectionType TEXT CHECK(sectionType IN ('hero', 'features', 'streamers', 'download', 'footer')) NOT NULL,
        title TEXT,
        subtitle TEXT,
        content TEXT,
        orderNum INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        logo TEXT,
        siteName TEXT DEFAULT 'StreamerLive',
        primaryColor TEXT DEFAULT '#6366f1',
        secondaryColor TEXT DEFAULT '#8b5cf6',
        accentColor TEXT DEFAULT '#ec4899',
        socialLinks TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized');
  });
}

module.exports = db;
