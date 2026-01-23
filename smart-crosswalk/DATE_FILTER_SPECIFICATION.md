# 📅 מסמך איפיון - סינון לפי תאריך והיסטוריית אירועים

## תאריך: 23 ינואר 2026

---

## 📋 סקירה כללית

מסמך זה מפרט את דרישות המערכת להוספת סינון לפי תאריך והצגת היסטוריית אירועים במערכת מעברי החצייה.

---

## 🎯 דרישות עסקיות

### 1. מסך מעברי חצייה - דף פרטי מעבר חצייה

**דרישה עיקרית:**
כאשר משתמש לוחץ על מעבר חצייה, נפתח דף פרטים ייעודי שמציג:

#### 1.1 מידע כללי על מעבר החצייה
- מיקום (עיר, רחוב, מספר)
- מזהה Camera ו-LED
- סטטוס התקנים
- תאריך יצירה

#### 1.2 סטטיסטיקות אירועים
- **סה"כ אירועים** - מספר כולל של כל ההתראות
- **לפי רמת סכנה:**
  - High Danger - מספר אירועים ברמת סכנה גבוהה
  - Medium Danger - מספר אירועים ברמת סכנה בינונית  
  - Low Danger - מספר אירועים ברמת סכנה נמוכה

#### 1.3 סינון אירועים
**פילטרים זמינים:**

1. **טווח תאריכים** (Date Range) - **דרישה עיקרית** ⭐
   - תאריך התחלה (From Date)
   - תאריך סיום (To Date)
   - Presets מובנים:
     - Today (היום)
     - Last 7 Days (שבוע אחרון)
     - Last 30 Days (חודש אחרון)
     - This Month (החודש הנוכחי)
     - Last Month (החודש שעבר)
     - All Time (כל הזמנים)

2. **רמת סכנה** (Danger Level)
   - All Levels (כל הרמות)
   - High (גבוהה)
   - Medium (בינונית)
   - Low (נמוכה)

3. **מיון** (Sort By)
   - Newest First (החדשים ראשון) - ברירת מחדל
   - Oldest First (הישנים ראשון)
   - Danger Level (לפי רמת סכנה)

#### 1.4 רשימת אירועים (Events History)
**תצוגת כל אירוע:**
- תאריך ושעה מדויקים
- רמת הסכנה (עם אייקון וצבע)
- תמונת האירוע (placeholder אם אין תמונה)
- מזהה ההתראה
- כפתורי פעולה (View Details, Download Image)

**Pagination:**
- 50 אירועים בעמוד (ברירת מחדל)
- ניווט בין עמודים
- הצגת מספר העמוד הנוכחי ומספר העמודים הכולל

---

### 2. מסך התראות - סינון לפי תאריך

**דרישה עיקרית:**
הוספת סינון לפי תאריך לסרגל הסינון הקיים.

#### 2.1 פילטרים במסך התראות

**פילטרים קיימים:**
1. Danger Level (רמת סכנה)
2. Search Crosswalk (חיפוש מעבר חצייה)

**פילטר חדש להוספה:** ⭐

3. **Date Range (טווח תאריכים)**
   - תאריך התחלה (From Date)
   - תאריך סיום (To Date)
   - Presets מובנים (כמו בדף פרטי מעבר חצייה)

**אינטגרציה:**
- הפילטר יעבוד בשילוב עם הפילטרים הקיימים
- לחיצה על "Clear All" תנקה גם את סינון התאריכים
- הסינון יתבצע בצד הלקוח (Frontend) על הנתונים הקיימים

---

## 🏗️ ארכיטקטורה טכנית

### Backend - שינויים נדרשים

#### API Endpoints קיימים (כבר מומשו)

1. **GET /api/crosswalks/:id/alerts**
   - משמש לקבלת אירועים למעבר חצייה ספציפי
   - תומך בפילטרים: `startDate`, `endDate`, `dangerLevel`, `sortBy`, `page`, `limit`
   - ✅ כבר קיים ועובד

2. **GET /api/crosswalks/:id/stats**
   - מחזיר סטטיסטיקות עבור מעבר חצייה
   - ✅ כבר קיים ועובד

