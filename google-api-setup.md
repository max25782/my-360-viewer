# Google Maps API Setup

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Places API**
   - **Maps JavaScript API**
4. Go to "Credentials" and create an API key
5. Restrict the API key to your domain for security

## 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google Maps API Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Replace `your_google_maps_api_key_here` with your actual API key.

## 3. API Key Restrictions (Recommended)

For security, restrict your API key:
- **Application restrictions**: HTTP referrers (web sites)
- **Website restrictions**: Add your domain (e.g., `localhost:3000/*`, `yourdomain.com/*`)
- **API restrictions**: Restrict to "Places API" and "Maps JavaScript API"

## 4. Billing

Note: Google Maps API requires billing to be enabled, but includes a generous free tier:
- $200 monthly credit
- First 1000 requests per month are free for most APIs

## 5. Testing

After setup, the GoogleAddressAutocomplete component will:
- Show a loading spinner while the API loads
- Provide address suggestions as you type
- Auto-complete addresses when selected
- Show a warning if API key is not configured
