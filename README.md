<div align="center">

<img src="https://img.shields.io/badge/TripSync-FF6B35?style=for-the-badge&logo=airplane&logoColor=white" alt="TripSync" height="40" />

# TripSync

**Collaborative trip planning for groups — itinerary, expenses, files, and real-time sync in one place.**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API](#-api-highlights) · [Roadmap](#-roadmap)

</div>

---

## 📖 Project Overview

TripSync is a full-stack collaborative trip-planning platform where groups can plan travel together in real time. Instead of scattered group chats, email threads, and spreadsheets, TripSync gives every trip a shared workspace: a destination itinerary, a live expense ledger, file storage for tickets and bookings, and role-based member management — all updating instantly across every open browser tab via WebSockets.

> Built as a portfolio project to demonstrate full-stack development with real-time features, JWT auth with token rotation, RBAC, file uploads, and modern React patterns.

---

## ✨ Features

| Category | Features |
|---|---|
| **Trips** | Create, edit, delete trips with title, description, date range, and cover image |
| **Destinations** | Add places to visit with date, time (AM/PM), and estimated cost (₹) |
| **Members** | Invite by email, assign Owner / Editor / Viewer roles, remove members |
| **Expenses** | Log expenses by category, auto-calculate equal splits and per-person balances |
| **Documents** | Upload boarding passes, PDFs, and files to Cloudinary; scoped per trip |
| **Real-time** | All changes broadcast live to every member viewing the same trip via Socket.IO |
| **Auth** | JWT access tokens (15 min) + refresh tokens (7 days) with silent rotation |
| **Email** | Password reset emails and member-added notifications via SMTP / Mailtrap |
| **Theming** | Light / Dark / System theme toggle persisted to localStorage |
| **Docs** | Integrated product documentation at `/docs` |

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22.x | Runtime |
| Express | 5.x | HTTP framework (async error handling built-in) |
| MongoDB | 7.x | Database |
| Mongoose | 9.x | ODM with schema validation |
| Socket.IO | 4.x | WebSocket server for real-time sync |
| jsonwebtoken | 9.x | JWT generation and verification |
| bcryptjs | 3.x | Password hashing |
| Nodemailer | 9.x | Transactional email |
| Cloudinary | 2.x | File storage and CDN |
| Multer | 2.x | Multipart form / file upload middleware |
| Joi | 18.x | Request body validation via DTOs |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| Vite | 8.x | Build tool and dev server |
| TailwindCSS | 4.x | Utility-first styling |
| shadcn/ui | latest | Accessible component primitives |
| TanStack Query | 5.x | Server state management and caching |
| React Router | 7.x | Client-side routing |
| React Hook Form | 7.x | Form state and validation |
| Socket.IO Client | 4.x | Real-time event handling |
| Axios | 1.x | HTTP client with interceptors |
| date-fns | 4.x | Date formatting |
| Sonner | 2.x | Toast notifications |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (React)                      │
│  TanStack Query ──► Axios ──► REST API                   │
│  Socket.IO Client ──────────► WebSocket                  │
│  ThemeContext · AuthContext · SocketContext              │
└─────────────────────────────────────────────────────────┘
                          │  HTTP + WS
┌─────────────────────────────────────────────────────────┐
│                  Express 5 Server                        │
│  Routes ──► Middleware ──► Controller ──► Service        │
│  JWT Auth   RBAC   Validation (Joi DTOs)                 │
│  Socket.IO ──► socketAuth ──► Trip Rooms                 │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│  MongoDB (Mongoose)    │    Cloudinary (Files)           │
│  Users · Trips         │    SMTP (Nodemailer)            │
│  Members · Expenses    │                                 │
│  Destinations · Docs   │                                 │
└─────────────────────────────────────────────────────────┘
```

### Module pattern (Backend)

Every feature follows the same four-layer structure:

```
src/modules/<feature>/
  ├── <feature>.routes.js      # Express router + middleware chain
  ├── <feature>.controller.js  # Thin — reads req, calls service, sends res
  ├── <feature>.service.js     # Business logic + DB queries + socket emits
  ├── <feature>.model.js       # Mongoose schema
  └── dto/                     # Joi validation schemas
```

---

## 📁 Folder Structure

```
Trip Planner/
├── Backend/
│   ├── src/
│   │   ├── app.js                  # Express app, Socket.IO init, exports {app, server, io}
│   │   ├── server.js               # DB connection, server.listen
│   │   ├── socket/
│   │   │   ├── socket.js           # io.use(auth) + connection handler
│   │   │   ├── socket.middleware.js# JWT auth for WebSocket connections
│   │   │   └── handlers/
│   │   │       └── trip.handler.js # join-trip / leave-trip room logic
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── trips/
│   │   │   ├── members/
│   │   │   ├── destinations/
│   │   │   ├── expenses/
│   │   │   ├── documents/
│   │   │   └── users/
│   │   └── common/
│   │       ├── config/             # DB, Cloudinary, email transporter
│   │       ├── middleware/         # authorize.js (RBAC), upload.js (Multer)
│   │       ├── utils/              # ApiError, ApiResponse, jwt.utils
│   │       └── validators/         # Joi DTO runner
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── pages/                  # Route-level components
    │   ├── components/
    │   │   ├── ui/                 # shadcn primitives
    │   │   ├── shared/             # ThemeToggle, EmptyState, PageHeader
    │   │   ├── trips/
    │   │   ├── destinations/
    │   │   ├── expenses/
    │   │   ├── members/
    │   │   └── documents/
    │   ├── context/                # AuthContext, SocketContext, ThemeContext
    │   ├── hooks/                  # useTrips, useExpenses, useMembers …
    │   ├── services/               # Axios service modules per entity
    │   ├── layouts/                # MainLayout (sidebar + header)
    │   └── lib/                    # api.js (Axios instance + interceptors), rbac.js
    └── package.json
```

---

## 🗄 Database Design

```
Users
  _id, fullName, email, password (bcrypt), isVerified
  refreshToken (hashed), verificationToken, resetPasswordToken, resetPasswordTokenExpires

Trips
  _id, title, description, owner → Users, startDate, endDate, coverImage

TripMembers
  _id, tripId → Trips, userId → Users, role (Owner | Editor | Viewer)

Destinations
  _id, tripId → Trips, name, description, visitDate, visitTime, estimatedCost, createdBy → Users

Expenses
  _id, tripId → Trips, title, amount, shareAmount, category, paidBy → Users, note

Documents
  _id, tripId → Trips, name, url, publicId, uploadedBy → Users
```

**Key design decisions:**

- `refreshToken` is stored hashed (SHA-256) in the DB — a stolen token is useless without the raw value
- `shareAmount = amount / memberCount` is pre-computed on write for O(1) balance reads
- `TripMembers` is a separate collection (not embedded) so membership queries are index-friendly

---

## ⚡ Real-time Collaboration (Socket.IO)

Every trip gets its own Socket.IO room: `trip_<tripId>`. Members join when they open a trip page and automatically rejoin after reconnections.

### Auth flow

```
Client connects with { auth: { token: "Bearer <jwt>" } }
       │
io.use(socketAuth)  ──► verifyAccessToken() ──► User.findById()
       │                      ✓                       ✓
       └──► socket.data.user = { id, fullName, email }
            Connection accepted
```

### Events

| Event | Emitted after | Received by |
|---|---|---|
| `expense:created` | New expense saved | All members in trip room |
| `expense:updated` | Expense updated | All members in trip room |
| `expense:deleted` | Expense deleted | All members in trip room |
| `destination:created` | New destination saved | All members in trip room |
| `destination:updated` | Destination updated | All members in trip room |
| `destination:deleted` | Destination deleted | All members in trip room |
| `member:added` | Member added | All members in trip room |
| `member:updated` | Role changed | All members in trip room |
| `member:deleted` | Member removed | All members in trip room |
| `document:uploaded` | File uploaded | All members in trip room |
| `document:deleted` | File deleted | All members in trip room |

### Frontend handling

```js
// useTripSocket.js — joins room, registers listeners, cleans up on unmount
socket.emit("join-trip", tripId);
socket.on("connect", () => socket.emit("join-trip", tripId)); // handles reconnects

socket.on("expense:created", () =>
  queryClient.invalidateQueries({ queryKey: ["expenses", tripId] })
);
// ... same pattern for all 11 events
```

---

## 🔌 API Highlights

Base URL: `http://localhost:4000/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register new user |
| `POST` | `/auth/login` | — | Login, returns access token + sets refresh cookie |
| `POST` | `/auth/refresh-token` | Cookie | Silently rotate tokens |
| `POST` | `/auth/logout` | Bearer | Invalidate refresh token |
| `POST` | `/auth/forgot-password` | — | Send reset email |
| `PUT` | `/auth/reset-password/:token` | — | Reset password with token |
| `GET` | `/auth/me` | Bearer | Get current user |

### Trips

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/trips/create-trip` | Any | Create a new trip |
| `GET` | `/trips/getAllTrips` | Any | Get all trips for current user |
| `PATCH` | `/trips/:tripId` | Owner, Editor | Update trip details |
| `DELETE` | `/trips/:tripId` | Owner | Delete trip |
| `PATCH` | `/trips/:tripId/cover` | Owner, Editor | Upload cover image |

### Expenses

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/trips/:tripId/expenses` | All | Add expense |
| `GET` | `/trips/:tripId/expenses` | All | List expenses |
| `GET` | `/trips/:tripId/expenses/balances` | All | Get per-member balances |
| `PATCH` | `/trips/:tripId/expenses/:id` | Owner, Editor | Update expense |
| `DELETE` | `/trips/:tripId/expenses/:id` | Owner | Delete expense |

> Members, Destinations, and Documents follow the same RESTful pattern under `/trips/:tripId/`.

### RBAC Middleware

```js
// Middleware chain applied per route
authenticate          // verifies JWT, attaches req.user
loadTripRole         // looks up TripMember record, attaches req.tripRole
requireRole("Owner") // throws 403 if role is insufficient
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm i -g pnpm`)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (free tier)
- Mailtrap account (free tier, for email testing)




