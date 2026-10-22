# 🪐 Orbit — Modern Social Network

> **"Find your people. Right here."**

Orbit is a complete, modern location-based social networking application combining the best elements of **Snapchat + Instagram + WhatsApp + an intelligent friend discovery platform**, built with a privacy-first architecture.

---

## 📱 App Highlights & Architecture

- **Nearby Discovery (Core Engine)**: Discover interesting people around you. Uses approximate distance (e.g. *500 m away*, *1.4 km away*) — **never exposes exact GPS coordinates or live address pinpoints**.
- **Smart Compatibility Matching**: Analyzes shared interests, common hobbies, and friendship preferences into a transparent percentage match (e.g. *"95% Match — You both like gaming, photography and travel"*).
- **Fast Snaps & Temporary Camera**: Snap camera with photo filters (Vintage, Cinematic, B&W, Warm, Glow), text, stickers, and broadcasting to **Nearby Snaps** (visible to people in your general area for 24 hours).
- **Real-Time Encrypted Chat**: Powered by Socket.io, supporting text, photo sharing, video sharing, voice notes with waveforms, message reactions, and read receipts.
- **Audio & Video Calling**: WebRTC peer-to-peer audio and video calling with dedicated calling screens, mute, speaker, and camera toggles.
- **24-Hour Stories**: Stories tray with unviewed indicators and viewer counters.
- **Full Privacy Controls**: Disabling discovery anytime, distance display customization (*Exact*, *Range*, *Hidden*), connection permissions, blocking, and reporting.
- **Admin Management Portal**: Real-time moderation, user ban/unban controls, report resolution queue, and interest taxonomy manager.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Mobile App** | React Native + Expo (v51) + TypeScript | Cross-platform iOS/Android mobile client |
| **Backend** | Node.js + Express + TypeScript | High-performance RESTful API |
| **Real-time** | Socket.io + Redis | Instant messaging, typing indicators, presence, WebRTC signaling |
| **Database** | PostgreSQL + PostGIS Extension | ACID relational storage + geospatial proximity queries |
| **ORM** | Prisma ORM | Type-safe database queries and migrations |
| **Calling** | WebRTC + Google STUN / Coturn | Real-time P2P encrypted voice and video calls |
| **Media Processing** | Sharp + S3 / Local Storage | Image optimization, thumbnail generation, streaming |
| **Admin Web App** | React + Vite + Tailwind CSS | Operations and moderation dashboard |

---

## 📂 Monorepo Structure

```
orbit/
├── apps/
│   ├── mobile/             # React Native Expo mobile application
│   │   ├── src/
│   │   │   ├── components/ # NearbyUserCard, MessageBubble, ChatInput, Avatar, etc.
│   │   │   ├── screens/    # Nearby, Discover, Chats, Profile, Camera, Calls, etc.
│   │   │   ├── navigation/ # Bottom tabs with custom raised snap button & stack navigators
│   │   │   ├── services/   # Socket.io client, Axios API, Expo Location
│   │   │   ├── store/      # Redux Toolkit slices (auth, nearby, chat)
│   │   │   └── theme/      # Colors, typography, spacing
│   └── admin/              # React Vite Tailwind Admin Web Dashboard
│       └── src/
│           ├── pages/      # Dashboard, Users, Reports, Interests, Moderation
│           ├── components/ # Sidebar, Layout, Navigation
│           └── services/   # Admin API client
├── backend/                # Node.js TypeScript API & Realtime Server
│   ├── prisma/             # Schema & Seed scripts (PostGIS enabled)
│   └── src/
│       ├── modules/        # Auth, Profiles, Location, Connections, Chat, Snaps, Stories, Calls, Admin
│       ├── realtime/       # Socket.io server & WebRTC signaling handler
│       ├── middleware/     # JWT authentication, validation, rate limiting, upload
│       └── utils/          # Location fuzzing, Haversine, compatibility algorithms
├── packages/
│   └── shared/             # Shared TypeScript types and calculation utilities
├── docker-compose.yml      # PostgreSQL (PostGIS) & Redis containers
└── package.json            # Root workspace scripts
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **Docker & Docker Compose** (for PostgreSQL + PostGIS and Redis)

### 2. Start PostgreSQL + Redis
```bash
docker-compose up -d
```
This spins up:
- PostgreSQL 15 with **PostGIS** on `localhost:5432` (db: `orbit`, user: `orbit`, pass: `orbit_dev_pass`)
- Redis on `localhost:6379`

### 3. Setup Backend
```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
> **Pre-seeded Admin**: `admin@orbit.app` / `Admin@123`  
> **Pre-seeded Test Users**: Automatically creates 4 sample profiles in San Francisco with rich interests, bios, and locations for instant nearby discovery.

### 4. Run Mobile App
```bash
cd ../apps/mobile
npm install
npx expo start
```
Scan the QR code with **Expo Go** on iOS or Android, or press `a` for Android Emulator / `i` for iOS Simulator.

### 5. Run Admin Dashboard
```bash
cd ../apps/admin
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser and log in with `admin@orbit.app` / `Admin@123`.

---

## 🛡️ Privacy & Security Safeguards

1. **Deterministic Coordinate Jitter (Fuzzing)**: Coordinates are passed through `fuzzifyLocation(lat, lng, 100)` before any storage or calculation. Exact latitude and longitude are **never returned to other clients**.
2. **Approximate Distances Only**: Distances are formatted as human-friendly approximations (e.g. `800 m away`, `1.4 km away`). Users can set distance to `Range` or `Hidden`.
3. **One-Tap Ghost Mode**: Users can toggle off `Nearby Discovery` in Privacy Settings at any time to disappear from nearby feeds.
4. **Connection Guard**: Strangers cannot direct-message or call unless connections or privacy permissions are configured to allow it.
5. **Auto-Expiring Media**: Snaps and stories automatically expire after their lifespan (View Once, 24 Hours, or 7 Days).

---

## 📜 License
MIT
