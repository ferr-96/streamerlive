# StreamerLive Backend API

Backend API for StreamerLive landing page CMS built with Node.js, Express, and SQLite.

## Features

- ✅ Full CRUD for Banners (images, videos, GIFs)
- ✅ Full CRUD for Sections (hero, features, streamers, download, footer)
- ✅ Site Settings management (logo, colors, social links)
- ✅ Media upload endpoint with file type validation
- ✅ SQLite database with automatic initialization
- ✅ Seed data for quick start
- ✅ CORS enabled for frontend integration
- ✅ Static file serving for uploads

## Quick Start

### 1. Install Dependencies

```bash
cd /home/openclaw/.openclaw/agents/lambo/projects/streamerlive/backend
npm install
```

### 2. Seed the Database

```bash
npm run seed
```

This creates the database and populates it with sample data:
- 3 sample banners
- 5 sections (hero, features, streamers, download, footer)
- Site settings with branding

### 3. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server runs on http://localhost:5000

## API Endpoints

### Banners

- `GET /api/banners` - Get all banners (query: `?active=true`)
- `GET /api/banners/:id` - Get single banner
- `POST /api/banners` - Create banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

**Banner fields:**
```json
{
  "title": "Welcome Banner",
  "imageUrl": "https://...",
  "videoUrl": null,
  "gifUrl": null,
  "mediaType": "image",
  "width": 1200,
  "height": 600,
  "position": 1,
  "effect": "fade",
  "link": "https://...",
  "active": true
}
```

### Sections

- `GET /api/sections` - Get all sections (query: `?active=true&sectionType=hero`)
- `GET /api/sections/:id` - Get single section
- `POST /api/sections` - Create section
- `PUT /api/sections/:id` - Update section
- `DELETE /api/sections/:id` - Delete section

**Section types:** `hero`, `features`, `streamers`, `download`, `footer`

**Section fields:**
```json
{
  "sectionType": "hero",
  "title": "Stream Like a Pro",
  "subtitle": "The ultimate platform",
  "content": {
    "ctaText": "Get Started",
    "ctaLink": "/signup"
  },
  "orderNum": 1,
  "active": true
}
```

### Settings

- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings

**Settings fields:**
```json
{
  "logo": "https://...",
  "siteName": "StreamerLive",
  "primaryColor": "#6366f1",
  "secondaryColor": "#8b5cf6",
  "accentColor": "#ec4899",
  "socialLinks": {
    "twitter": "https://...",
    "facebook": "https://...",
    "instagram": "https://..."
  }
}
```

### Upload

- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

**Upload request (multipart/form-data):**
```
field: file (or files for multiple)
```

**Supported formats:** JPEG, PNG, GIF, WebP, MP4, WebM, MOV
**Max size:** 50MB per file

### Health

- `GET /api/health` - API health check

## File Structure

```
backend/
├── db/
│   ├── init.js          # Database initialization
│   ├── seed.js          # Seed data script
│   └── streamerlive.db  # SQLite database (created on first run)
├── routes/
│   ├── banners.js       # Banner endpoints
│   ├── sections.js      # Section endpoints
│   ├── settings.js      # Settings endpoints
│   └── upload.js        # Upload endpoints
├── middleware/
│   └── upload.js        # Multer configuration
├── uploads/             # Uploaded media (auto-created)
│   ├── images/
│   ├── videos/
│   └── gifs/
├── server.js            # Main Express app
├── package.json
├── .env
└── README.md
```

## Environment Variables

```env
PORT=5000
DB_PATH=./db/streamerlive.db
UPLOAD_DIR=./uploads
```

## Development

```bash
# Install dependencies
npm install

# Seed database
npm run seed

# Start dev server (with auto-reload)
npm run dev

# Production start
npm start
```

## Testing with cURL

```bash
# Get all banners
curl http://localhost:5000/api/banners

# Create a banner
curl -X POST http://localhost:5000/api/banners \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Banner",
    "imageUrl": "https://example.com/image.jpg",
    "mediaType": "image",
    "position": 1
  }'

# Upload a file
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/image.jpg"
```

## Notes

- Database is automatically created on first run
- All timestamps are stored in UTC
- JSON fields (content, socialLinks) are automatically parsed/stringified
- CORS is enabled for all origins (configure in production)
- Uploaded files are organized by type (images/videos/gifs)

---

Built with ⚡ by Bolt