**לא נדרשים שינויים ב-Backend** - כל ה-API endpoints כבר קיימים ומספקים את הפונקציונליות הנדרשת.

---

### Frontend - רכיבים חדשים ושינויים

#### 1. קומפוננטים קיימים (כבר מומשו)

✅ **DateRangePicker.jsx** - קיים
- בחירת טווח תאריכים עם presets
- Custom range
- Validation

✅ **AlertHistoryCard.jsx** - קיים
- תצוגת אירוע בהיסטוריה
- תמונה + פרטים
- כפתורי פעולה

✅ **CrosswalkDetailsPage.jsx** - קיים
- דף פרטים מלא
- סטטיסטיקות
- סינון והיסטוריה

✅ **useCrosswalkDetails.js** - קיים
- Hook לניהול state של דף פרטים

#### 2. שינויים נדרשים

**A. הוספת DateRangePicker למסך Alerts** 🔨

**קובץ:** `frontend/src/pages/Alerts.jsx`

**שינויים:**
1. הוסיף `dateRange` ל-state של filters:
```javascript
const [filters, setFilters] = useState({
  dangerLevel: 'all',
  crosswalkSearch: '',
  dateRange: { startDate: null, endDate: null }  // NEW
});
```

2. עדכן את `handleClearFilters` לכלול dateRange
3. עדכן את `filteredAlerts` לסנן לפי תאריך:
```javascript
// Filter by date range
if (filters.dateRange.startDate || filters.dateRange.endDate) {
  const alertDate = new Date(alert.timestamp);
  if (filters.dateRange.startDate && alertDate < new Date(filters.dateRange.startDate)) {
    return false;
  }
  if (filters.dateRange.endDate && alertDate > new Date(filters.dateRange.endDate)) {
    return false;
  }
}
```

**B. עדכון FilterBar להציג DateRangePicker** 🔨

**קובץ:** `frontend/src/components/alerts/FilterBar.jsx`

**שינויים:**
1. ייבוא DateRangePicker
2. הוספת `dateRange` ל-getFilterConfig
3. תצוגה מותנית של DateRangePicker במקום select

**C. הוספת ניווט לדף פרטים** 🔨

**קובץ:** `frontend/src/pages/Crosswalks.jsx`

**שינוי:**
- הוספת onClick על CrosswalkCard שמנווט ל-`/crosswalks/:id`
- שימוש ב-useNavigate מ-react-router-dom

**קוד לדוגמה:**
```jsx
import { useNavigate } from 'react-router-dom';

function CrosswalkCard({ crosswalk, onEdit, onDelete }) {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/crosswalks/${crosswalk._id}`);
  };

  return (
    <Card onClick={handleViewDetails} className="cursor-pointer hover:shadow-lg">
      {/* ... */}
    </Card>
  );
}
```

---

## 📊 מבני נתונים

### Alert Object
```typescript
interface Alert {
  _id: string;
  timestamp: Date;  // ⭐ שדה קריטי לסינון
  dangerLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  crosswalkId: {
    _id: string;
    location: {
      city: string;
      street: string;
      number: string;
    }
  };
  detectionPhoto?: {
    url: string;
  };
  createdAt: Date;
}
```

### DateRange Filter
```typescript
interface DateRangeFilter {
  startDate: Date | null;
  endDate: Date | null;
}
```

### Filters State
```typescript
interface AlertsFilters {
  dangerLevel: 'all' | 'LOW' | 'MEDIUM' | 'HIGH';
  crosswalkSearch: string;
  dateRange: DateRangeFilter;  // NEW
}
```

---

## 🎨 עיצוב ממשק

### 1. דף פרטי מעבר חצייה

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Crosswalks                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🚦 Dizengoff 50, Tel Aviv                             │
│                                                         │
│  📷 Camera Active    💡 LED #A1B2C3                    │
│  📅 Created: Jan 15, 2026                              │
└─────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Events │   High       │   Medium     │    Low       │
│     156      │    42        │     78       │     36       │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────────────┐
│  Filter Events                           [Clear Filters] │
├─────────────────────────────────────────────────────────┤
│  Date Range:                                            │
│  [Today] [Last 7 Days] [Last 30 Days] [Custom Range]   │
│                                                         │
│  From: [DD/MM/YYYY]    To: [DD/MM/YYYY]    [Apply]    │
│                                                         │
│  Danger Level:          Sort By:                        │
│  [All Levels ▼]         [Newest First ▼]              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Events History (156 total)                             │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🚨 High Danger Alert        Jan 22, 14:35        │ │
│  ├───────────────────────────────────────────────────┤ │
│  │  ┌─────────┐  Detected: Jan 22, 2026 14:35      │ │
│  │  │ [Image] │  Danger Level: High                 │ │
│  │  │         │  Camera: #A1B2C3                    │ │
│  │  └─────────┘  Alert ID: 65f3a2...                │ │
│  │                                                   │ │
│  │  [View Details]  [Download Image]                │ │
│  └───────────────────────────────────────────────────┘ │
│  ...more alerts...                                      │
│                                                         │
│  [← Previous]  [1] [2] [3] ... [8]  [Next →]         │
└─────────────────────────────────────────────────────────┘
```