## 📸 Screenshots

> _Add screenshots here after deployment_

| Page | Preview |
|---|---|
| Landing Page | `screenshots/landing.png` |
| Dashboard | `screenshots/dashboard.png` |
| Trip Details | `screenshots/trip-details.png` |
| Expense Balances | `screenshots/balances.png` |
| Docs Page | `screenshots/docs.png` |

---

## 🗺 Roadmap

- [ ] Custom expense splits (per-person percentages)
- [ ] Command palette (`Ctrl+K`)
- [ ] Push notifications for trip events
- [ ] Comments on destinations and expenses
- [ ] Trip templates
- [ ] Mobile app (React Native)
- [ ] Calendar export (iCal / Google Calendar)
- [ ] Map view for destinations
- [ ] Self-removal from trips
- [ ] Public trip sharing (view-only link)

---

## 🧠 Challenges & Learnings

**React StrictMode + Socket.IO**
StrictMode double-invokes effects in development, creating two socket connections and causing the first one to be cleaned up before it connected — meaning `setSocket` was never called and the context stayed `null`. Fixed by wrapping `setSocket` in the socket's `connect` event with an `active` flag to guard against the StrictMode cleanup cycle.

**Token refresh race condition**
Multiple simultaneous API requests expiring at the same time all triggered refresh simultaneously, causing one to succeed and the rest to fail with "invalid token" (because the refresh token had already rotated). Fixed with a `isRefreshing` flag and a `failedQueue` in the Axios interceptor that queues all subsequent 401s and retries them with the new token once the refresh completes.

**Socket room auth after reconnect**
When a socket disconnects and reconnects (new socket ID on server), it loses room membership. Without rejoining, events were silently dropped. Fixed by listening to the socket's `connect` event inside `useTripSocket` and re-emitting `join-trip` on every (re)connection.

**RBAC at route level**
Implemented a two-step middleware approach: `loadTripRole` first fetches the member record and attaches `req.tripRole`, then `requireRole(...allowed)` checks it. This keeps route files declarative and avoids repeated DB lookups inside controllers.

---

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss a change before submitting a PR.

```bash
# Fork → clone → create a feature branch
git checkout -b feat/your-feature

# Make changes, then commit
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feat/your-feature
```

Please follow the existing code style: ES Modules, async/await, no default exports from service files.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Piyush Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-Piyushkumar--20-181717?style=flat-square&logo=github)](https://github.com/Piyushkumar-20)
[![Email](https://img.shields.io/badge/Email-piyush.dev200%40gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:piyush.dev200@gmail.com)

---

<div align="center">

Built with ☕ and too many boarding passes.

⭐ Star this repo if you found it useful!

</div>
