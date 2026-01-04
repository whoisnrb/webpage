# N8n Migration to Vercel (Setup Guide)

We have successfully converted your n8n workflow into a "Serverless" API Route running directly on Vercel. This means:
- **No VPS needed.**
- **0-24 Availability** (It wakes up when a request comes in).
- **Free** (part of your Vercel hosting).

## 1. Environment Variables Setup (`.env`)

You need to add the following secrets to your `.env` file (locally) and to Vercel Project Settings (Production).

```env
# --- Gmail Configuration (for sending emails) ---
# Create an App Password here: https://myaccount.google.com/apppasswords
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"

# --- Google Sheets Configuration (for saving data) ---
# Create a Service Account in Google Cloud Console, download the JSON key.
# Enable "Google Sheets API" in Cloud Console.
# Share your spreadsheet with the service account email (client_email).
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----"

# --- AI Configuration ---
PERPLEXITY_API_KEY="pplx-xxxxxxxx"
# GOOGLE_GEMINI_API_KEY="AIzaSy..." # Optional, if we enable Gemini specifically later
```

## 2. Testing the New Webhook

Your new "Unified Webhook" URL is:
`https://your-domain.com/api/unified`
(Locally: `http://localhost:3000/api/unified`)

You can test it with Postman or curl:

**Example: Feedback**
```json
POST /api/unified
{
  "action": "feedback",
  "email": "test@example.com",
  "name": "Test User",
  "feedback": "I love the new design!"
}
```

**Example: Chat**
```json
POST /api/unified
{
  "action": "chat",
  "message": "Mennyibe kerül egy weboldal?"
}
```

## 3. Deployment

1. Commit these changes.
2. Push to GitHub.
3. Add the Environment Variables in Vercel.
4. Redeploy.

## 4. How it works
- The logic is now in `src/app/api/unified/route.ts`.
- It mimics the "Switch" node from n8n.
- It uses `src/lib/n8n/services.ts` to talk to Google, Gmail, and AI.
