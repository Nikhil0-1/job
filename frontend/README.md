# JobPortal — Modern Job Marketplace & Employer Platform

A full-featured, responsive, production-ready job portal and employer management application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## Features

### 🌟 Public Job Seekers
- **Home Landing**: Hero, statistics, featured job categories, hiring steps, candidate/employer CTAs.
- **Job Marketplace**: Filter jobs by category, job type (Full Time, Remote, etc.), work mode (On-site, Hybrid, Remote), experience level, and location with live search.
- **Single Job Details**: Full job metadata, company info, salary ranges, responsibilities, requirements, and Play Store redirection for candidate applications.
- **Find Jobs App Landing**: Centralized Google Play Store download page highlighting mobile app features.
- **How It Works & About**: Informational pages explaining platform features, benefits, and company mission.
- **Custom 404 Page**: Clean, branded "Page Not Found" screen with functional home navigation.

### 🏢 Employer Dashboard & Portal
- **Employer Auth**: Secure registration, login with JWT token persistence, and forgot password flow.
- **Dashboard**: Real-time hiring stats, quick actions, active job counts, application counters, and recent activity.
- **Manage Jobs**: List, search, filter by status (Active, Draft, Closed), toggle job status, edit job, preview job, and delete job with confirmation modal.
- **Post & Edit Jobs**: Multi-section forms powered by `react-hook-form` + `zod` validation for publishing and updating listings.
- **Manage Applications**: Filter applications by job title, candidate name, or status (Applied, Under Review, Shortlisted, Selected, Rejected). Inspect cover letters, download candidate resumes, and update status with history notes.
- **Company Profile**: Complete profile manager (logo upload, website, about, industry, size, address).

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS design tokens + Tailwind CSS + CSS Modules
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Notifications**: React Hot Toast
- **API Client**: Axios with request/response interceptors

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm / yarn / pnpm package manager

### Installation

1. Clone the repository and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_APP_NAME=JobPortal
   NEXT_PUBLIC_APP_TAGLINE="Find Opportunities. Hire Great Talent."
   NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Verification

To verify the production build locally:

```bash
npm run build
npm run start
```

---

## Vercel Deployment

1. Push your repository to **GitHub**.
2. Connect your GitHub repository to **Vercel**.
3. Set the Root Directory to `frontend` (if deploying from a monorepo structure).
4. Add the following Environment Variables in Vercel project settings:
   - `NEXT_PUBLIC_API_URL` (Points to your live backend API URL)
   - `NEXT_PUBLIC_PLAY_STORE_URL` (Your production Play Store URL)
5. Click **Deploy**. Vercel will automatically build and serve the optimized application.
