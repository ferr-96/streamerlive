# 🎨 Visual Page Builder Dashboard

A beautiful WYSIWYG editor for StreamerLive landing page - built with React, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🖱️ Click-to-Edit Interface
- Click any element on the page to select and edit it
- Hover effects show "Click to edit" badges
- Selected elements get a glowing cyan border
- Real-time preview of changes

### 📝 Editable Components

1. **Header** - Site name, logo
2. **Hero Section** - Title, subtitle, buttons, images
3. **Category Icons** - Name, icon, gradient colors
4. **VIP Banner** - Title, description, button, background
5. **Streamer Cards** - Name, image, viewer count, live status
6. **Features** - Title, description, icons
7. **Download Section** - Heading, description, app links
8. **Footer** - Links, social media

### 🎯 Visual Editor Features

- **Top Toolbar**: Save, Preview, Undo, Redo buttons
- **Properties Panel**: Right sidebar with contextual editing forms
- **Offline Mode**: Works without API, saves to localStorage
- **Drag & Drop**: Reorder elements (streamers, categories)
- **Image Upload**: Direct image upload with preview
- **Position Controls**: Move elements up/down
- **Delete Protection**: Confirmation before deletion

### 🎨 Beautiful UI

- **Cyan & Purple** gradient theme matching Nova's style
- **Smooth animations** with Framer Motion
- **Hover effects** on all editable elements
- **Selection highlights** with glow effects
- **Responsive design** works on all screen sizes
- **Icons** from Lucide React

## 🚀 How to Use

### Access the Editor

Navigate to: **`http://localhost:5173/admin/visual`**

### Editing Workflow

1. **Click** any element you want to edit
2. **Edit** in the right sidebar properties panel
3. **Save** changes with the top toolbar button
4. **Preview** by opening the landing page in a new tab

### Data Storage

- **Primary**: localStorage (auto-saves on every change)
- **Fallback**: API endpoints (when online)
- **Storage Key**: `streamerlive_editor_data`

### Offline Mode

When API is unavailable:
- Shows "Offline Mode" badge in toolbar
- Uses cached localStorage data
- Still fully functional for editing
- Saves will persist locally

## 📂 Project Structure

```
src/
├── pages/admin/
│   └── VisualEditor.jsx       # Main editor component
├── components/admin/
│   ├── EditableElement.jsx    # Wrapper for editable sections
│   └── PropertiesPanel.jsx    # Right sidebar editor
└── App.jsx                     # Route: /admin/visual
```

## 🎨 Design System

### Colors
- Primary: Cyan (#22d3ee) - for selection/active states
- Secondary: Purple (#a855f7) - for actions
- Background: Dark Navy (#0a0a1a)
- Surface: Gray 900/800

### Animations
- Selection: Border fade-in with glow
- Hover: Scale 1.002 + overlay fade-in
- Panel: Slide-in from right with spring physics
- Buttons: Smooth color transitions

### Typography
- Headings: Bold, gradient text effects
- Labels: Medium weight, cyan accent
- Body: Regular, gray-300 for readability

## 🔧 Technical Details

### State Management
- React useState for page content
- Local history tracking (undo/redo ready)
- Auto-save to localStorage on changes

### API Integration
- GET `/api/settings` - Site settings
- GET/POST/PUT/DELETE `/api/banners` - Banners
- GET/POST/PUT/DELETE `/api/sections` - Sections

### Fallback Strategy
1. Load from localStorage first (instant)
2. Try loading from API (background)
3. Merge API data if successful
4. Show offline indicator if API fails

## 🎯 Future Enhancements

- [ ] Drag & drop reordering for all lists
- [ ] Undo/Redo functionality (history implemented)
- [ ] Add section button (+ new categories, streamers, etc.)
- [ ] Color picker for gradients
- [ ] Icon selector modal (browse Lucide icons)
- [ ] Real-time collaboration
- [ ] Version history
- [ ] Export/Import page templates

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy
The build creates optimized static files in `dist/` ready for deployment.

### Environment Variables

```env
VITE_API_URL=http://139.59.242.118:3001/api
```

## 🎨 Nova's Touch

This visual editor embodies Nova's UI/UX expertise:
- **Intuitive**: Click-to-edit, no learning curve
- **Beautiful**: Gradient accents, smooth animations
- **Functional**: Works offline, auto-saves, real-time preview
- **Accessible**: Clear labels, focus states, keyboard-friendly
- **Modern**: Tailwind CSS, Framer Motion, React best practices

---

Built with 💙 by Nova - StreamerLive Visual Editor
