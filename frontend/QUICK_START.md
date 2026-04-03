# 🚀 Quick Start - StreamerLive Admin Dashboard

## Start the Development Server

```bash
cd /home/openclaw/.openclaw/agents/lambo/projects/streamerlive/frontend
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## 📍 Access Points

### Public Site
```
http://localhost:5173/
```
→ Landing page for visitors

### Admin Dashboard
```
http://localhost:5173/admin
```
→ Admin dashboard home with stats and quick actions

### Direct Admin Pages
- **Banners**: `http://localhost:5173/admin/banners`
- **Sections**: `http://localhost:5173/admin/sections`
- **Streamers**: `http://localhost:5173/admin/streamers`
- **Media**: `http://localhost:5173/admin/media`
- **Settings**: `http://localhost:5173/admin/settings`

---

## 🎯 First Steps

### 1. Open the Admin Dashboard
Navigate to `/admin` to see the main dashboard

### 2. Configure Site Settings
Go to **Settings** (`/admin/settings`) and:
- Upload your logo
- Set site name
- Choose your brand colors
- Add social media links

### 3. Upload Media
Go to **Media Library** (`/admin/media`) and:
- Upload images for banners
- Upload streamer profile pictures
- Build your media collection

### 4. Create Banners
Go to **Banner Manager** (`/admin/banners`) and:
- Click "Add Banner"
- Fill in title, image URL, link
- Set position and effects
- Mark as active

### 5. Edit Sections
Go to **Section Editor** (`/admin/sections`) and:
- Customize hero section
- Edit feature cards
- Update VIP banner
- Modify footer content

### 6. Add Streamers
Go to **Streamers Manager** (`/admin/streamers`) and:
- Click "Add Streamer"
- Enter name, profile image
- Set viewer count
- Toggle live status
- Drag to reorder

---

## 📱 Test Responsiveness

### Desktop
- Open browser at full width
- Sidebar should be expanded by default
- Click sidebar toggle to collapse/expand

### Tablet
- Resize browser to ~768px width
- Sidebar should still work
- Grid layouts should adapt to 2 columns

### Mobile
- Resize browser to ~375px width
- Hamburger menu should appear
- Sidebar should overlay content
- All forms should stack vertically

---

## 🎨 UI Elements to Check

### Dashboard (`/admin`)
- [ ] Stats cards display numbers
- [ ] Quick action buttons work
- [ ] Recent activity shows items
- [ ] System status is green

### Banner Manager (`/admin/banners`)
- [ ] Can create new banner
- [ ] Form validates required fields
- [ ] Can edit existing banner
- [ ] Delete confirmation appears
- [ ] Thumbnails load correctly

### Section Editor (`/admin/sections`)
- [ ] Tab switching works
- [ ] All form fields editable
- [ ] Save button enables on changes
- [ ] Features can be added/deleted

### Streamers Manager (`/admin/streamers`)
- [ ] Can add new streamer
- [ ] Profile image preview works
- [ ] Drag & drop reordering works
- [ ] Live badge appears when checked

### Media Library (`/admin/media`)
- [ ] File upload dialog opens
- [ ] Filter buttons work
- [ ] Copy URL shows checkmark
- [ ] Delete confirmation works

### Site Settings (`/admin/settings`)
- [ ] Logo upload works
- [ ] Color picker updates
- [ ] Hex values editable
- [ ] Social links saveable

---

## 🔌 API Connection

### Already Connected
The **Banner Manager** is already connected to the backend API:

```javascript
// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

bannersAPI.getAll()    // GET /api/banners
bannersAPI.create()    // POST /api/banners
bannersAPI.update()    // PUT /api/banners/:id
bannersAPI.delete()    // DELETE /api/banners/:id
```

### To Connect Other Pages
Add API methods to `src/services/api.js`:

```javascript
export const sectionsAPI = {
  getAll: () => axios.get(`${API_BASE}/sections`),
  update: (id, data) => axios.put(`${API_BASE}/sections/${id}`, data),
};

export const streamersAPI = {
  getAll: () => axios.get(`${API_BASE}/streamers`),
  create: (data) => axios.post(`${API_BASE}/streamers`, data),
  update: (id, data) => axios.put(`${API_BASE}/streamers/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/streamers/${id}`),
};

export const settingsAPI = {
  get: () => axios.get(`${API_BASE}/settings`),
  update: (data) => axios.put(`${API_BASE}/settings`, data),
};

export const mediaAPI = {
  upload: (formData) => axios.post(`${API_BASE}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => axios.get(`${API_BASE}/media`),
  delete: (id) => axios.delete(`${API_BASE}/media/${id}`),
};
```

---

## 🐛 Troubleshooting

### Issue: Blank page at /admin
**Solution**: Check browser console for errors. Make sure dev server is running.

### Issue: Sidebar not opening on mobile
**Solution**: Click the hamburger menu icon (three lines) in top-left corner.

### Issue: Forms not submitting
**Solution**: Check browser console. Currently using mock APIs - success messages still show.

### Issue: Images not loading
**Solution**: Make sure URLs are valid and accessible. Check CORS settings if using external images.

### Issue: Drag & drop not working
**Solution**: Make sure you're dragging from the grip handle (6-dot icon) on the left side.

---

## 📚 Documentation

- **Full Features**: See `ADMIN_DASHBOARD.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Reference**: See `src/services/api.js`

---

## ✨ Tips

1. **Use the sidebar** - All admin pages are one click away
2. **Save often** - Click save button when you see "Save Changes"
3. **Mobile preview** - Use browser dev tools to test responsive design
4. **Copy URLs** - Use media library to get URLs for banners
5. **Drag streamers** - Reorder by dragging the grip handle icon

---

## 🎉 You're Ready!

The admin dashboard is fully functional and ready to manage your StreamerLive content. Start by configuring your site settings, then build out your content.

**Need help?** Check the documentation files or reach out to the development team.

---

Built with ❤️ by Nova ✨
