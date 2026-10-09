# 📋 Sanchay Path - Release Changelog & Version History

All notable changes to **Sanchay Path** (`business-public-website`, `business-admin-panel`, and `business-whatsapp-worker`) will be documented in this file.

---

## 🚀 [v1.4.0] - 2026-10-09
### 🎨 UI & Design Systems
- **SIP Calculator Light Mode Overhaul**: Replaced dark muddy background panel with warm cream/amber glass container (`rgba(254, 243, 199, 0.45)`) and gold interactive input pills (`#d97706`).
- **Warm Golden Ambient Glow Backdrop**: Added continuous warm orangish ambient gradient backdrop (`#fffdfa` + radial mesh gold glows) across the entire public website in Light Mode.
- **Interactive Mailto Links**: All email addresses on the public website (contact section, helpline) now open default mail client directly with recipient pre-filled.

### 📑 Admin Panel & CMS
- **Contact Email Management**: Admin can now edit and publish the official public contact email via CMS.
- **Changelog & Release Tracker**: Added dedicated **"📋 Recent Updates"** page in the Admin Panel displaying real-time commit tags, release dates, and update history.

---

## 📦 [v1.3.0] - 2026-10-08 (`commit 3799309`)
### ⚙️ Google Sheets & Database Architecture
- **Batch-Based Google Sheet Sync**: Updated enquiry flow to batch leads into groups of 4 before syncing to Google Sheets, using persistent Supabase state (`synced_to_sheet`). Removed 12-hour background sync job.
- **Admin Panel Sheet Controls**: Added live connection status, last synced timestamp, pending lead counter, and manual **"🔄 Sync Now"** trigger button.

### 🎨 Header & Light Mode Brand Styling
- **Light Mode Logo Text (`SANCHAY PATH`)**: Applied high-contrast navy-to-gold gradient (`#0f172a` → `#b45309`) for sharp readability on light backgrounds.
- **Tablet Responsiveness**: Fixed hero portrait scaling and blur overflow (`overflow-x: hidden`) to prevent scrollbar clipping on tablet viewports.

### 👤 Admin Authentication
- **Active Admin Session Display**: Sidebar and top header now display the authenticated admin user email, display name, avatar badge, and 🟢 live online status.

---

## 🛡️ [v1.2.0] - 2026-10-07
### 📊 Analytics & Telemetry
- **Page Visit Tracker**: Built lightweight telemetry tracker (`PageViewTracker.tsx` and `/api/analytics/track`) capturing page visits, unique device counts, and traffic metrics in Supabase.
- **Admin Analytics Dashboard**: Displayed real-time website traffic numbers inside Admin Panel overview card.

---

## 🏗️ [v1.1.0] - 2026-10-05
### 📱 WhatsApp Worker & Customer Management
- **Automated WhatsApp Lead Flow**: Integrated WhatsApp Webhook worker to record incoming customer queries into Supabase `enquiries` table.
- **CRM Customer Management**: Added customer directory, appointment scheduler, and audit logger in Admin Panel.