### 2. מסך התראות - עם סינון תאריך

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Filters                                 [Clear All] │
│                                          [▼ Show]        │
├─────────────────────────────────────────────────────────┤
│  Danger Level:         Search Crosswalk:                │
│  [All Levels ▼]        [🔍 Search by city, street...]  │
│                                                         │
│  Date Range:                                            │
│  [Today] [Last 7 Days] [Last 30 Days] [Custom Range]   │
│  From: [DD/MM/YYYY]    To: [DD/MM/YYYY]    [Apply]    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 זרימות משתמש (User Flows)

### Flow 1: צפייה בהיסטוריה של מעבר חצייה

```
┌─────────────────┐
│  Crosswalks     │
│  List Page      │
└────────┬────────┘
         │
         │ User clicks on crosswalk card
         ▼
┌─────────────────────┐
│ CrosswalkDetailsPage│
│ /crosswalks/:id     │
│                     │
│ Shows:              │
│ - Crosswalk info    │
│ - Statistics        │
│ - All alerts        │
└────────┬────────────┘
         │
         │ User selects "Last 7 Days"
         ▼
┌─────────────────────┐
│ Filtered Events     │
│ Shows only events   │
│ from last 7 days    │
└─────────────────────┘
```

### Flow 2: סינון התראות לפי תאריך

```
┌─────────────────┐
│  Alerts Page    │
└────────┬────────┘
         │
         │ User clicks "Show" on FilterBar
         ▼
┌─────────────────────┐
│ FilterBar Expanded  │
│ Shows all filters   │
└────────┬────────────┘
         │
         │ User selects date range
         ▼
┌─────────────────────┐
│ DateRangePicker     │
│ - Presets           │
│ - Custom dates      │
└────────┬────────────┘
         │
         │ User clicks preset or Apply
         ▼
┌─────────────────────┐
│ Filtered Alerts     │
│ Shows only alerts   │
│ within date range   │
└─────────────────────┘
```

---

## ✅ רשימת משימות מפורטת

### Phase 1: מסך Alerts - הוספת סינון תאריך

- [ ] **1.1** עדכן state ב-`Alerts.jsx`
  - הוסף `dateRange` לאובייקט filters
  - עדכן `handleClearFilters`
  
- [ ] **1.2** הוסף לוגיקת סינון תאריך ב-`filteredAlerts`
  - בדיקת startDate
  - בדיקת endDate
  - Validation

- [ ] **1.3** עדכן `FilterBar.jsx`
  - ייבוא DateRangePicker
  - הוספת dateRange ל-getFilterConfig
  - תצוגה מותנית של DateRangePicker

- [ ] **1.4** בדיקות
  - בחירת preset
  - Custom range
  - שילוב עם סינונים אחרים
  - Clear filters

### Phase 2: דף פרטי מעבר חצייה - ניווט וחווית משתמש

- [ ] **2.1** הוסף ניווט ל-CrosswalkDetailsPage
  - onClick על CrosswalkCard
  - useNavigate hook
  - Smooth transition

