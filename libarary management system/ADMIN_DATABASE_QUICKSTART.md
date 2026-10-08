# Admin Database - Quick Start (5 Minutes)

## What You Just Got

✅ **adminDatabaseService.js** - Complete database service layer  
✅ **AdminStaffPage.jsx** - Example: Staff management with full CRUD  
✅ **AdminAuditLogsPage.jsx** - Example: Real-time audit log viewer  
✅ **FIREBASE_ADMIN_STRUCTURE.md** - Complete database schema  
✅ **ADMIN_DATABASE_CONNECTION_GUIDE.md** - Detailed guide  
✅ **ADMIN_DATABASE_API_REFERENCE.md** - API documentation  

---

## 1. Basic Setup (2 minutes)

### Import the service
```javascript
import { getAllStaff, addStaff } from "../lib/adminDatabaseService";
```

### Fetch data
```javascript
useEffect(() => {
  getAllStaff().then(staff => {
    setStaff(staff);
  }).catch(err => {
    console.error("Error:", err);
  });
}, []);
```

### Or use async/await
```javascript
const loadStaff = async () => {
  try {
    const data = await getAllStaff();
    setStaff(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 2. Common Tasks

### Add Staff Member
```javascript
const newStaff = await addStaff({
  name: "Jane Smith",
  email: "jane@library.com",
  role: "admin"
});
```

### Log Admin Action
```javascript
await logAdminAction({
  action: "add_staff",
  performedBy: userId,
  targetType: "staff",
  targetId: staffId,
  changes: staffData,
  status: "success"
});
```

### Get Settings
```javascript
const settings = await getGeneralSettings();
console.log(settings.libraryName);
```

### Update Settings
```javascript
await updateGeneralSettings({
  libraryName: "New Library Name"
});
```

### Listen to Real-Time Updates
```javascript
useEffect(() => {
  const unsubscribe = listenToStaff((staff) => {
    setStaff(staff);
  });
  
  return () => unsubscribe();
}, []);
```

---

## 3. Available Functions (Cheat Sheet)

| Category | Function | Purpose |
|----------|----------|---------|
| **Staff** | `getAllStaff()` | Get all staff |
| | `addStaff()` | Add new staff |
| | `updateStaff()` | Update staff |
| | `deleteStaff()` | Remove staff |
| **Logs** | `logAdminAction()` | Record action |
| | `getAuditLogs()` | Get all logs |
| | `getAuditLogsByUser()` | Get user's logs |
| **Settings** | `getGeneralSettings()` | Get library info |
| | `updateGeneralSettings()` | Update info |
| | `getPolicies()` | Get policies |
| | `updatePolicies()` | Update policies |
| | `getFeatures()` | Get toggles |
| | `updateFeatures()` | Toggle features |
| **Reports** | `generateReport()` | Create report |
| | `getAllReports()` | Get reports |
| | `getReportById()` | Get one report |
| **Real-Time** | `listenToStaff()` | Watch staff |
| | `listenToAuditLogs()` | Watch logs |
| | `listenToSettings()` | Watch settings |

---

## 4. Error Handling Template

```javascript
try {
  const staff = await getAllStaff();
  setStaff(staff);
} catch (error) {
  if (error.message.includes("Firebase database not configured")) {
    console.error("Missing Firebase config");
  } else {
    console.error("Database error:", error);
  }
  setError("Failed to load staff");
}
```

---

## 5. Complete Example Component

```javascript
import { useEffect, useState } from "react";
import { getAllStaff, addStaff, updateStaff, deleteStaff, logAdminAction } from "../lib/adminDatabaseService";

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await getAllStaff();
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add staff
  const handleAdd = async (name, email) => {
    try {
      const newStaff = await addStaff({ name, email, role: "moderator" });
      setStaff([...staff, newStaff]);
      
      // Log the action
      await logAdminAction({
        action: "add_staff",
        performedBy: "admin1",
        targetType: "staff",
        targetId: newStaff.id,
        changes: newStaff,
        status: "success"
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete staff
  const handleDelete = async (staffId) => {
    try {
      await deleteStaff(staffId);
      setStaff(staff.filter(s => s.id !== staffId));
      
      // Log the action
      await logAdminAction({
        action: "delete_staff",
        performedBy: "admin1",
        targetType: "staff",
        targetId: staffId,
        changes: { deleted: true },
        status: "success"
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Staff Management</h1>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      <div>
        {staff.map(s => (
          <div key={s.id}>
            <span>{s.name} ({s.email})</span>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. Check Your Setup

### Verify Firebase Connection
```javascript
import { firebaseDatabase, hasFirebaseConfig } from "../lib/firebaseClient";

console.log("Firebase configured:", hasFirebaseConfig);
console.log("Database instance:", firebaseDatabase ? "Ready" : "Not ready");
```

### Test a Simple Call
```javascript
import { getAllStaff } from "../lib/adminDatabaseService";

// In console:
getAllStaff().then(console.log).catch(console.error);
```

---

## 7. Next Steps

1. ✅ Create admin pages in your navigation
2. ✅ Add staff management page
3. ✅ Add audit logs viewer
4. ✅ Update settings page with new service
5. ✅ Add real-time listeners
6. ✅ Create dashboard with statistics

---

## 8. File Locations

```
Backend functions: react-frontend/src/lib/adminDatabaseService.js
Example components:
  - react-frontend/src/pages/AdminStaffPage.jsx
  - react-frontend/src/pages/AdminAuditLogsPage.jsx
Documentation:
  - FIREBASE_ADMIN_STRUCTURE.md (schema)
  - ADMIN_DATABASE_CONNECTION_GUIDE.md (detailed guide)
  - ADMIN_DATABASE_API_REFERENCE.md (API docs)
  - ADMIN_DATABASE_QUICKSTART.md (this file)
```

---

## 9. Troubleshooting

**Q: Firebase database not configured**  
A: Check `.env` has all Firebase variables

**Q: Permission denied**  
A: Ensure user is admin in Firebase database

**Q: Data not updating**  
A: Make sure real-time listener is active

**Q: Functions not importing**  
A: Check path is `../lib/adminDatabaseService`

---

## 10. Need Help?

📖 **Detailed Guide**: See `ADMIN_DATABASE_CONNECTION_GUIDE.md`  
📚 **API Reference**: See `ADMIN_DATABASE_API_REFERENCE.md`  
🗂️ **Schema**: See `FIREBASE_ADMIN_STRUCTURE.md`  
💻 **Working Examples**: Check `AdminStaffPage.jsx` and `AdminAuditLogsPage.jsx`
