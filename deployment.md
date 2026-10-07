# 🚀 SANCHAY PATH PLATFORM: PRODUCTION DEPLOYMENT GUIDE

This document provides complete, step-by-step instructions for deploying and managing the **Sanchay Path Financial Services** multi-service platform across Vercel, Supabase, Cloudflare Workers, Google Cloud, Meta WhatsApp Cloud API, and GitHub Actions.

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

| Component | Repository Folder | Technology Stack | Hosting Platform | Target URL / Route |
| :--- | :--- | :--- | :--- | :--- |
| **Public Business Website** | `business-public-website` | Next.js 16 (App Router) + Recharts + Prisma | Vercel (Multi-Service) | `sanchaypath.com` (`/`) |
| **Admin Operations Panel** | `business-admin-panel` | Next.js 16 + Supabase Auth + Google OAuth | Vercel (Multi-Service) | `admin.sanchaypath.com` (`/admin`) |
| **WhatsApp Bot Worker** | `business-whatsapp-worker` | Cloudflare Worker + Meta Cloud API | Cloudflare Workers | `*.workers.dev` |
| **Encrypted DB Backups** | `business-ops-backups` | Node.js + AES-256-GCM + Google Drive API | GitHub Actions | Scheduled Cron |
| **Cloud Database & Auth** | `supabase/` | PostgreSQL (ap-northeast-1) + RLS | Supabase Cloud | `xlewftzyvsyhpktgizlz.supabase.co` |

---

## 📍 OFFICIAL BUSINESS CREDENTIALS & ADDRESS

- **Founder & MFD**: Sukanta Dutta | AMFI-Registered Mutual Fund Distributor (**ARN: 347438**)
- **Bengali Tagline**: সমৃদ্ধির নতুন দিশারি (*New Direction to Prosperity*)
- **Official Address**: `House of PADA Sova, Uttar Kowgachi Feeder Road, Shyamnagar, North 24 Parganas, West Bengal, Pin-743127`
- **Authorized Super Admins**: `tathyamitra2374@gmail.com` and `souhamdutta23@gmail.com`

---

## 🛠️ STEP 1: GOOGLE CLOUD CONSOLE CONFIGURATION

### A. Google OAuth 2.0 Credentials
1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Under **OAuth 2.0 Client IDs**, create or select your Web Application client:
   * **Client ID**: `<YOUR_GOOGLE_CLIENT_ID>.apps.googleusercontent.com`
   * **Client Secret**: `<YOUR_GOOGLE_CLIENT_SECRET>`

### B. Authorized JavaScript Origins
Add the following exact URLs under **Authorized JavaScript origins**:
```
http://localhost:3000
http://localhost:3001
https://sanchaypath.com
https://admin.sanchaypath.com
https://xlewftzyvsyhpktgizlz.supabase.co
```

### C. Authorized Redirect URIs
Add the following exact URL under **Authorized redirect URIs**:
```
https://xlewftzyvsyhpktgizlz.supabase.co/auth/v1/callback
```

### D. Enable Required Google APIs
Go to **APIs & Services → Enabled APIs & Services** and enable:
- **Google Drive API**
- **Google Sheets API**

---

## ⚡ STEP 2: SUPABASE AUTH & POSTGRES DATABASE CONFIGURATION