- [ ] **2.2** שיפורים בדף פרטים (אם נדרש)
  - Empty states
  - Loading states
  - Error handling

- [ ] **2.3** בדיקות מקיפות
  - ניווט לדף פרטים
  - סינון לפי תאריך
  - Pagination
  - חזרה לרשימה

---

## 📝 הערות מימוש

### עקרונות מנחים

1. **DRY (Don't Repeat Yourself)**
   - שימוש חוזר ב-DateRangePicker באופן עקבי
   - לוגיקת סינון תאריכים תהיה זהה בכל מקום

2. **Performance**
   - סינון תאריכים יעשה בצד הלקוח
   - Debouncing לא נדרש (רק presets ו-Apply)

3. **UX**
   - Feedback מיידי על סינון
   - Clear error messages
   - Intuitive date selection

4. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Date format ברור

---

## 🧪 תרחישי בדיקה

### Alerts - Date Filter

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Select "Today" | Click preset | Shows only today's alerts |
| Select "Last 7 Days" | Click preset | Shows alerts from last week |
| Custom range | From: 1/1/26, To: 15/1/26 | Shows alerts in range |
| Invalid range | From > To | Validation error or disabled Apply |
| Clear filters | Click "Clear All" | Removes date filter |
| No results | Future date range | "No alerts found" message |

### CrosswalkDetailsPage

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Navigate from list | Click crosswalk card | Opens details page |
| Filter by date | Select "Last 7 Days" | Shows filtered events |
| Pagination | Click page 2 | Shows next 50 events |
| Back navigation | Click "Back" button | Returns to list |
| No events | New crosswalk | "No events found" message |

---

## 📐 הערכת זמן

### Phase 1: Alerts Date Filter
- עדכון state וקומפוננטים: **1-2 שעות**
- אינטגרציה של DateRangePicker: **1 שעה**
- בדיקות: **1 שעה**
- **סה"כ: 3-4 שעות**

### Phase 2: Crosswalk Details Navigation
- הוספת ניווט: **30 דקות**
- שיפורים בדף פרטים: **1 שעה**
- בדיקות מקיפות: **1 שעה**
- **סה"כ: 2.5 שעות**

### **זמן כולל משוער: 5-7 שעות עבודה**

---

## 🎯 קריטריונים להצלחה

✅ משתמש יכול לסנן התראות לפי תאריך במסך Alerts

✅ משתמש יכול לנווט לדף פרטי מעבר חצייה

✅ דף פרטים מציג היסטוריה מלאה של אירועים

✅ סינון לפי תאריך עובד בדף פרטי מעבר חצייה

✅ Presets עובדים כראוי ונוחים לשימוש

✅ Custom date range עובד עם validation

✅ Pagination עובד עם הסינונים

✅ Clear filters מנקה את כל הסינונים כולל תאריכים

✅ UX חלק וללא שגיאות

---

## 🔗 קבצים מושפעים

### קבצים לעדכון:
1. `frontend/src/pages/Alerts.jsx` - הוספת date filter
2. `frontend/src/components/alerts/FilterBar.jsx` - אינטגרציה של DateRangePicker
3. `frontend/src/pages/Crosswalks.jsx` - הוספת ניווט

### קבצים קיימים (ללא שינוי):
- `frontend/src/components/ui/DateRangePicker.jsx` ✅
- `frontend/src/components/alerts/AlertHistoryCard.jsx` ✅
- `frontend/src/pages/CrosswalkDetailsPage.jsx` ✅
- `frontend/src/hooks/useCrosswalkDetails.js` ✅
- `frontend/src/App.jsx` ✅ (routing כבר קיים)

---

## סיכום

מסמך זה מתאר **שלושה שינויים עיקריים:**

1. ✅ הוספת סינון לפי תאריך במסך Alerts
2. ✅ הוספת ניווט מרשימת מעברי חצייה לדף פרטים
3. ✅ שימוש בדף פרטים הקיים עם כל התכונות (כבר מומש)

**רוב הפונקציונליות כבר קיימת!** נדרש רק:
- אינטגרציה של DateRangePicker במסך Alerts
- הוספת onClick לניווט בדף Crosswalks

**מוכן ליישום!** 🚀
