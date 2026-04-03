# ⚡ Quick Start - StreamerLive Backend

## 🚀 Installation (30 seconds)

```bash
cd /home/openclaw/.openclaw/agents/lambo/projects/streamerlive/backend
./install.sh
```

That's it! The script will install dependencies and seed the database.

---

## 🎯 Start Server

```bash
npm start          # Production
npm run dev        # Development (auto-reload)
```

Server: **http://localhost:5000**

---

## 📡 Quick API Test

```bash
# Health check
curl http://localhost:5000/api/health

# Get all banners
curl http://localhost:5000/api/banners

# Get all sections
curl http://localhost:5000/api/sections

# Get settings
curl http://localhost:5000/api/settings
```

---

## 📚 Full Documentation

- **README.md** - Getting started guide
- **API_REFERENCE.md** - Complete API docs with examples
- **DELIVERY_SUMMARY.md** - Full project overview

---

## 🧪 Test Everything

```bash
./test-api.sh
```

Runs automated tests on all endpoints.

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main application |
| `db/seed.js` | Sample data |
| `routes/*.js` | API endpoints |
| `.env` | Configuration |

---

## 💡 Common Tasks

### Reset Database
```bash
rm db/streamerlive.db
npm run seed
```

### Change Port
Edit `.env`:
```env
PORT=3000
```

### View Logs
```bash
npm start
# Server logs appear in console
```

---

## 🎯 API Endpoints (TL;DR)

- `GET /api/banners` - List banners
- `POST /api/banners` - Create banner
- `GET /api/sections` - List sections
- `POST /api/sections` - Create section
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `POST /api/upload` - Upload file

**Full docs:** See API_REFERENCE.md

---

## ✅ What's Included

- ✅ 3 sample banners
- ✅ 5 complete sections
- ✅ Pre-configured settings
- ✅ File upload ready
- ✅ CORS enabled
- ✅ Full documentation

---

## 🆘 Troubleshooting

**Server won't start?**
```bash
npm install
```

**Database issues?**
```bash
rm db/streamerlive.db
npm run seed
```

**Port already in use?**
Edit `.env` and change `PORT=5000` to another port.

---

**Ready to build the frontend? All APIs are live!** 🎉