### A. Supabase Google OAuth Provider Setup
1. Open [Supabase Auth Providers](https://supabase.com/dashboard/project/xlewftzyvsyhpktgizlz/auth/providers).
2. Locate **Google** and toggle **Enable Google Provider** to **ON**.
3. Enter Credentials:
   - **Client ID**: `<YOUR_GOOGLE_CLIENT_ID>.apps.googleusercontent.com`
   - **Client Secret**: `<YOUR_GOOGLE_CLIENT_SECRET>`
4. Click **Save**.

### B. Supabase Redirect URLs
Under **Authentication → URL Configuration**:
- **Site URL**: `https://admin.sanchaypath.com`
- **Additional Redirect URLs**:
  - `http://localhost:3001/dashboard`
  - `https://admin.sanchaypath.com/dashboard`

### C. Seed Authorized Super Admins
Run the SQL script in **Supabase SQL Editor** to grant Super Admin privileges:
```sql
INSERT INTO public.admin_users (email, role, active)
VALUES 
  ('tathyamitra2374@gmail.com', 'SUPER_ADMIN', true),
  ('souhamdutta23@gmail.com', 'SUPER_ADMIN', true)
ON CONFLICT (email) DO UPDATE SET active = true;
```

---

## 🔺 STEP 3: VERCEL MULTI-SERVICE DEPLOYMENT

The platform uses Vercel's **Multi-Service Project** architecture configured via the root [`vercel.json`](file:///d:/projects/Business_web/vercel.json).

### A. Root `vercel.json` Structure
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "business-admin-panel": {
      "root": "business-admin-panel",
      "framework": "nextjs"
    },
    "business-public-website": {
      "root": "business-public-website",
      "framework": "nextjs"
    }
  },
  "rewrites": [
    {
      "source": "/admin",
      "destination": { "service": "business-admin-panel" }
    },
    {
      "source": "/admin/(.*)",
      "destination": { "service": "business-admin-panel" }
    },
    {
      "source": "/(.*)",
      "destination": { "service": "business-public-website" }
    }
  ]
}
```

### B. Build Commands & Prisma Generation
Both services have `"build": "prisma generate && next build"` and `"postinstall": "prisma generate"` configured in `package.json` to ensure Prisma Client binaries are generated automatically in Vercel's build container.

### C. Environment Variables in Vercel Project
Add the following environment variables under **Project Settings → Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xlewftzyvsyhpktgizlz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
SUPABASE_URL=https://xlewftzyvsyhpktgizlz.supabase.co
SUPABASE_PUBLISHABLE_KEY=<YOUR_SUPABASE_ANON_KEY>
SUPABASE_SECRET_KEY=<YOUR_SUPABASE_SECRET_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SUPABASE_SERVICE_ROLE_KEY>
SUPABASE_DB_PASSWORD=<YOUR_SUPABASE_DB_PASSWORD>
DATABASE_URL=postgresql://postgres.xlewftzyvsyhpktgizlz:<PASSWORD>@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xlewftzyvsyhpktgizlz:<PASSWORD>@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
REVALIDATION_SECRET=sanchay_path_revalidation_secret_key
```

---

## ☁️ STEP 4: CLOUDFLARE WORKERS DEPLOYMENT (WHATSAPP BOT)

1. Open terminal in `business-whatsapp-worker/`.
2. Authenticate Wrangler CLI:
   ```bash
   npx wrangler login
   ```
3. Set Secrets:
   ```bash
   npx wrangler secret put META_APP_SECRET
   npx wrangler secret put META_ACCESS_TOKEN
   npx wrangler secret put WHATSAPP_PHONE_NUMBER_ID
   ```
4. Deploy Worker to Cloudflare Edge:
   ```bash
   npx wrangler deploy
   ```

---

## 💬 STEP 5: META DEVELOPER PORTAL WEBHOOK SETUP

1. Log into [Meta Developer Portal](https://developers.facebook.com/).
2. Open **WhatsApp → Configuration**:
   - **Callback URL**: `https://business-whatsapp-worker.<your-subdomain>.workers.dev/webhook`
   - **Verify Token**: `shitHead_souham`
3. Click **Verify and Save**.
4. Subscribe to `messages` webhook field.

---

## 🔒 STEP 6: GITHUB ACTIONS ENCRYPTED DATABASE BACKUPS

Set GitHub Repository Secrets under **Settings → Secrets and variables → Actions**:

| Secret Name | Value |
| :--- | :--- |
| `SUPABASE_URL` | `https://xlewftzyvsyhpktgizlz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1...` |
| `DATABASE_URL` | `postgresql://postgres.xlewftzyvsyhpktgizlz:SqG%29%2B%248X35X%40hJf@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `BACKUP_ENCRYPTION_KEY` | `sanchay_path_32byte_backup_key!!` |

Cron backup runs automatically daily at 02:00 UTC and uploads AES-256-GCM encrypted database snapshots to Google Drive (`Sanchay Business/Backups`).

---

## ✅ POST-DEPLOYMENT VERIFICATION CHECKLIST

- [ ] Open `https://admin.sanchaypath.com/login` and click **Sign In with Google**.
- [ ] Sign in with `tathyamitra2374@gmail.com` or `souhamdutta23@gmail.com`.
- [ ] Submit a test lead on `https://sanchaypath.com/#contact` with a valid 10-digit mobile number.
- [ ] Confirm enquiry appears in Supabase `enquiries` table, Admin Panel dashboard, and Google Sheet.
- [ ] Verify responsive header layout and designation badge placement on mobile devices (<480px).
