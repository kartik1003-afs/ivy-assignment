# Ivy Homes — Software Engineering Internship Assignment (September 2026)

**Candidate**: Kartik Kumar  
**College Email**: 20234057@mnnit.ac.in  
**Assigned City**: Gurgaon  
**Assigned Locality**: Mg Road  
**API Key**: `IVY26-DD7ADA724ED4`  
**Live Demo**: [https://ivy-homes-assignment.vercel.app](https://ivy-homes-assignment.vercel.app)  
**Repository**: [https://github.com/kartik1003-afs/ivy-assignment](https://github.com/kartik1003-afs/ivy-assignment)

---

## Overview

This repository contains:
1. **`submission.json`**: Complete answers to all 10 city-scoped questions and 17 documented API findings with exact evidence IDs.
2. **Web Application**: A full-featured React 18 single-page application built with Vite, Tailwind CSS, Lucide icons, and Recharts.

---

## 🚀 How to Run the Web Application

### Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or higher

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Local Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

### Demo Accounts for Testing
Login using any of the three demo credentials (all use password `69674142f0`):
- `demo1@ivy.homes`
- `demo2@ivy.homes`
- `demo3@ivy.homes`

---

## 🔍 How We Uncovered Documentation Lies & What We Did

We took an empirical, hypothesis-driven approach by probing endpoints, logging raw HTTP payloads, and running data quality assertions across all 3,500 sale listings, 1,320 rental properties, and 400 builder projects.

### Key Discoveries & Fixes

1. **Authentication Header vs Query Parameter (`auth`)**:
   - **Documented**: `GET /v1/listings?api_key=IVY26-XXXXXXXXXXXX`
   - **Actual**: Passing query parameter returns HTTP `401`. API requires `X-API-Key: IVY26-DD7ADA724ED4` header.
   - **Fix**: Configured API client module to attach `X-API-Key` to every outbound request header.

2. **Session Token Expiration & Refresh Flow (`auth` / `undocumented_endpoint`)**:
   - **Documented**: `POST /auth/login` returns `token` valid for 24 hours (86,400s) with no refresh flow.
   - **Actual**: Returns `access_token`, `expires_in` is 15 minutes (900s), and provides `refresh_token` with `refresh_url: /auth/refresh`.
   - **Fix**: Built an automatic session manager in `AuthContext.jsx` that background-refreshes tokens every 12 minutes using `POST /auth/refresh`, maintaining user sessions seamlessly across page reloads and 30+ minutes of activity.

3. **Pagination & Offset Parameters (`pagination`)**:
   - **Documented**: `page` (1-indexed) and `limit` (max 200). Returns `page` and `page_size`.
   - **Actual**: `page` parameter is ignored (always returns offset 0). The API uses `offset` and `limit` (capped at 50 max). Response includes `offset`, `limit`, `count`, `total`, and `has_more`.
   - **Fix**: Refactored frontend and data fetchers to use offset-based pagination (`offset`, `limit=50`).

4. **Missing Endpoints (`missing_endpoint`)**:
   - `GET /v1/listing/{id}` ➔ 404 (Correct endpoint is plural `GET /v1/listings/{id}`).
   - `GET /v1/listings/{id}/similar` ➔ 404 (Computed client-side based on same locality & BHK).
   - `/v1/favourites` (GET/POST/DELETE) ➔ 404 (Persisted in `localStorage` per user email).
   - `GET /v1/analytics/summary` ➔ 404 (Aggregated live on the Insights screen).

5. **Project Prices & Area Units (`units`)**:
   - **Documented**: Project `price_min` and `price_max` in integer rupees.
   - **Actual**: Project prices are floats in Crores/Lakhs (e.g., `5.83` Cr or `94.6` Lakhs). `magichomes` listings use square meters for `carpet_area`.
   - **Fix**: Added unit conversion handlers to display formatted INR values across project cards and listing detail pages.

6. **Corrupt & Fake Listings (`data_quality` / `fraud`)**:
   - Uncovered 18 corrupt listings (negative prices, floor > total floors, carpet > super built) and 6 clickbait fake listings with prices under ₹30,000.
   - **Fix**: Added UI warning badges for corrupt/fake listings and excluded them from average price calculations.

---

## 🧪 What We Checked That Turned Out To Be Fine

The hypotheses that did **not** pan out provided valuable validation:

1. **Hypothesis: Query Filter Failure**
   - *Thought*: Server-side filters (`locality`, `bhk`, `furnishing`, `property_type`, `sort_by`, `order`) might be ignored or broken.
   - *Check*: Tested filtered requests against unfiltered base counts.
   - *Result*: **Fine.** Server-side filtering and sorting on `/v1/listings` work properly when passed correctly with `offset`.

2. **Hypothesis: Server Time Drift & Timezone Offset**
   - *Thought*: `/health` server time might lack explicit timezone offset or drift from UTC.
   - *Check*: Inspected ISO 8601 string from `/health`.
   - *Result*: **Fine.** `/health` carries an explicit `+05:30` IST offset (`Asia/Kolkata`) and accurate server time.

3. **Hypothesis: Duplicate Listing URLs across Portals**
   - *Thought*: Cross-portal listings might duplicate exact listing URLs or IDs.
   - *Check*: Cross-referenced listing URLs and numerical ID suffixes.
   - *Result*: **Fine.** Each portal generates unique listing IDs and URLs, requiring physical property signature grouping (`locality`, `apartment_name`, `floor`, `bedroom`, `facing`) to identify duplicate physical properties.

4. **Hypothesis: Scoping Parameter Missing**
   - *Thought*: Multi-city API might require explicit `city_id` query params.
   - *Check*: Queried endpoints without city filter.
   - *Result*: **Fine.** The API key automatically scopes all records to Gurgaon server-side.

---

## 💡 What We Would Do With Another Two Days

1. **Interactive Map View**:
   - Integrate Leaflet / Mapbox to render property pins using `latitude` and `longitude` fields.
2. **Automated Schema & Endpoint Regression Suite**:
   - Add Playwright / Vitest integration tests that continuously probe all endpoints and flag documentation drift automatically.
3. **Seller Inquiry Modal & Lead Manager**:
   - Add seller contact popups with message drafting and enquiry history tracking.
4. **Server-Side Proxy & Cache Layer**:
   - Implement Next.js API routes with edge caching to reduce client roundtrips and accelerate pagination.
