# 🚦 AI Smart Crosswalk - Frontend

React-based frontend for the AI Smart Crosswalk monitoring system.

## 📚 Learning Topics Covered

### ✅ Axios
Axios is a promise-based HTTP client for making API requests. We use it to communicate with our backend.

**Key Concepts:**
- Creating axios instances with base configuration
- Interceptors for request/response handling
- Error handling
- Making GET, POST, PATCH requests

**Our Implementation:** `src/services/api.js`

### ✅ React Router
React Router enables navigation between different pages without page reload (Single Page Application).

**Key Concepts:**
- `BrowserRouter` - Wrapper for routing functionality
- `Routes` & `Route` - Define URL patterns and components
- `Link` - Navigate between pages
- `useNavigate` - Programmatic navigation

**Our Implementation:** `src/App.js`

### ✅ React Hooks

#### useState
Manages component state (data that can change).

```javascript
const [alerts, setAlerts] = useState([]); // State for alerts array
const [loading, setLoading] = useState(true); // State for loading status
```

#### useEffect
Runs side effects (like API calls) when component mounts or updates.

```javascript
useEffect(() => {
  fetchAlerts(); // Fetch data when component mounts
}, []); // Empty array = run once
```

**Our Implementation:** `src/pages/AlertsPage.js`

## 🚀 Getting Started

### Installation
```bash
cd frontend
npm install
```

### Run Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components (future)
│   ├── pages/           # Page components
│   │   ├── AlertsPage.js      # Main alerts dashboard
│   │   └── AlertsPage.css     # Styles for alerts page
│   ├── services/        # API services
│   │   └── api.js             # Axios API client
│   ├── App.js           # Main app with routing
│   ├── App.css          # Global styles
│   └── index.js         # Entry point
└── package.json
```

## 🔌 Backend Communication

The frontend communicates with the backend at `http://localhost:5000/api`

**Make sure the backend server is running before starting the frontend!**

## 🎨 Current Features (Sprint 1)

- ✅ Basic alerts display page
- ✅ Real-time data fetching from backend
- ✅ Filtering by severity and status
- ✅ Update alert status (resolve/dismiss)
- ✅ Responsive design
- ✅ Loading and error states

## 📋 Pages Planning

### Current Pages:
1. **Dashboard (AlertsPage)** - Main page showing all alerts

### Future Pages (Sprint 2):
2. **Alert Details** - Detailed view of a single alert
3. **Crosswalks Management** - View and manage crosswalk locations
4. **Analytics** - Statistics and trends
5. **Settings** - System configuration

## 🛠️ Technologies

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## 📝 How It Works

### Data Flow:
1. **Component Mounts** → `useEffect` runs
2. **API Call** → Axios fetches data from backend
3. **Update State** → `useState` updates component data
4. **Re-render** → Component displays updated data

### User Interactions:
1. User clicks filter → State updates
2. User clicks "Apply" → New API call with filters
3. Backend responds → State updates → UI updates

## 🎯 Learning Objectives Achieved

- [x] Understand and use Axios for API calls
- [x] Implement React Router for navigation
- [x] Use useState for state management
- [x] Use useEffect for side effects
- [x] Fetch and display backend data
- [x] Basic UI design and layout
- [x] Verify backend-frontend communication

## 🚀 Next Steps

1. Add more pages (Alert Details, Crosswalks, etc.)
2. Improve UI/UX design
3. Add authentication
4. Real-time updates with WebSockets
5. Add charts and analytics

## 🐛 Troubleshooting

**Backend Connection Error:**
- Make sure backend is running on port 5000
- Check CORS is enabled on backend
- Verify API endpoints match

**React Errors:**
- Clear node_modules and reinstall: `npm install`
- Check console for specific error messages

## 📖 Useful Resources

- [React Documentation](https://react.dev/)
- [React Router Docs](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
