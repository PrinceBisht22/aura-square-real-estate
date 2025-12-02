# LAN Preview Blank Page Fix

## Issue
Site loads a blank/white page when accessing over LAN at `http://192.168.1.33:4173` (or any LAN IP).

## Root Causes Identified

### 1. Vite Preview Server Not Configured for LAN Access
- **Problem**: Vite preview server defaults to `localhost` only, not accessible over LAN
- **Fix**: Added `host: true` to `preview` config in `vite.config.js`

### 2. Missing Base Path Configuration
- **Problem**: No explicit `base: '/'` in Vite config could cause asset path issues
- **Fix**: Added explicit `base: '/'` to ensure correct asset paths

### 3. No Error Boundary at Root Level
- **Problem**: Runtime errors could cause blank page with no user feedback
- **Fix**: Added ErrorBoundary wrapper in `main.jsx` and error handling

### 4. Missing Host Configuration in Preview Script
- **Problem**: `npm run preview` didn't include `--host` flag
- **Fix**: Updated preview scripts in `package.json`

## Fixes Applied

### 1. Updated `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',  // Explicit base path
  server: {
    port: 5173,
    host: true,  // Listen on all addresses for dev server
    strictPort: false,
  },
  preview: {
    port: 4173,
    host: true,  // Listen on all addresses (0.0.0.0) for LAN access
    strictPort: false,
  },
  // ... build config
});
```

### 2. Enhanced `src/main.jsx`
- Added ErrorBoundary wrapper at root level
- Added root element existence check
- Added try/catch with fallback UI if React fails to render
- Better error logging

### 3. Updated `package.json` Scripts
```json
{
  "scripts": {
    "preview": "vite preview --host",
    "preview:lan": "vite preview --host 0.0.0.0 --port 4173"
  }
}
```

## Testing Instructions

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Start Preview Server for LAN
```bash
# Option 1: Use the new script
npm run preview:lan

# Option 2: Use preview with host flag
npm run preview

# Option 3: Manual command
vite preview --host 0.0.0.0 --port 4173
```

### Step 3: Access from LAN
- **Local**: `http://localhost:4173`
- **LAN IP**: `http://192.168.1.33:4173` (replace with your actual IP)
- **Network**: `http://0.0.0.0:4173`

### Step 4: Verify
1. Page should load (not blank)
2. Check browser console for errors
3. Check network tab for 404s
4. Verify all assets load correctly

## Common Issues & Solutions

### Issue: Still seeing blank page
**Check:**
1. Browser console for JavaScript errors
2. Network tab for failed asset requests (404/500)
3. Terminal output for server errors
4. Firewall blocking port 4173

**Solutions:**
- Clear browser cache
- Check if port 4173 is accessible: `curl http://192.168.1.33:4173`
- Verify firewall allows connections on port 4173
- Try accessing from different device on same network

### Issue: Assets 404
**Check:**
- `vite.config.js` has `base: '/'`
- Assets are in `dist/assets/` after build
- Network tab shows correct asset paths

**Solution:**
- Rebuild: `npm run build`
- Check `dist/index.html` has correct asset paths
- Verify `base` path in Vite config

### Issue: SPA Routing Not Working
**Check:**
- Direct URL access (e.g., `/profile`) returns 404
- Browser history navigation works but direct access doesn't

**Solution:**
- Vite preview server should handle SPA fallback automatically
- If not, ensure you're using `vite preview` (not a static file server)
- Check that all routes are client-side routes

### Issue: CORS or Mixed Content
**Check:**
- Console shows CORS errors
- Mixed content warnings (http/https)

**Solution:**
- Ensure all assets are served from same origin
- Use `http://` for both dev and preview (or `https://` for both)
- Check for hardcoded `localhost` URLs in code

## Debugging Steps

### 1. Check Server is Running
```bash
# Should show Vite preview server info
npm run preview:lan
```

### 2. Test Server Response
```bash
# From terminal
curl http://localhost:4173
curl http://192.168.1.33:4173

# Should return HTML, not 404
```

### 3. Check Browser Console
Open DevTools → Console tab:
- Look for red errors
- Check for "Failed to fetch" or "404" errors
- Note any module loading failures

### 4. Check Network Tab
Open DevTools → Network tab:
- Reload page
- Look for failed requests (red)
- Check if `index.html` loads (200 status)
- Check if JS/CSS assets load (200 status)

### 5. Check Terminal Output
Look at the terminal running `vite preview`:
- Should show "Local: http://localhost:4173"
- Should show "Network: http://192.168.1.33:4173"
- Should not show errors

## Files Changed

1. **`vite.config.js`**
   - Added `base: '/'`
   - Added `server.host: true`
   - Added `preview.host: true` and `preview.port: 4173`
   - Added build configuration

2. **`src/main.jsx`**
   - Added ErrorBoundary wrapper
   - Added root element check
   - Added try/catch with fallback UI
   - Better error handling

3. **`package.json`**
   - Updated `preview` script to include `--host`
   - Added `preview:lan` script for explicit LAN access

## Verification Checklist

- [ ] Build completes without errors: `npm run build`
- [ ] Preview server starts: `npm run preview:lan`
- [ ] Server shows LAN IP in terminal output
- [ ] Page loads at `http://localhost:4173`
- [ ] Page loads at `http://192.168.1.33:4173` (your LAN IP)
- [ ] No console errors in browser
- [ ] No 404s in network tab
- [ ] All assets load correctly
- [ ] Navigation works (click links, use browser back/forward)
- [ ] Direct URL access works (e.g., `/profile`)

## Expected Terminal Output

When running `npm run preview:lan`, you should see:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.33:4173/
  ➜  press h to show help
```

## Notes

- The `host: true` option makes Vite listen on `0.0.0.0`, allowing LAN access
- The `base: '/'` ensures assets are loaded from root path
- ErrorBoundary provides fallback UI if React fails to render
- Preview server automatically handles SPA routing fallback

## Build Status
✅ Build successful
✅ Configuration updated
✅ Error handling enhanced

