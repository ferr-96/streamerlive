# StreamerLive Admin Dashboard

A complete, beautiful admin CMS for managing all content on the StreamerLive landing page.

## ✨ Features

### 🎨 Design
- **Dark Theme** - Professional dark UI (bg-gray-900, bg-gray-800)
- **Purple Accents** - Consistent purple (#a855f7) branding throughout
- **Responsive** - Mobile-first design with collapsible sidebar
- **Smooth Animations** - Transitions and hover effects on all interactions
- **Gradient Headers** - Beautiful purple-to-pink gradient text

### 📊 Dashboard Home (`/admin`)
- **Stats Cards**: Total Banners, Active Sections, Total Streamers, Site Visitors
- **Quick Actions**: Add Banner, Edit Hero, Upload Media
- **Recent Activity Feed**: Shows latest changes
- **System Status**: Real-time operational status

### 🖼️ Banner Manager (`/admin/banners`)
- Add/Edit/Delete promotional banners
- Support for images, videos, and GIFs
- Link URLs for click-through tracking
- Drag & drop reordering (coming soon)
- Active/Inactive toggle
- Size and position control
- Visual effects (fade, slide, zoom)
- Preview before save

### 📝 Section Editor (`/admin/sections`)
Edit all landing page sections:
- **Hero Section**: Title, subtitle, CTA buttons
- **Features**: Add/edit/delete feature cards with icons
- **VIP Banner**: Membership promotion content
- **Download Section**: App download call-to-action
- **Footer**: Description and social media links

### 🎬 Streamers Manager (`/admin/streamers`)
- Add/Edit/Delete featured streamer profiles
- Profile image, name, category
- Viewer count tracking
- Live/Offline status toggle
- **Drag & Drop Reordering**: Change display order easily
- Visual live indicator with animation

### 🗂️ Media Library (`/admin/media`)
- Upload images, videos, GIFs
- Grid view with thumbnails
- Filter by media type (all, images, videos)
- Copy URL to clipboard
- Delete unwanted media
- File size and upload date tracking
- Max 10MB per file

### ⚙️ Site Settings (`/admin/settings`)
- Upload/change site logo
- Edit site name
- **Color Theme Picker**: 
  - Primary color
  - Secondary color
  - Accent color
  - Live preview of colors
- **Social Media Links**:
  - Facebook, Twitter, Instagram
  - YouTube, Discord, Twitch
- Reset to defaults option

## 🚀 Getting Started

### Routes

```
/admin              → Dashboard Home
/admin/banners      → Banner Manager
/admin/sections     → Section Editor
/admin/streamers    → Streamers Manager
/admin/media        → Media Library
/admin/settings     → Site Settings
```

### Navigation

The admin sidebar includes:
- Dashboard icon for homepage
- Quick links to all admin sections
- "Back to Site" button to return to landing page
- Collapsible on desktop, overlay on mobile

## 🎨 Design System

### Colors
- **Background**: `bg-gray-900` (main), `bg-gray-800` (cards)
- **Primary**: `#a855f7` (purple-600)
- **Secondary**: `#ec4899` (pink-500)
- **Accent**: `#8b5cf6` (purple-500)
- **Success**: `#10b981` (green-600)
- **Error**: `#ef4444` (red-600)
- **Info**: `#3b82f6` (blue-600)

### Typography
- **Headings**: Bold, gradient (purple-to-pink) for major headings
- **Body**: White text on dark backgrounds
- **Labels**: Gray-400 for secondary text

### Components
- **Cards**: Rounded-xl with border-gray-700, hover effects
- **Buttons**: Rounded-lg with shadow-lg on primary actions
- **Inputs**: bg-gray-700 with purple focus rings
- **Icons**: lucide-react for consistent iconography

## 📦 Tech Stack

- **React 19** - UI framework
- **React Router 7** - Routing
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons
- **@dnd-kit** - Drag and drop (Streamers)
- **Axios** - API calls

## 🔌 API Integration

All pages are ready to connect to backend APIs:

```javascript
// Already implemented in src/services/api.js
GET    /api/banners      → Fetch all banners
POST   /api/banners      → Create banner
PUT    /api/banners/:id  → Update banner
DELETE /api/banners/:id  → Delete banner

GET    /api/sections     → Fetch all sections
PUT    /api/sections/:id → Update section

GET    /api/settings     → Fetch site settings
PUT    /api/settings     → Update settings

POST   /api/upload       → Upload media file
```

## 🎯 Key Features by Page

### AdminLayout Component
- Responsive sidebar with mobile hamburger menu
- Active route highlighting
- Smooth transitions on collapse/expand
- Logo and branding
- Navigation to all admin pages

### Form Handling
- Real-time validation
- Loading states during submission
- Success/error feedback
- Unsaved changes tracking
- Cancel/reset functionality

### Media Uploads
- Drag & drop support (coming soon)
- File type validation
- Size limit enforcement
- Preview before upload
- Progress indicators

### Data Management
- CRUD operations on all entities
- Confirmation dialogs for destructive actions
- Optimistic UI updates
- Error handling and recovery

## 🚧 Future Enhancements

- [ ] Drag & drop for banner reordering
- [ ] Image cropper for logo uploads
- [ ] Batch operations (delete multiple items)
- [ ] Search and filtering
- [ ] Export/import settings
- [ ] Activity log with filtering
- [ ] User roles and permissions
- [ ] Dark/light mode toggle
- [ ] Keyboard shortcuts

## 📱 Mobile Responsive

All pages are fully responsive:
- **Mobile**: Sidebar overlays, stacked layouts
- **Tablet**: Adaptive grid columns
- **Desktop**: Full sidebar, multi-column grids

## 🎨 Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators on interactive elements
- Color contrast compliance

## 💡 Usage Tips

1. **Start with Settings**: Configure your site name and branding first
2. **Upload Media**: Build your media library before creating banners
3. **Create Banners**: Add promotional banners with links
4. **Edit Sections**: Customize all landing page content
5. **Manage Streamers**: Feature your top streamers
6. **Check Dashboard**: Monitor stats and recent activity

## 🐛 Known Issues

- Drag & drop for banners not yet implemented (use position field)
- Media upload uses mock API (implement real endpoint)
- Some API endpoints return placeholder data

## 📄 License

Built for StreamerLive platform by Nova ✨ (UI/UX Specialist)

---

**Happy Managing! 🎉**
