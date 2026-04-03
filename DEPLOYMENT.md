# StreamerLive Deployment Guide

## 📦 Project Overview

**StreamerLive** is a modern streaming platform with:
- **Frontend**: React + Vite + Tailwind CSS (Port 3000)
- **Backend**: Node.js + Express + MongoDB (Port 3001)

## 🚀 Quick Start (Development)

### 1. Start Backend
```bash
cd /home/openclaw/.openclaw/agents/lambo/projects/streamerlive/backend
npm start
```
✅ Backend runs on: http://localhost:3001

### 2. Start Frontend
```bash
cd /home/openclaw/.openclaw/agents/lambo/projects/streamerlive/frontend
npm install  # First time only
npm run dev
```
✅ Frontend runs on: http://localhost:3000

### 3. Access the Application
- **Landing Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login
- **API Docs**: http://localhost:3001/api

## 📋 Prerequisites

### System Requirements
- Node.js 18+ (check: `node --version`)
- npm 9+ (check: `npm --version`)
- MongoDB 6+ (local or remote)

### Install MongoDB (if needed)
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

## 🔧 Installation Steps

### Backend Setup
```bash
cd backend
npm install

# Configure environment
cp .env.example .env  # If exists
nano .env  # Edit MongoDB URI and secrets

# Start server
npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Configure API URL
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start dev server
npm run dev
```

## 🌐 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```
Output: `dist/` folder

### Serve Frontend
You have multiple options:

#### Option 1: Serve from Backend (Recommended)
```javascript
// In backend/index.js
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

#### Option 2: Use Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 3: Separate Hosting
- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- **Backend**: Deploy to Railway, Render, or Heroku

### Environment Variables (Production)

**Backend `.env`:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/streamerlive
JWT_SECRET=your-secret-key-here
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

**Frontend `.env.production`:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## 🔐 Security Checklist

### Backend
- [ ] Change default JWT secret
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user uploads
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags

### Frontend
- [ ] Remove console.logs
- [ ] Enable production build
- [ ] Configure CSP headers
- [ ] Use environment variables
- [ ] Minify and optimize assets

## 📊 Database Setup

### Create Admin User
```bash
# Connect to MongoDB
mongosh streamerlive

# Create admin
db.users.insertOne({
  email: "admin@streamerlive.com",
  password: "$2a$10$HashedPasswordHere",  # Use bcrypt
  role: "admin",
  createdAt: new Date()
});
```

### Seed Data (Optional)
```javascript
// Run seed script
node backend/scripts/seed.js
```

## 🐛 Troubleshooting

### Frontend Issues

#### Port 3000 already in use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or change port in vite.config.js
server: { port: 3001 }
```

#### Styles not loading
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Clear cache
rm -rf node_modules .vite
npm install
```

#### API connection failed
- Check backend is running: `curl http://localhost:3001/api/health`
- Verify `.env` has correct API URL
- Check browser console for CORS errors
- Ensure backend CORS allows frontend origin

#### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Backend Issues

#### MongoDB connection failed
```bash
# Check MongoDB is running
sudo systemctl status mongodb

# Test connection
mongosh --eval "db.adminCommand('ping')"

# Check connection string
echo $MONGODB_URI
```

#### Cannot find module errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Upload errors
```bash
# Check uploads directory exists
mkdir -p uploads/images uploads/videos

# Set permissions
chmod 755 uploads
```

## 🚦 Health Checks

### Check Backend
```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Check Frontend
```bash
curl http://localhost:3000
# Expected: HTML content
```

### Check Database
```bash
mongosh --eval "db.adminCommand('ping')"
# Expected: { ok: 1 }
```

## 📈 Performance Optimization

### Frontend
1. **Code Splitting**
   ```javascript
   // Use dynamic imports
   const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
   ```

2. **Image Optimization**
   - Use WebP format
   - Lazy load images
   - Implement CDN

3. **Caching**
   ```javascript
   // In vite.config.js
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           router: ['react-router-dom'],
         }
       }
     }
   }
   ```

### Backend
1. **Database Indexing**
   ```javascript
   // Add indexes
   db.banners.createIndex({ order: 1 });
   db.users.createIndex({ email: 1 }, { unique: true });
   ```

2. **Caching**
   - Use Redis for session storage
   - Cache frequently accessed data

3. **Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install Frontend Dependencies
      run: |
        cd frontend
        npm install
    
    - name: Build Frontend
      run: |
        cd frontend
        npm run build
    
    - name: Deploy
      # Add your deployment steps here
      run: echo "Deploy to production"
```

## 📝 Backup & Recovery

### Database Backup
```bash
# Backup
mongodump --db streamerlive --out ./backup

# Restore
mongorestore --db streamerlive ./backup/streamerlive
```

### Files Backup
```bash
# Backup uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/

# Restore
tar -xzf uploads-backup-YYYYMMDD.tar.gz -C backend/
```

## 🎯 Monitoring

### Log Files
- Backend logs: Check console or use PM2 logs
- Frontend errors: Browser console
- MongoDB logs: `/var/log/mongodb/mongod.log`

### Metrics to Track
- Response times
- Error rates
- Database query performance
- Upload success rate
- Active users

## 🆘 Support

### Common Commands
```bash
# View logs (PM2)
pm2 logs streamerlive

# Restart app
pm2 restart streamerlive

# Check status
pm2 status

# Monitor
pm2 monit
```

### Debug Mode
```bash
# Backend debug
DEBUG=* npm start

# Frontend debug
npm run dev -- --debug
```

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Backup created

### Deployment
- [ ] Build frontend
- [ ] Upload files to server
- [ ] Install dependencies
- [ ] Configure web server
- [ ] Set up SSL certificate
- [ ] Configure firewall

### Post-Deployment
- [ ] Test all routes
- [ ] Verify API endpoints
- [ ] Check admin dashboard
- [ ] Monitor error logs
- [ ] Set up monitoring
- [ ] Configure backups

## 🎉 Success!

Your StreamerLive platform should now be running!

- 🌐 **Frontend**: Beautiful, responsive UI
- 🔧 **Backend**: Robust API
- 🗄️ **Database**: Configured and seeded
- 🔐 **Security**: Protected and encrypted

Need help? Check the logs and error messages above! 🚀
