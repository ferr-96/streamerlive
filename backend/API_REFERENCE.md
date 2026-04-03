# API Reference - StreamerLive Backend

Base URL: `http://localhost:5000`

---

## 🏥 Health Check

### GET /api/health

Check if API is running.

**Response:**
```json
{
  "success": true,
  "message": "StreamerLive API is running",
  "timestamp": "2026-04-03T03:47:00.000Z"
}
```

---

## 🎯 Banners

### GET /api/banners

Get all banners, optionally filtered.

**Query Parameters:**
- `active` (optional): `true` or `false` - filter by active status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Welcome to StreamerLive",
      "imageUrl": "https://example.com/image.jpg",
      "videoUrl": null,
      "gifUrl": null,
      "mediaType": "image",
      "width": 1200,
      "height": 600,
      "position": 1,
      "effect": "fade",
      "link": null,
      "active": 1,
      "createdAt": "2026-04-03 03:00:00",
      "updatedAt": "2026-04-03 03:00:00"
    }
  ]
}
```

### GET /api/banners/:id

Get a single banner by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Welcome Banner",
    "imageUrl": "https://example.com/image.jpg",
    ...
  }
}
```

### POST /api/banners

Create a new banner.

**Request Body:**
```json
{
  "title": "New Banner",
  "imageUrl": "https://example.com/image.jpg",
  "videoUrl": null,
  "gifUrl": null,
  "mediaType": "image",
  "width": 1200,
  "height": 600,
  "position": 1,
  "effect": "fade",
  "link": "https://example.com",
  "active": true
}
```

**Required:** `title`  
**Media Types:** `image`, `video`, `gif`  
**Effects:** `fade`, `slide`, `zoom`, `none`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "New Banner",
    ...
  }
}
```

### PUT /api/banners/:id

Update an existing banner.

**Request Body:** Same as POST (all fields optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Banner",
    ...
  }
}
```

### DELETE /api/banners/:id

Delete a banner.

**Response:**
```json
{
  "success": true,
  "message": "Banner deleted"
}
```

---

## 📄 Sections

### GET /api/sections

Get all sections, optionally filtered.

**Query Parameters:**
- `active` (optional): `true` or `false`
- `sectionType` (optional): `hero`, `features`, `streamers`, `download`, `footer`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sectionType": "hero",
      "title": "Stream Like a Pro",
      "subtitle": "The ultimate platform",
      "content": {
        "ctaText": "Get Started",
        "ctaLink": "/signup",
        "backgroundImage": "https://..."
      },
      "orderNum": 1,
      "active": 1,
      "createdAt": "2026-04-03 03:00:00",
      "updatedAt": "2026-04-03 03:00:00"
    }
  ]
}
```

Note: `content` is automatically parsed from JSON.

### GET /api/sections/:id

Get a single section by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sectionType": "hero",
    "content": { ... },
    ...
  }
}
```

### POST /api/sections

Create a new section.

**Request Body:**
```json
{
  "sectionType": "hero",
  "title": "New Hero Section",
  "subtitle": "Subtitle text",
  "content": {
    "ctaText": "Click Here",
    "ctaLink": "/action"
  },
  "orderNum": 1,
  "active": true
}
```

**Required:** `sectionType`  
**Valid Types:** `hero`, `features`, `streamers`, `download`, `footer`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "sectionType": "hero",
    ...
  }
}
```

### PUT /api/sections/:id

Update an existing section.

**Request Body:** Same as POST (all fields optional)

### DELETE /api/sections/:id

Delete a section.

**Response:**
```json
{
  "success": true,
  "message": "Section deleted"
}
```

---

## ⚙️ Settings

### GET /api/settings

Get site settings (always returns the latest settings record).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "logo": "https://example.com/logo.png",
    "siteName": "StreamerLive",
    "primaryColor": "#6366f1",
    "secondaryColor": "#8b5cf6",
    "accentColor": "#ec4899",
    "socialLinks": {
      "twitter": "https://twitter.com/streamerlive",
      "facebook": "https://facebook.com/streamerlive",
      "instagram": "https://instagram.com/streamerlive",
      "discord": "https://discord.gg/streamerlive",
      "youtube": "https://youtube.com/@streamerlive"
    },
    "updatedAt": "2026-04-03 03:00:00"
  }
}
```

### PUT /api/settings

Update site settings (creates if doesn't exist).

**Request Body:**
```json
{
  "logo": "https://example.com/new-logo.png",
  "siteName": "StreamerLive Pro",
  "primaryColor": "#FF0000",
  "secondaryColor": "#00FF00",
  "accentColor": "#0000FF",
  "socialLinks": {
    "twitter": "https://twitter.com/new",
    "tiktok": "https://tiktok.com/@new"
  }
}
```

All fields are optional. Partial updates are supported.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "logo": "https://example.com/new-logo.png",
    ...
  }
}
```

---

## 📤 Upload

### POST /api/upload

Upload a single file.

**Content-Type:** `multipart/form-data`

**Form Field:** `file`

**Supported Formats:**
- Images: JPEG, JPG, PNG, GIF, WebP
- Videos: MP4, WebM, MOV

**Max Size:** 50MB

**Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "file-1234567890-123456789.jpg",
    "originalName": "image.jpg",
    "mimetype": "image/jpeg",
    "size": 102400,
    "url": "/uploads/images/file-1234567890-123456789.jpg",
    "path": "/home/.../uploads/images/file-1234567890-123456789.jpg"
  }
}
```

### POST /api/upload/multiple

Upload multiple files (up to 10).

**Form Field:** `files` (array)

**Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/upload/multiple \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/video.mp4"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "filename": "files-1234567890-123456789.jpg",
      "originalName": "image1.jpg",
      "mimetype": "image/jpeg",
      "size": 102400,
      "url": "/uploads/images/files-1234567890-123456789.jpg",
      "path": "..."
    },
    {
      "filename": "files-1234567890-987654321.mp4",
      "originalName": "video.mp4",
      "mimetype": "video/mp4",
      "size": 2048000,
      "url": "/uploads/videos/files-1234567890-987654321.mp4",
      "path": "..."
    }
  ]
}
```

---

## 🖼️ Static Files

Uploaded files are served at:

```
http://localhost:5000/uploads/{type}/{filename}
```

Examples:
- `http://localhost:5000/uploads/images/file-123.jpg`
- `http://localhost:5000/uploads/videos/file-456.mp4`
- `http://localhost:5000/uploads/gifs/file-789.gif`

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Title is required"
}
```

### 404 Not Found
```json
{
  "error": "Banner not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database error message"
}
```

---

## 📝 Notes

- All boolean values in requests can be `true`/`false` or `1`/`0`
- Database stores booleans as `1` (true) or `0` (false)
- Timestamps are in UTC
- JSON fields (`content`, `socialLinks`) are automatically parsed/stringified
- Position/order fields determine display order (ascending)
- CORS is enabled for all origins (configure for production)

---

**Last Updated:** 2026-04-03  
**Version:** 1.0.0
