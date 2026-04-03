require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'streamerlive.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Seeding database...');

db.serialize(() => {
  // Clear existing data
  db.run('DELETE FROM banners');
  db.run('DELETE FROM sections');
  db.run('DELETE FROM settings');

  // Seed Banners
  const bannerStmt = db.prepare(`
    INSERT INTO banners (title, imageUrl, videoUrl, gifUrl, mediaType, width, height, position, effect, link, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  bannerStmt.run('Welcome to StreamerLive', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200', null, null, 'image', 1200, 600, 1, 'fade', null, 1);
  bannerStmt.run('Go Live Today', null, 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', null, 'video', 1920, 1080, 2, 'slide', 'https://streamerlive.com/start', 1);
  bannerStmt.run('Join Our Community', null, null, 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', 'gif', 800, 450, 3, 'zoom', 'https://streamerlive.com/community', 1);
  bannerStmt.finalize();

  // Seed Sections
  const sectionStmt = db.prepare(`
    INSERT INTO sections (sectionType, title, subtitle, content, orderNum, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  sectionStmt.run(
    'hero',
    'Stream Like a Pro',
    'The ultimate platform for content creators',
    JSON.stringify({
      ctaText: 'Get Started',
      ctaLink: '/signup',
      backgroundImage: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=1920'
    }),
    1,
    1
  );

  sectionStmt.run(
    'features',
    'Why StreamerLive?',
    'Everything you need to grow your audience',
    JSON.stringify({
      features: [
        {
          icon: '🎥',
          title: 'HD Streaming',
          description: 'Crystal clear 1080p streaming with low latency'
        },
        {
          icon: '💬',
          title: 'Interactive Chat',
          description: 'Engage with your audience in real-time'
        },
        {
          icon: '📊',
          title: 'Analytics',
          description: 'Track your growth with detailed insights'
        },
        {
          icon: '💰',
          title: 'Monetization',
          description: 'Multiple revenue streams for creators'
        }
      ]
    }),
    2,
    1
  );

  sectionStmt.run(
    'streamers',
    'Featured Streamers',
    'Join our amazing community of creators',
    JSON.stringify({
      streamers: [
        {
          name: 'GamerPro123',
          avatar: 'https://i.pravatar.cc/150?img=12',
          followers: '125K',
          category: 'Gaming'
        },
        {
          name: 'ArtistVibes',
          avatar: 'https://i.pravatar.cc/150?img=45',
          followers: '89K',
          category: 'Art'
        },
        {
          name: 'TechTalker',
          avatar: 'https://i.pravatar.cc/150?img=33',
          followers: '203K',
          category: 'Technology'
        },
        {
          name: 'MusicMaven',
          avatar: 'https://i.pravatar.cc/150?img=27',
          followers: '156K',
          category: 'Music'
        }
      ]
    }),
    3,
    1
  );

  sectionStmt.run(
    'download',
    'Download Our App',
    'Stream anywhere, anytime',
    JSON.stringify({
      appStoreLink: 'https://apps.apple.com/streamerlive',
      playStoreLink: 'https://play.google.com/store/apps/streamerlive',
      features: ['Mobile streaming', 'Push notifications', 'Offline viewing']
    }),
    4,
    1
  );

  sectionStmt.run(
    'footer',
    'StreamerLive',
    'Your streaming journey starts here',
    JSON.stringify({
      links: {
        company: ['About', 'Careers', 'Press'],
        support: ['Help Center', 'Community', 'Contact'],
        legal: ['Privacy', 'Terms', 'Guidelines']
      },
      copyright: '© 2026 StreamerLive. All rights reserved.'
    }),
    5,
    1
  );

  sectionStmt.finalize();

  // Seed Settings
  db.run(`
    INSERT INTO settings (logo, siteName, primaryColor, secondaryColor, accentColor, socialLinks)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    'https://via.placeholder.com/200x50/6366f1/ffffff?text=StreamerLive',
    'StreamerLive',
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    JSON.stringify({
      twitter: 'https://twitter.com/streamerlive',
      facebook: 'https://facebook.com/streamerlive',
      instagram: 'https://instagram.com/streamerlive',
      discord: 'https://discord.gg/streamerlive',
      youtube: 'https://youtube.com/@streamerlive'
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('📊 Sample data:');
  console.log('   - 3 banners');
  console.log('   - 5 sections (hero, features, streamers, download, footer)');
  console.log('   - Site settings with branding');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed');
  }
});
