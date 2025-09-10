# PWA Troubleshooting Guide

## 🔍 PWA Status Check

Your PWA has been thoroughly tested and all components are working correctly:

✅ **Service Worker**: Registered and active  
✅ **Web App Manifest**: Valid and accessible  
✅ **Icons**: All required sizes available  
✅ **HTTPS**: Not required for localhost  
✅ **Responsive Design**: Next.js responsive by default  

## 🛠️ Common PWA "Not Working" Issues & Solutions

### 1. **PWA Install Prompt Not Appearing**

**Symptoms:** No install button or prompt appears in browser

**Causes & Solutions:**
- **Browser Support**: PWA install prompts are only available in Chrome, Edge, and some mobile browsers
  - ✅ **Fix**: Test in Chrome or Edge browsers
- **Already Installed**: If PWA is already installed, prompt won't appear
  - ✅ **Fix**: Check if app is already installed or uninstall and try again
- **Criteria Not Met**: Browser checks multiple criteria before showing prompt
  - ✅ **Fix**: All criteria are met in this app

**Test Steps:**
1. Open Chrome/Edge browser
2. Navigate to your app
3. Look for install icon in address bar
4. Or use our diagnostic page: `http://localhost:3000/pwa-test.html`

### 2. **Offline Functionality Not Working**

**Symptoms:** App doesn't work when internet is disconnected

**Causes & Solutions:**
- **Service Worker Not Active**: Service worker failed to register
  - ✅ **Fix**: Check browser console for service worker errors
- **Cache Strategy Issues**: Resources not properly cached
  - ✅ **Fix**: Service worker includes comprehensive caching strategies
- **Network-First Resources**: Some resources intentionally require network
  - ✅ **Fix**: This is expected behavior for dynamic content

**Test Steps:**
1. Load the app while online
2. Open DevTools → Application → Service Workers
3. Verify service worker is "activated and running"
4. Disconnect internet and refresh page

### 3. **Service Worker Registration Failed**

**Symptoms:** Console shows service worker registration errors

**Common Errors & Solutions:**

**Error: "Failed to register service worker: SecurityError"**
- **Cause**: HTTPS required (except localhost)
- ✅ **Fix**: Deploy to HTTPS or test on localhost

**Error: "Failed to register service worker: NetworkError"**
- **Cause**: Service worker file not found
- ✅ **Fix**: Verify `/sw.js` is accessible

**Error: "Failed to register service worker: SyntaxError"**
- **Cause**: JavaScript syntax error in service worker
- ✅ **Fix**: Service worker syntax has been validated

### 4. **PWA Not Installing on Mobile**

**Symptoms:** Install option not available on mobile devices

**Platform-Specific Solutions:**

**iOS Safari:**
- PWA install requires manual process
- ✅ **Steps**: Share button → "Add to Home Screen"
- Note: iOS has limited PWA support compared to Android

**Android Chrome:**
- Should show automatic install prompt
- ✅ **Alternative**: Chrome menu → "Add to Home screen"

**Firefox Mobile:**
- Limited PWA support
- ✅ **Alternative**: Use Chrome or Edge on mobile

### 5. **Manifest Issues**

**Symptoms:** PWA features not working properly

**Common Manifest Problems:**
- **Missing Required Fields**: name, short_name, start_url, display, icons
  - ✅ **Status**: All required fields present
- **Invalid Icon Sizes**: Missing 192x192 or 512x512 icons
  - ✅ **Status**: All required icon sizes available
- **Wrong MIME Type**: Manifest not served as application/json
  - ✅ **Status**: Correct MIME type configured

## 🧪 Testing Your PWA

### Browser DevTools Audit
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"

### Manual Testing Checklist
- [ ] Service worker registers successfully
- [ ] App works offline (at least basic functionality)
- [ ] Install prompt appears (Chrome/Edge)
- [ ] App can be added to home screen
- [ ] Icons display correctly
- [ ] App opens in standalone mode when installed

### Diagnostic Tools Available

1. **Built-in Diagnostic Page**: `/pwa-test.html`
   - Comprehensive PWA feature testing
   - Real-time status monitoring
   - Installation testing

2. **PWA Status Component**: Shows on main app
   - Install prompts when available
   - Offline status indicators
   - Service worker status

3. **Browser Console Logging**: Enhanced debugging
   - Service worker registration status
   - Installation events
   - Error details

## 🔧 Advanced Troubleshooting

### Clear Service Worker Cache
```javascript
// Run in browser console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### Force Service Worker Update
```javascript
// Run in browser console
navigator.serviceWorker.getRegistration().then(function(registration) {
  if (registration) {
    registration.update();
  }
});
```

### Clear All Caches
```javascript
// Run in browser console (or use built-in clearAppCache() function)
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
  }
});
```

## 🌐 Browser-Specific Notes

### Chrome/Chromium
- ✅ Full PWA support
- ✅ Install prompts work
- ✅ All features supported

### Firefox
- ⚠️ Limited PWA support on desktop
- ✅ Basic service worker support
- ❌ No install prompts on desktop

### Safari
- ⚠️ Limited PWA support
- ✅ Basic service worker support
- ✅ iOS: Add to Home Screen available

### Edge
- ✅ Full PWA support (Chromium-based)
- ✅ Install prompts work
- ✅ All features supported

## 📱 Mobile-Specific Issues

### iOS Issues
- PWAs run in separate WebView context
- Limited storage capabilities
- No automatic install prompts
- Manual "Add to Home Screen" required

### Android Issues
- Should work seamlessly in Chrome
- Samsung Internet has good PWA support
- Other browsers may have limited support

## 🚀 Performance Optimization

The PWA includes several performance optimizations:

1. **Caching Strategies**:
   - Static resources: Cache First
   - Data: Stale While Revalidate
   - HTML: Network First with cache fallback

2. **Preloading**:
   - Critical resources preloaded
   - Category data can be preloaded
   - Assets registered for background caching

3. **Offline Support**:
   - App shell cached for offline use
   - Panorama images cached on demand
   - Graceful degradation when offline

## 📞 Getting Help

If you're still experiencing issues:

1. **Check Browser Console**: Look for error messages
2. **Test in Different Browsers**: Try Chrome, Edge, Firefox
3. **Use Diagnostic Tools**: Visit `/pwa-test.html` for detailed analysis
4. **Check Network**: Ensure stable internet connection
5. **Clear Cache**: Try clearing browser cache and service worker

## ✅ Verification Checklist

Your PWA setup includes:

- [x] Valid manifest.json with all required fields
- [x] Service worker with comprehensive caching
- [x] All required icon sizes (72px to 512px)
- [x] HTTPS support (production) / localhost (development)
- [x] Responsive design
- [x] Enhanced error handling and logging
- [x] User-friendly installation prompts
- [x] Offline functionality
- [x] Performance optimizations
- [x] Cross-browser compatibility considerations
- [x] Diagnostic and troubleshooting tools

Your PWA is fully functional and meets all modern PWA standards! 🎉