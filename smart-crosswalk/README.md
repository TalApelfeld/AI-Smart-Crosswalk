# Smart Crosswalk AI System

AI-powered pedestrian detection system for crosswalk safety.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Tailwind v4)              │
│                           Port 5173                             │
├─────────────────────────────────────────────────────────────────┤
│  Pages          │  Components      │  Hooks         │  API      │
│  - Dashboard    │  - UI (Button,   │  - useAlerts   │  - config │
│  - Alerts       │    Card, Badge)  │  - useCross-   │  - alerts │
│  - Crosswalks   │  - Layout        │    walks       │  - cross- │
│                 │  - Alerts        │                │    walks  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                    │
│                         Port 3000                               │
├─────────────────────────────────────────────────────────────────┤
│  Routes          │  Services        │  Models        │  Config  │
│  - /api/alerts   │  - alertService  │  - Alert       │  - db    │
│  - /api/cross-   │  - crosswalk-    │  - Crosswalk   │  - const │
│    walks         │    Service       │                │          │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose
                             ▼
                    ┌─────────────────┐
                    │  MongoDB Atlas  │
                    └─────────────────┘
```

## 📁 Project Structure

```
smart-crosswalk/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── constants.js       # App constants
│   ├── middleware/
│   │   └── errorMiddleware.js # Error handling
│   ├── models/
│   │   ├── Alert.js
│   │   ├── Crosswalk.js
│   │   └── index.js
│   ├── routes/
│   │   ├── alertRoutes.js
│   │   ├── crosswalkRoutes.js
│   │   └── index.js
│   ├── services/
│   │   ├── alertService.js
│   │   ├── crosswalkService.js
│   │   └── index.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── config.js      # Axios instance
    │   │   ├── alerts.js
    │   │   ├── crosswalks.js
    │   │   └── index.js
    │   ├── components/
    │   │   ├── ui/            # Reusable UI components
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Spinner.jsx
    │   │   │   └── index.js
    │   │   ├── layout/        # Layout components
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── PageHeader.jsx
    │   │   │   └── index.js
    │   │   └── alerts/        # Feature components
    │   │       ├── AlertCard.jsx
    │   │       ├── StatsCard.jsx
    │   │       └── index.js
    │   ├── hooks/
    │   │   ├── useAlerts.js
    │   │   ├── useCrosswalks.js
    │   │   └── index.js
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Alerts.jsx
    │   │   ├── Crosswalks.jsx
    │   │   └── index.js
    │   ├── utils/
    │   │   └── index.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css          # Tailwind v4 theme
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-crosswalk
CORS_ORIGIN=http://localhost:5173
```

Start server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 🎨 Theme (Tailwind v4)

Custom theme variables defined in `src/index.css`:

### Colors
- `primary-*` - Blue shades (buttons, links)
- `success-*` - Green shades (resolved, online)
- `warning-*` - Amber shades (maintenance, medium alerts)
- `danger-*` - Red shades (active alerts, errors)
- `surface-*` - Slate shades (backgrounds, text)

### Components
Pre-built component classes:
- `.card` - Card container
- `.btn`, `.btn-primary`, `.btn-secondary`, etc.
- `.badge`, `.badge-success`, `.badge-danger`, etc.
- `.input` - Form inputs

## 📡 API Endpoints

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all alerts |
| GET | `/api/alerts/stats` | Get alert statistics |
| GET | `/api/alerts/:id` | Get single alert |
| PATCH | `/api/alerts/:id` | Update alert |

### Crosswalks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crosswalks` | Get all crosswalks |
| GET | `/api/crosswalks/stats` | Get statistics |
| GET | `/api/crosswalks/:id` | Get single crosswalk |
| POST | `/api/crosswalks` | Create crosswalk |
| PATCH | `/api/crosswalks/:id` | Update crosswalk |
| PATCH | `/api/crosswalks/:id/led` | Toggle LED |

## ✅ Sprint Progress

### Sprint 1 ✓
- [x] Development environment
- [x] Git + GitHub setup
- [x] Basic Express server
- [x] Basic React + Vite project

### Sprint 2 ✓
- [x] MongoDB connection with Mongoose
- [x] Alert model & routes
- [x] Crosswalk model & routes
- [x] Frontend API integration
- [x] Alerts display with auto-refresh

### Future Sprints
- [ ] AI Detection (YOLOv8 + Pose Estimation)
- [ ] POST /api/detection endpoint
- [ ] LoRaWAN LED control
- [ ] User authentication
- [ ] Real-time WebSocket updates
- [ ] Analytics dashboard

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, Mongoose
- **Frontend:** React 18, React Router 6
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite 5
- **Database:** MongoDB Atlas
- **HTTP Client:** Axios

## 📝 License

MIT
