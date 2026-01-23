# מסמך דרישות - ספרינט ניהול מעברי חצייה והתראות

## תאריך: 23 ינואר 2026

---

## 📋 סקירה כללית

פיתוח פונקציונליות CRUD מלאה (Create, Read, Update, Delete) למעברי חצייה והתראות, כולל ניהול שיוך של מצלמות ותאורת LED למעברי חצייה.

---

## 🎯 מטרות הספרינט

1. השלמת endpoints חסרים ב-Backend
2. פיתוח ממשק משתמש לניהול ישויות
3. יכולת שיוך/ביטול שיוך של מצלמות ו-LEDs למעברי חצייה
4. אינטגרציה מלאה בין Frontend ל-Backend

---

## 🔧 חלק 1: Backend - REST API Endpoints

### 1.1 Alerts (התראות)

#### **Endpoints קיימים שצריכים שיפור:**
- ✅ `GET /api/alerts` - קיים
- ✅ `GET /api/alerts/:id` - קיים
- ✅ `POST /api/alerts` - קיים
- ✅ `GET /api/alerts/stats` - קיים

#### **Endpoints חסרים שצריך ליצור:**

##### `PATCH /api/alerts/:id` - עדכון התראה
**תיאור:** עדכון פרטי התראה קיימת
**Request Body:**
```json
{
  "dangerLevel": "HIGH",
  "detectionPhoto": {
    "url": "https://example.com/new-photo.jpg"
  }
}
```
**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "crosswalkId": "...",
    "dangerLevel": "HIGH",
    "timestamp": "2026-01-23T10:00:00Z",
    "detectionPhoto": {
      "url": "https://example.com/new-photo.jpg"
    }
  }
}
```

##### `DELETE /api/alerts/:id` - מחיקת התראה
**תיאור:** מחיקת התראה
**Response:** 200 OK
```json
{
  "success": true,
  "message": "Alert deleted successfully"
}
```

---

### 1.2 Crosswalks (מעברי חצייה)

#### **Endpoints קיימים:**
- ✅ `GET /api/crosswalks` - קיים
- ✅ `GET /api/crosswalks/:id` - קיים
- ✅ `POST /api/crosswalks` - קיים
- ✅ `PATCH /api/crosswalks/:id` - קיים
- ✅ `DELETE /api/crosswalks/:id` - קיים
- ✅ `GET /api/crosswalks/stats` - קיים

#### **Endpoints חדשים לשיוך מצלמות ו-LEDs:**

##### `PATCH /api/crosswalks/:id/camera` - שיוך/עדכון מצלמה
**תיאור:** שיוך או עדכון מצלמה קיימת למעבר חצייה
**Request Body:**
```json
{
  "cameraId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```
**Response:** 200 OK
```json
{
  "success": true,
  "message": "Camera linked successfully",
  "data": {
    "_id": "...",
    "location": {...},
    "cameraId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "ledId": "..."
  }
}
```

##### `DELETE /api/crosswalks/:id/camera` - ביטול שיוך מצלמה
**תיאור:** ביטול שיוך מצלמה ממעבר חצייה
**Response:** 200 OK
```json
{
  "success": true,
  "message": "Camera unlinked successfully",
  "data": {
    "_id": "...",
    "location": {...},
    "cameraId": null,
    "ledId": "..."
  }
}
```

##### `PATCH /api/crosswalks/:id/led` - שיוך/עדכון LED
**תיאור:** שיוך או עדכון LED קיים למעבר חצייה
**Request Body:**
```json
{
  "ledId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```
**Response:** 200 OK
```json
{
  "success": true,
  "message": "LED linked successfully",
  "data": {
    "_id": "...",
    "location": {...},
    "cameraId": "...",
    "ledId": "65a1b2c3d4e5f6g7h8i9j0k1"
  }
}
```

##### `DELETE /api/crosswalks/:id/led` - ביטול שיוך LED
**תיאור:** ביטול שיוך LED ממעבר חצייה
**Response:** 200 OK
```json
{
  "success": true,
  "message": "LED unlinked successfully",
  "data": {
    "_id": "...",
    "location": {...},
    "cameraId": "...",
    "ledId": null
  }
}
```

---

### 1.3 Cameras (מצלמות)

#### **Endpoints קיימים:**
- ✅ `GET /api/cameras` - קיים
- ✅ `GET /api/cameras/:id` - קיים
- ✅ `POST /api/cameras` - קיים
- ✅ `PATCH /api/cameras/:id/status` - קיים
- ✅ `DELETE /api/cameras/:id` - קיים

#### **Endpoint חסר:**

##### `PATCH /api/cameras/:id` - עדכון כללי של מצלמה
**תיאור:** עדכון פרטי מצלמה (לא רק סטטוס)
**Request Body:**
```json
{
  "status": "active"
}
```
**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "active",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 1.4 LEDs (תאורת LED)

#### **Endpoints קיימים:**
- ✅ `GET /api/leds` - קיים
- ✅ `GET /api/leds/:id` - קיים
- ✅ `POST /api/leds` - קיים
- ✅ `DELETE /api/leds/:id` - קיים

#### **אין צורך בעדכון נוסף** (LED לא מכיל שדות נוספים לעדכון)

---

## 🎨 חלק 2: Frontend - ממשק משתמש

### 2.1 דף ניהול התראות (Alerts Page)

#### **כפתורים נדרשים:**

1. **כפתור הוספת התראה ידנית** (למעלה מהרשימה)
   - פותח דיאלוג/מודל להוספת התראה חדשה
   - שדות: בחירת מעבר חצייה, רמת סכנה, URL תמונה
   - פעולה: `POST /api/alerts`

2. **כפתור עריכה** (בכל כרטיס התראה)
   - פותח דיאלוג/מודל לעריכת ההתראה
   - שדות: רמת סכנה, URL תמונה
   - פעולה: `PATCH /api/alerts/:id`

3. **כפתור מחיקה** (בכל כרטיס התראה)
   - מציג אישור למחיקה
   - פעולה: `DELETE /api/alerts/:id`

---

### 2.2 דף ניהול מעברי חצייה (Crosswalks Page)

#### **כפתורים נדרשים:**

1. **כפתור הוספת מעבר חצייה** (למעלה מהרשימה)
   - פותח דיאלוג/מודל להוספת מעבר חצייה חדש
   - שדות: עיר, רחוב, מספר בית, בחירת מצלמה, בחירת LED
   - פעולה: `POST /api/crosswalks`

2. **כפתור עריכה** (בכל כרטיס מעבר חצייה)
   - פותח דיאלוג/מודל מתקדם לעריכה
   - **חלק 1 - פרטי מיקום:**
     - עיר, רחוב, מספר
     - פעולה: `PATCH /api/crosswalks/:id`
   
   - **חלק 2 - ניהול מצלמה:**
     - רשימה נפתחת של מצלמות זמינות
     - כפתור "שייך מצלמה" - פעולה: `PATCH /api/crosswalks/:id/camera`
     - כפתור "בטל שיוך מצלמה" - פעולה: `DELETE /api/crosswalks/:id/camera`
   
   - **חלק 3 - ניהול LED:**
     - רשימה נפתחת של LEDs זמינים
     - כפתור "שייך LED" - פעולה: `PATCH /api/crosswalks/:id/led`
     - כפתור "בטל שיוך LED" - פעולה: `DELETE /api/crosswalks/:id/led`

3. **כפתור מחיקה** (בכל כרטיס מעבר חצייה)
   - מציג אישור למחיקה
   - אזהרה: "האם למחוק גם את ההתראות הקשורות?"
   - פעולה: `DELETE /api/crosswalks/:id`

4. **כפתור הוספת מצלמה חדשה** (בתוך דיאלוג העריכה)
   - פותח דיאלוג משני ליצירת מצלמה
   - פעולה: `POST /api/cameras`
   - לאחר יצירה - מתעדכן ברשימת המצלמות הזמינות

5. **כפתור הוספת LED חדש** (בתוך דיאלוג העריכה)
   - פותח דיאלוג משני ליצירת LED
   - פעולה: `POST /api/leds`
   - לאחר יצירה - מתעדכן ברשימת ה-LEDs הזמינים

---

### 2.3 דף ניהול מצלמות (Cameras - אופציונלי)

#### **כפתורים נדרשים:**

1. **כפתור הוספת מצלמה**
   - פותח דיאלוג
   - שדות: סטטוס (active/inactive/error)
   - פעולה: `POST /api/cameras`

2. **כפתור עריכה**
   - עדכון סטטוס
   - פעולה: `PATCH /api/cameras/:id`

3. **כפתור מחיקה**
   - מציג אישור
   - אזהרה: "מצלמה זו משוייכת למעבר חצייה"
   - פעולה: `DELETE /api/cameras/:id`

---

### 2.4 דף ניהול LEDs (אופציונלי)

#### **כפתורים נדרשים:**

1. **כפתור הוספת LED**
   - פותח דיאלוג
   - ללא שדות (LED ריק)
   - פעולה: `POST /api/leds`

2. **כפתור מחיקה**
   - מציג אישור
   - אזהרה: "LED זה משוייך למעבר חצייה"
   - פעולה: `DELETE /api/leds`

---

## 🔗 חלק 3: אינטגרציה ולוגיקה עסקית

### 3.1 וולידציות Backend

1. **בעת מחיקת מצלמה:**
   - בדוק אם המצלמה משוייכת למעבר חצייה
   - אם כן - החזר שגיאה 400: "Cannot delete camera linked to crosswalk"

2. **בעת מחיקת LED:**
   - בדוק אם ה-LED משוייך למעבר חצייה
   - אם כן - החזר שגיאה 400: "Cannot delete LED linked to crosswalk"

3. **בעת שיוך מצלמה/LED:**
   - וודא שהמצלמה/LED קיימים במערכת
   - אם לא - החזר שגיאה 404

4. **בעת יצירת מעבר חצייה:**
   - וודא ש-cameraId ו-ledId קיימים במערכת
   - אם לא - החזר שגיאה 404: "Camera/LED not found"

### 3.2 עדכונים אוטומטיים Frontend

1. לאחר כל פעולה מוצלחת - רענן את הנתונים מהשרת
2. הצג הודעות הצלחה/שגיאה למשתמש (toast notifications)
3. סגור דיאלוגים אוטומטית לאחר פעולה מוצלחת

### 3.3 UX/UI דרישות

1. **טעינה (Loading States):**
   - הצג ספינר בעת שליחת בקשות
   - השבת כפתורים בזמן טעינה

2. **אישורי מחיקה:**
   - דיאלוג אישור לפני מחיקה
   - הדגשת טקסט אזהרה באדום

3. **תצוגת שגיאות:**
   - הצג שגיאות בצורה ברורה
   - הצע פתרונות כשאפשר

4. **נגישות:**
   - תמיכה במקלדת
   - ARIA labels לכפתורים

---

## 📊 חלק 4: מבנה הנתונים

### 4.1 מודל Crosswalk (קיים)
```javascript
{
  _id: ObjectId,
  location: {
    city: String,
    street: String,
    number: String
  },
  cameraId: ObjectId (ref: Camera), // nullable לאחר ביטול שיוך
  ledId: ObjectId (ref: LED),       // nullable לאחר ביטול שיוך
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 מודל Alert (קיים)
```javascript
{
  _id: ObjectId,
  crosswalkId: ObjectId (ref: Crosswalk),
  timestamp: Date,
  dangerLevel: String (enum: LOW/MEDIUM/HIGH),
  detectionPhoto: {
    url: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 מודל Camera (קיים)
```javascript
{
  _id: ObjectId,
  status: String (enum: active/inactive/error),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 מודל LED (קיים)
```javascript
{
  _id: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ רשימת משימות מפורטת (Task List)

### Backend Tasks

#### Alerts
- [ ] יצירת route `PATCH /api/alerts/:id`
- [ ] יצירת route `DELETE /api/alerts/:id`
- [ ] הוספת מתודות `update()` ו-`delete()` ב-alertService.js
- [ ] בדיקות API ב-Postman/Thunder Client

#### Crosswalks - שיוך מצלמות ו-LEDs
- [ ] יצירת route `PATCH /api/crosswalks/:id/camera`
- [ ] יצירת route `DELETE /api/crosswalks/:id/camera`
- [ ] יצירת route `PATCH /api/crosswalks/:id/led`
- [ ] יצירת route `DELETE /api/crosswalks/:id/led`
- [ ] הוספת מתודות בשירות:
  - [ ] `linkCamera(crosswalkId, cameraId)`
  - [ ] `unlinkCamera(crosswalkId)`
  - [ ] `linkLED(crosswalkId, ledId)`
  - [ ] `unlinkLED(crosswalkId)`
- [ ] וולידציה: בדיקת קיום מצלמה/LED לפני שיוך
- [ ] וולידציה: מניעת מחיקת מצלמה/LED משוייכים
- [ ] עדכון מודל Crosswalk - הפיכת cameraId ו-ledId ל-nullable
- [ ] בדיקות API

#### Cameras
- [ ] יצירת route `PATCH /api/cameras/:id` (עדכון כללי)
- [ ] הוספת מתודה `update()` ב-cameraService.js
- [ ] וולידציה: מניעת מחיקת מצלמה משוייכת
- [ ] בדיקות API

#### LEDs
- [ ] וולידציה: מניעת מחיקת LED משוייך
- [ ] בדיקות API

---

### Frontend Tasks

#### Components משותפים
- [ ] יצירת קומפוננט `Dialog` לדיאלוגים
- [ ] יצירת קומפוננט `ConfirmDialog` לאישורי מחיקה
- [ ] יצירת קומפוננט `Select` לרשימות נפתחות
- [ ] יצירת קומפוננט `Toast` להודעות

#### Alerts Page
- [ ] כפתור הוספת התראה + דיאלוג
- [ ] כפתור עריכת התראה + דיאלוג
- [ ] כפתור מחיקת התראה + אישור
- [ ] אינטגרציה עם API חדש
- [ ] עדכון hooks `useAlerts` עם פונקציות:
  - [ ] `updateAlert(id, data)`
  - [ ] `deleteAlert(id)`

#### Crosswalks Page
- [ ] כפתור הוספת מעבר חצייה + דיאלוג
- [ ] דיאלוג עריכה מורחב:
  - [ ] טאב/סקשן פרטי מיקום
  - [ ] טאב/סקשן ניהול מצלמה
  - [ ] טאב/סקשן ניהול LED
- [ ] רשימה נפתחת של מצלמות זמינות
- [ ] רשימה נפתחת של LEDs זמינים
- [ ] כפתור "שייך מצלמה"
- [ ] כפתור "בטל שיוך מצלמה"
- [ ] כפתור "שייך LED"
- [ ] כפתור "בטל שיוך LED"
- [ ] כפתור "הוסף מצלמה חדשה" (בדיאלוג)
- [ ] כפתור "הוסף LED חדש" (בדיאלוג)
- [ ] כפתור מחיקת מעבר חצייה + אישור
- [ ] עדכון hooks `useCrosswalks` עם פונקציות:
  - [ ] `linkCamera(crosswalkId, cameraId)`
  - [ ] `unlinkCamera(crosswalkId)`
  - [ ] `linkLED(crosswalkId, ledId)`
  - [ ] `unlinkLED(crosswalkId)`

#### API Integration
- [ ] עדכון `src/api/alerts.js` עם:
  - [ ] `updateAlert(id, data)`
  - [ ] `deleteAlert(id)`
- [ ] עדכון `src/api/crosswalks.js` עם:
  - [ ] `linkCamera(crosswalkId, cameraId)`
  - [ ] `unlinkCamera(crosswalkId)`
  - [ ] `linkLED(crosswalkId, ledId)`
  - [ ] `unlinkLED(crosswalkId)`
- [ ] עדכון `src/api/cameras.js` עם:
  - [ ] `updateCamera(id, data)`

#### UI/UX
- [ ] טיפול בשגיאות - הצגת הודעות ברורות
- [ ] Loading states - ספינרים וכפתורים מושבתים
- [ ] Toast notifications להצלחה/שגיאה
- [ ] Responsive design לדיאלוגים

---

## 🧪 חלק 5: בדיקות (Testing)

### Backend Testing
1. בדיקת כל endpoint עם Postman/Thunder Client
2. בדיקת תרחישי שגיאה (404, 400, 500)
3. בדיקת וולידציות
4. בדיקת שיוך/ביטול שיוך

### Frontend Testing
1. בדיקת כל כפתור וזרימה
2. בדיקת טיפול בשגיאות
3. בדיקת loading states
4. בדיקת responsive design
5. בדיקת נגישות (keyboard navigation)

---

## 📅 סדר עדיפויות מומלץ

### שלב 1 - Backend Foundation (2-3 ימים)
1. Alerts - הוספה ועריכה ומחיקה
2. Crosswalks - endpoints לשיוך/ביטול שיוך
3. וולידציות

### שלב 2 - Frontend Core (2-3 ימים)
1. קומפוננטים משותפים (Dialog, ConfirmDialog, Toast)
2. Alerts Page - כפתורים ודיאלוגים
3. API Integration

### שלב 3 - Advanced Features (3-4 ימים)
1. Crosswalks Page - דיאלוג עריכה מורחב
2. ניהול שיוכים (מצלמות ו-LEDs)
3. הוספת מצלמה/LED מתוך הדיאלוג

### שלב 4 - Polish & Testing (1-2 ימים)
1. UI/UX שיפורים
2. בדיקות מקיפות
3. תיקון באגים

---

## 🎨 דוגמת UI - דיאלוג עריכת מעבר חצייה

```
┌─────────────────────────────────────────────┐
│ ✏️ עריכת מעבר חצייה                        │
├─────────────────────────────────────────────┤
│                                             │
│ 📍 פרטי מיקום                              │
│ ┌─────────────────────────────────────┐    │
│ │ עיר: [תל אביב        ]             │    │
│ │ רחוב: [דיזנגוף      ]             │    │
│ │ מספר: [50           ]             │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ 📷 ניהול מצלמה                             │
│ ┌─────────────────────────────────────┐    │
│ │ מצלמה נוכחית: Camera #123         │    │
│ │ בחר מצלמה: [▼ רשימת מצלמות]      │    │
│ │ [שייך מצלמה] [בטל שיוך]           │    │
│ │ [+ הוסף מצלמה חדשה]               │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ 💡 ניהול LED                               │
│ ┌─────────────────────────────────────┐    │
│ │ LED נוכחי: LED #456               │    │
│ │ בחר LED: [▼ רשימת LEDs]           │    │
│ │ [שייך LED] [בטל שיוך]             │    │
│ │ [+ הוסף LED חדש]                  │    │
│ └─────────────────────────────────────┘    │
│                                             │
│              [ביטול] [שמור שינויים]        │
└─────────────────────────────────────────────┘
```

---

## 📝 הערות חשובות

1. **שדות חובה:** שמור על הגדרת `required` הנוכחית במודלים
2. **Cascading Delete:** שקול האם למחוק התראות בעת מחיקת מעבר חצייה
3. **הרשאות:** בעתיד יש להוסיף authentication & authorization
4. **לוגים:** הוסף logging לכל הפעולות החשובות
5. **Performance:** בעת רשימות ארוכות, הוסף pagination

---

## ✨ הצלחה!

מסמך זה מכיל את כל הדרישות הנדרשות ליישום מלא של הפיצ'רים. בהצלחה בספרינט! 🚀
