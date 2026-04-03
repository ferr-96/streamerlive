# 🏗️ Architecture - StreamerLive Backend

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend / Client                       │
│          (React, Vue, or any HTTP client)                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                        │
│                   (Port 5000 / .env)                        │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer:                                          │
│  ├─ CORS               (Enable cross-origin requests)       │
│  ├─ Body Parser        (Parse JSON payloads)               │
│  ├─ Multer             (Handle file uploads)               │
│  └─ Static Files       (Serve /uploads/*)                  │
├─────────────────────────────────────────────────────────────┤
│  API Routes:                                                │
│  ├─ /api/banners       → routes/banners.js                 │
│  ├─ /api/sections      → routes/sections.js                │
│  ├─ /api/settings      → routes/settings.js                │
│  ├─ /api/upload        → routes/upload.js                  │
│  └─ /api/health        → Health check                      │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SQLite Database                            │
│                 (streamerlive.db)                           │
├─────────────────────────────────────────────────────────────┤
│  Tables:                                                    │
│  ├─ banners     (id, title, imageUrl, mediaType, ...)      │
│  ├─ sections    (id, sectionType, content JSON, ...)       │
│  └─ settings    (id, logo, colors, socialLinks JSON)       │
└─────────────────────────────────────────────────────────────┘

                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  File System Storage                         │
│                    (./uploads/)                             │
├─────────────────────────────────────────────────────────────┤
│  ├─ images/     (JPEG, PNG, WebP)                          │
│  ├─ videos/     (MP4, WebM, MOV)                           │
│  └─ gifs/       (GIF animations)                           │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. GET Request (e.g., fetch banners)
```
Client → Express → CORS Check → Route Handler → DB Query → JSON Response
```

### 2. POST Request (e.g., create banner)
```
Client → Express → CORS → Body Parser → Validation → DB Insert → Response
```

### 3. File Upload
```
Client → Express → CORS → Multer → Validate Type/Size → Save to Disk → DB Update → Response
```

## Component Breakdown

### Server Layer (server.js)
```javascript
Express App
├─ Load environment (.env)
├─ Apply middleware (CORS, JSON, static)
├─ Mount routes
│  ├─ /api/banners
│  ├─ /api/sections
│  ├─ /api/settings
│  └─ /api/upload
├─ Error handlers (404, 500)
└─ Start HTTP listener (port 5000)
```

### Database Layer (db/init.js)
```javascript
SQLite Connection
├─ Create/open database file
├─ Initialize tables if missing
│  ├─ banners (media content)
│  ├─ sections (page sections)
│  └─ settings (site config)
└─ Export db connection
```

### Routes Layer
```javascript
routes/
├─ banners.js      CRUD for banner entities
├─ sections.js     CRUD for section entities
├─ settings.js     GET/PUT for site settings
└─ upload.js       File upload handling
```

### Middleware Layer
```javascript
middleware/
└─ upload.js
   ├─ Configure storage (destination, filename)
   ├─ File filter (type validation)
   └─ Size limits (50MB)
```

## Data Models

### Banner Schema
```sql
CREATE TABLE banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  imageUrl TEXT,
  videoUrl TEXT,
  gifUrl TEXT,
  mediaType TEXT CHECK(mediaType IN ('image','video','gif')),
  width INTEGER,
  height INTEGER,
  position INTEGER DEFAULT 0,
  effect TEXT CHECK(effect IN ('fade','slide','zoom','none')),
  link TEXT,
  active INTEGER DEFAULT 1,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### Section Schema
```sql
CREATE TABLE sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sectionType TEXT CHECK(sectionType IN ('hero','features','streamers','download','footer')),
  title TEXT,
  subtitle TEXT,
  content TEXT,           -- JSON stored as text
  orderNum INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### Settings Schema
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  logo TEXT,
  siteName TEXT DEFAULT 'StreamerLive',
  primaryColor TEXT DEFAULT '#6366f1',
  secondaryColor TEXT DEFAULT '#8b5cf6',
  accentColor TEXT DEFAULT '#ec4899',
  socialLinks TEXT,       -- JSON stored as text
  updatedAt DATETIME
)
```

## Security Features

```
┌─────────────────────────────────────┐
│      Security Measures              │
├─────────────────────────────────────┤
│ ✅ CORS (Cross-Origin Protection)   │
│ ✅ SQL Injection Prevention         │
│    (Parameterized queries)          │
│ ✅ File Type Validation             │
│ ✅ File Size Limits (50MB)          │
│ ✅ Input Validation                 │
│ ✅ Error Sanitization               │
│    (No stack traces to client)      │
└─────────────────────────────────────┘
```

## Scalability Considerations

### Current (MVP)
- **Database:** SQLite (single-file, portable)
- **Storage:** Local file system
- **Concurrency:** Node.js event loop (good for I/O)

### Future (Scale)
- **Database:** Migrate to PostgreSQL/MySQL
- **Storage:** S3/CDN for media files
- **Caching:** Redis for frequently accessed data
- **Load Balancing:** Multiple server instances

## File Upload Flow

```
1. Client POSTs file (multipart/form-data)
   ↓
2. Express receives request
   ↓
3. Multer middleware processes upload
   ↓
4. Validate file type & size
   ↓
5. Determine folder (images/videos/gifs)
   ↓
6. Generate unique filename (timestamp + random)
   ↓
7. Save to disk
   ↓
8. Return file metadata + URL
   ↓
9. Client uses URL in banner/section
```

## API Response Pattern

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Additional context"  // optional
}
```

### HTTP Status Codes
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Environment Configuration

```
┌──────────────────────────┐
│     .env Variables       │
├──────────────────────────┤
│ PORT=5000               │ → Server port
│ DB_PATH=./db/...        │ → Database location
│ UPLOAD_DIR=./uploads    │ → File storage
└──────────────────────────┘
```

## Deployment Architecture

### Development
```
Developer Machine
├─ Node.js server (localhost:5000)
├─ SQLite database (local file)
└─ Uploads folder (local disk)
```

### Production (Recommended)
```
VPS / Cloud Server
├─ Node.js (PM2 process manager)
├─ Nginx (reverse proxy)
├─ Database (PostgreSQL or keep SQLite)
├─ S3/CDN (media files)
└─ SSL/TLS (HTTPS)
```

## Performance Characteristics

- **Database Queries:** Fast (indexed primary keys)
- **File Uploads:** Limited by disk I/O
- **Static Files:** Served directly by Express
- **Concurrent Requests:** Handled by Node.js event loop

### Optimization Opportunities
1. Add database indexes on frequently queried fields
2. Implement caching for settings (rarely change)
3. Use CDN for uploaded media
4. Add pagination for large result sets

## Tech Stack Summary

```
┌─────────────────────────────────────┐
│         Technology Stack            │
├─────────────────────────────────────┤
│ Runtime:      Node.js               │
│ Framework:    Express.js            │
│ Database:     SQLite3               │
│ File Upload:  Multer                │
│ CORS:         cors middleware       │
│ Environment:  dotenv                │
└─────────────────────────────────────┘
```

## Directory Layout

```
backend/
├── server.js                 Entry point
├── db/
│   ├── init.js              DB initialization
│   ├── seed.js              Sample data
│   └── streamerlive.db      SQLite file (created)
├── routes/
│   ├── banners.js           Banner endpoints
│   ├── sections.js          Section endpoints
│   ├── settings.js          Settings endpoints
│   └── upload.js            Upload endpoints
├── middleware/
│   └── upload.js            Multer config
└── uploads/
    ├── images/              Image storage
    ├── videos/              Video storage
    └── gifs/                GIF storage
```

---

**Architecture Type:** MVC-inspired (Model-Route-Controller)  
**Design Pattern:** RESTful API  
**Database Pattern:** Active Record (direct SQL)  
**Scalability:** Horizontal (add more instances) + Vertical (more resources)

---

Built with simplicity and scalability in mind. ⚡
