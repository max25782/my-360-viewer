# Onboarding Email Setup

## Overview
When users complete the onboarding questionnaire, their responses are automatically sent to `office@adu-seattle.com`.

## Setup Instructions

### 1. Get Resend API Key
1. Go to [Resend](https://resend.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key

### 2. Configure Environment Variable
Add the following to your `.env.local` file:

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Verify Domain (Required for Production)
To send emails from `onboarding@adu-seattle.com`, you **must** verify the domain:

1. In Resend dashboard, go to https://resend.com/domains
2. Click "Add Domain"
3. Enter `adu-seattle.com`
4. Copy the DNS records provided:
   ```
   Type: TXT | Name: _resend | Value: [verification code]
   Type: TXT | Name: @ | Value: v=spf1 include:resend.io ~all
   Type: CNAME | Name: resend._domainkey | Value: resend._domainkey.resend.com
   ```
5. Add these records to your domain's DNS settings (where domain is registered)
6. Click "Verify" in Resend dashboard
7. Wait for verification (usually 5-10 minutes)

**Current Status:**
- ✅ Development: Using `onboarding@resend.dev` (works immediately)
- ⚠️ Production: Need to verify domain and update code

**After verification, update the code:**
```typescript
// In src/app/api/send-onboarding/route.ts, change:
from: 'ADU Seattle Onboarding <onboarding@resend.dev>'
// to:
from: 'ADU Seattle Onboarding <onboarding@adu-seattle.com>'
```

## What Gets Sent

The email includes:
- **User Information**: Name and address
- **Project Details**: Type, purpose, budget, urgency
- **Preferences**: Size, bedrooms, parking, style preferences
- **Priorities**: User's top 3 priorities
- **Financing Options**: Selected financing methods
- **Recommended Models**: AI-matched house models with scores
- **Insights**: Personalized recommendations based on answers
- **Timestamp**: Pacific Time (PT)

## Email Format

```
New Onboarding Submission
========================

User Information:
-----------------
Name: John Doe
Address: 123 Main St, Seattle, WA

Onboarding Answers:
-------------------
Project Type: adu
Purpose: rental
Budget: $200k-$300k
...

Recommended Models:
-------------------
1. The Walnut (Score: 95%)
2. The Oak (Score: 89%)
...

Insights:
---------
- Your budget aligns well with our Skyline Collection
- Consider models with 2 bedrooms for rental income
...

---
Submitted: 10/9/2025, 5:30:00 PM
```

## Testing

### Local Testing
```bash
# Make sure your API key is set
npm run dev

# Navigate to /onboarding
# Complete the questionnaire
# Check your email at office@adu-seattle.com
```

### Troubleshooting
- **No email received**: Check browser console for errors
- **500 Error**: Verify RESEND_API_KEY is set correctly
- **Authentication failed**: Generate a new API key

## Files Modified

1. **`src/app/api/send-onboarding/route.ts`** - API endpoint for sending emails
2. **`src/app/onboarding/page.tsx`** - Calls the API after completion
3. **`src/components/SmartOnboarding.tsx`** - Saves answers to localStorage

## Security Notes

- API key is stored server-side only (`.env.local`)
- Never commit `.env.local` to git
- Email sending happens server-side to protect API key
- User navigation is not blocked if email fails

