# Cloudflare Pages Setup Guide

## 🔧 Build Configuration

### Cloudflare Pages Settings

**Framework Preset:** None (or Vite)

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
frontend/dist
```

**Root directory:**
```
(leave blank - use repository root)
```

### Environment Variables

Add these in Cloudflare Pages settings:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `http://139.59.242.118:3001/api` |
| `NODE_VERSION` | `22` |

## 🐛 Troubleshooting

### Issue: Site shows "frontend" text instead of React app

**Cause:** Cloudflare Pages runs `npm install` in production mode by default, which skips devDependencies (including Vite).

**Solution:** The root `package.json` now contains a build script that uses `npm ci --include=dev` to ensure Vite and all build tools are installed.

### Issue: Build fails with "vite: command not found"

**Fix:** Make sure the build command in Cloudflare Pages is exactly:
```
npm run build
```

NOT:
```
cd frontend && npm install && npm run build
```

The root-level script handles the correct installation.

## ✅ Verification

After deployment, check:

1. **Build logs** - Should show Vite building successfully
2. **Site URL** - Should load the full React app (not just "frontend")
3. **Console** - No errors about missing modules

## 🔄 Redeployment

Cloudflare Pages auto-deploys on every push to `main`. After this fix:

1. Push to GitHub (already done ✓)
2. Cloudflare will detect the change
3. Build will run with correct dependencies
4. Site should work properly

---

**Current Status:** Fix committed and pushed to GitHub. Cloudflare Pages will rebuild automatically.
