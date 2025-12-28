# 🎨 UI/UX Planning - AI Smart Crosswalk Frontend

## 📋 Pages Structure

### 1. **Dashboard / Home Page** ✅ (Current)
**Route:** `/`

**Purpose:** Main overview of all alerts in the system

**Components:**
- Header with navigation
- Filter controls (severity, status, type)
- Statistics cards (total alerts, active, critical)
- Alerts grid/list
- Refresh button

**Data Displayed:**
- All alerts from backend
- Alert type, severity, status
- Timestamp
- AI confidence level
- Quick actions (resolve, dismiss)

**Status:** ✅ Completed

---

### 2. **Alert Details Page** (Planned)
**Route:** `/alert/:id`

**Purpose:** Detailed view of a single alert with full information

**Components:**
- Back to dashboard button
- Alert header (type, severity, status)
- Full alert description
- AI detection data:
  - Confidence score
  - Detected objects list
  - Image/video frame (if available)
  - Coordinates of detected objects
- Related crosswalk information
- Timeline of status changes
- Action buttons (resolve, dismiss, reopen)

**Data Needed:**
- Single alert by ID
- Related crosswalk details
- Alert history/logs

**API Endpoints:**
- GET `/api/alerts/:id`
- PATCH `/api/alerts/:id`

---

### 3. **Crosswalks Management Page** (Planned)
**Route:** `/crosswalks`

**Purpose:** View and manage all crosswalk locations

**Components:**
- Add new crosswalk button
- Crosswalks grid/list
- Search and filter controls
- Map view (future enhancement)

**Data Displayed:**
- Crosswalk name
- Location (address, city)
- Camera URL and status
- Crosswalk type
- Active/inactive status
- Number of alerts from this crosswalk

**Actions:**
- Add new crosswalk
- Edit crosswalk details
- View crosswalk alerts
- Enable/disable crosswalk

**API Endpoints (Need to create):**
- GET `/api/crosswalks`
- POST `/api/crosswalks`
- GET `/api/crosswalks/:id`
- PATCH `/api/crosswalks/:id`
- DELETE `/api/crosswalks/:id`

---

### 4. **Crosswalk Details Page** (Planned)
**Route:** `/crosswalk/:id`

**Purpose:** Detailed view of a specific crosswalk

**Components:**
- Crosswalk information card
- Camera live feed (if possible)
- Recent alerts from this crosswalk
- Statistics (alerts per day, types, etc.)
- Edit button

**Data Displayed:**
- Full crosswalk details
- Camera status and URL
- Location with map
- Recent alerts
- Historical statistics

---

### 5. **Analytics & Statistics Page** (Planned)
**Route:** `/analytics`

**Purpose:** Visual analytics and trends

**Components:**
- Date range selector
- Charts and graphs:
  - Alerts over time (line chart)
  - Alerts by severity (pie chart)
  - Alerts by type (bar chart)
  - Alerts by crosswalk (comparison)
- Key metrics cards
- Export data button

**Data Needed:**
- Aggregated alert statistics
- Time-series data
- Crosswalk comparisons

**Libraries to Use:**
- Chart.js or Recharts for visualizations

---

### 6. **Settings Page** (Future)
**Route:** `/settings`

**Purpose:** System configuration and preferences

**Components:**
- User preferences
- Notification settings
- System configuration
- AI model settings (if applicable)

---

### 7. **About Page** ✅ (Basic)
**Route:** `/about`

**Purpose:** Information about the system

**Components:**
- Project description
- Team information
- Technology stack
- Contact information

**Status:** ✅ Basic version completed

---

## 🎨 Design System

### Color Palette
```css
Primary: #667eea (Purple)
Secondary: #764ba2 (Dark Purple)
Success: #28a745 (Green)
Warning: #ffc107 (Yellow)
Danger: #dc3545 (Red)
Info: #17a2b8 (Blue)
Background: #f5f7fa (Light Gray)
```

### Severity Colors
```css
Low: #28a745 (Green)
Medium: #ffc107 (Yellow)
High: #fd7e14 (Orange)
Critical: #dc3545 (Red)
```

### Components Style
- Rounded corners (border-radius: 10px)
- Soft shadows
- Gradient backgrounds for headers
- Hover effects on interactive elements
- Responsive grid layout

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Considerations
- Stack cards vertically
- Hamburger menu for navigation
- Touch-friendly buttons
- Simplified filters (drawer/modal)

---

## 🔄 User Flow

### Main User Journey:
1. User lands on **Dashboard**
2. Views all active alerts
3. Clicks on alert → Goes to **Alert Details**
4. Reviews full information
5. Takes action (resolve/dismiss)
6. Returns to Dashboard

### Management Flow:
1. User goes to **Crosswalks** page
2. Views all crosswalk locations
3. Clicks on crosswalk → Goes to **Crosswalk Details**
4. Views recent alerts and statistics
5. Can edit crosswalk settings

### Analytics Flow:
1. User goes to **Analytics** page
2. Selects date range
3. Views charts and trends
4. Exports data if needed

---

## 🚀 Implementation Priority

### Sprint 1 (Current) ✅
- [x] Basic Dashboard with alerts
- [x] API integration
- [x] Filtering and status updates
- [x] Responsive layout

### Sprint 2 (Next)
- [ ] Alert Details Page
- [ ] Crosswalks Management (basic CRUD)
- [ ] Navigation improvements
- [ ] Loading skeletons
- [ ] Error boundaries

### Sprint 3 (Future)
- [ ] Analytics Dashboard
- [ ] Charts and visualizations
- [ ] Advanced filters
- [ ] Search functionality
- [ ] Pagination improvements

### Sprint 4 (Advanced)
- [ ] Real-time updates (WebSockets)
- [ ] Map integration
- [ ] Camera live feed
- [ ] User authentication
- [ ] Notifications system

---

## 🎯 Key UI/UX Principles

1. **Clarity:** Information should be easy to understand at a glance
2. **Efficiency:** Common actions should require minimal clicks
3. **Feedback:** Always show loading states and confirmations
4. **Consistency:** Use the same patterns throughout the app
5. **Accessibility:** Ensure good contrast and keyboard navigation
6. **Mobile-First:** Design for mobile, enhance for desktop

---

## 📦 Components to Build

### Reusable Components (Future):
- `AlertCard` - Display single alert
- `Button` - Styled button component
- `Card` - Generic card container
- `Modal` - Popup dialog
- `LoadingSpinner` - Loading indicator
- `ErrorMessage` - Error display
- `FilterBar` - Reusable filter controls
- `StatCard` - Statistics display card
- `Badge` - Status/severity badge
- `Navbar` - Navigation bar (already in App.js)

---

## 🔗 Navigation Structure

```
Home (/)
├── Alert Details (/alert/:id)
├── Crosswalks (/crosswalks)
│   └── Crosswalk Details (/crosswalk/:id)
├── Analytics (/analytics)
├── Settings (/settings)
└── About (/about)
```

---

## 📝 Notes

- Keep backend API in sync with frontend needs
- Consider adding loading skeletons for better UX
- Plan for pagination when dealing with large datasets
- Consider adding filters to local storage for persistence
- Think about error recovery strategies
- Plan for offline functionality (future)
