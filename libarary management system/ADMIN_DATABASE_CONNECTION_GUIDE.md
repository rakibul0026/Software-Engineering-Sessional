# Admin Section Database Connection Guide

## Overview

Your admin section connects to Firebase Realtime Database through a dedicated service layer (`adminDatabaseService.js`). This document explains how to integrate and use the database connection in your admin components.

---

## 1. File Structure

```
react-frontend/src/
├── lib/
│   ├── firebaseClient.js          # Firebase initialization
│   ├── databaseService.js         # General database functions
│   ├── adminDatabaseService.js    # Admin-specific functions (NEW)
│   ├── authService.js             # Authentication
│   └── libraryBooksStore.js       # Book store
├── components/
│   └── AdminLayout.jsx            # Admin UI wrapper
└── pages/
    ├── AdminPage.jsx              # Admin dashboard
    ├── AdminStaffPage.jsx         # Staff management (NEW)
    ├── AdminAuditLogsPage.jsx     # Audit logs viewer (NEW)
    ├── AdminSettingsPage.jsx      # Settings (update to use new service)
    └── ... (other admin pages)
```

---

## 2. Setup Instructions

### Step 1: Import the Admin Service

In any admin component, import the functions you need:

```javascript
import {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  getAuditLogs,
  logAdminAction,
  getGeneralSettings,
  updateGeneralSettings,
  getAllRoles,
  generateReport,
  listenToAuditLogs
} from "../lib/adminDatabaseService";
```

### Step 2: Use in Your Component

```javascript
import { useEffect, useState } from "react";
import { getAllStaff, addStaff } from "../lib/adminDatabaseService";

export default function MyAdminComponent() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const staffData = await getAllStaff();
      setStaff(staffData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

---

## 3. Common Operations

### 3.1 Staff Management

#### Get All Staff
```javascript
const staff = await getAllStaff();
// Returns: [{ id, name, email, role, status, ... }, ...]
```

#### Get Specific Staff
```javascript
const staffMember = await getStaffById("staffId123");
// Returns: { id, name, email, role, ... }
```

#### Add New Staff
```javascript
const newStaff = await addStaff({
  name: "John Doe",
  email: "john@library.com",
  role: "admin",
  department: "Cataloging"
});
// Returns: Created staff object with id
```

#### Update Staff
```javascript
await updateStaff("staffId123", {
  role: "moderator",
  status: "active"
});
```

#### Delete Staff
```javascript
await deleteStaff("staffId123");
```

### 3.2 Audit Logging

#### Log Admin Action
```javascript
await logAdminAction({
  action: "add_book",
  performedBy: currentUserId,
  targetType: "book",
  targetId: bookId,
  changes: { title: "New Title", author: "New Author" },
  status: "success"
});
```

#### Get Audit Logs
```javascript
const logs = await getAuditLogs(50); // Get last 50 logs
// Returns: [{ id, action, performedBy, timestamp, ... }, ...]
```

#### Get Logs by User
```javascript
const userLogs = await getAuditLogsByUser("staffId123", 100);
```

### 3.3 Settings Management

#### Get General Settings
```javascript
const settings = await getGeneralSettings();
// Returns: { libraryName, email, phone, address, timezone }
```

#### Update Settings
```javascript
await updateGeneralSettings({
  libraryName: "City Central Library",
  email: "admin@library.com",
  phone: "+1-555-0123"
});
```

#### Get Borrowing Policies
```javascript
const policies = await getPolicies();
// Returns: { booksPerMember, borrowDurationDays, lateFeePerDay, ... }
```

#### Update Policies
```javascript
await updatePolicies({
  booksPerMember: 5,
  borrowDurationDays: 14,
  lateFeePerDay: 5
});
```

#### Get Features
```javascript
const features = await getFeatures();
// Returns: { rfidEnabled, qrEnabled, ebookEnabled, ... }
```

#### Toggle Feature
```javascript
await updateFeatures({
  rfidEnabled: true,
  maintenanceMode: false
});
```

### 3.4 Reports

#### Generate Report
```javascript
const report = await generateReport({
  title: "Monthly Circulation Report",
  type: "circulation",
  generatedBy: currentUserId,
  data: reportData,
  format: "pdf"
});
```

#### Get All Reports
```javascript
const reports = await getAllReports(50);
```

#### Get Report by ID
```javascript
const report = await getReportById("reportId123");
```

### 3.5 Permissions & Roles

#### Get All Roles
```javascript
const roles = await getAllRoles();
// Returns: { super_admin: {...}, admin: {...}, moderator: {...} }
```

#### Get Role Details
```javascript
const adminRole = await getRole("admin");
// Returns: { permissions: [...], level: 2 }
```

#### Get All Permissions
```javascript
const permissions = await getAllPermissions();
```

---

## 4. Real-Time Features

### Listen to Staff Changes
```javascript
const unsubscribe = listenToStaff((updatedStaff) => {
  setStaff(updatedStaff);
});

// Later, cleanup:
return () => unsubscribe();
```

### Listen to Audit Logs
```javascript
const unsubscribe = listenToAuditLogs((logs) => {
  setLogs(logs);
});

// Later, cleanup:
return () => unsubscribe();
```

### Listen to Settings
```javascript
const unsubscribe = listenToSettings((settings) => {
  setSettings(settings);
});
```

---

## 5. Error Handling

### Try-Catch Pattern
```javascript
try {
  const staff = await getAllStaff();
  setStaff(staff);
} catch (error) {
  if (error.message.includes("Firebase database not configured")) {
    console.error("Firebase configuration missing");
  } else {
    console.error("Database error:", error);
  }
  setError("Failed to load staff");
}
```

### Type of Errors
- **Configuration Error**: Firebase not initialized properly
- **Permission Error**: User doesn't have access rights
- **Network Error**: Connection to Firebase failed
- **Data Error**: Invalid data format

---

## 6. Firebase Security Rules

Ensure your Firebase Security Rules allow proper access:

```javascript
{
  "rules": {
    "admin": {
      ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
      
      "staff": {
        ".write": "root.child('users').child(auth.uid).child('role').val() === 'super_admin'"
      },
      
      "logs": {
        ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": false
      }
    }
  }
}
```

---

## 7. Complete Example: Admin Staff Manager

See `AdminStaffPage.jsx` for a complete working example that demonstrates:
- Fetching staff from database
- Adding new staff
- Updating staff details
- Deleting staff
- Logging all actions to audit trail
- Error handling
- Loading states

---

## 8. Best Practices

### 1. Always Check Firebase Configuration
```javascript
if (!firebaseDatabase) {
  throw new Error("Firebase database not configured");
}
```

### 2. Log Important Actions
```javascript
// Always log when admin makes changes
await logAdminAction({
  action: "update_book",
  performedBy: userId,
  targetType: "book",
  targetId: bookId,
  changes: changedFields,
  status: "success"
});
```

### 3. Use Real-Time Listeners for Live Updates
```javascript
useEffect(() => {
  const unsubscribe = listenToStaff((staff) => {
    setStaff(staff);
  });
  
  return () => unsubscribe(); // Cleanup
}, []);
```

### 4. Handle Errors Gracefully
```javascript
try {
  // Database operation
} catch (error) {
  setError(error.message);
  // Show error to user
}
```

### 5. Show Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  try {
    // Perform operation
  } finally {
    setLoading(false);
  }
};
```

### 6. Validate Data Before Saving
```javascript
if (!staffData.email || !staffData.name) {
  throw new Error("Email and name are required");
}
```

---

## 9. Database Schema Reference

The admin section uses this Firebase database structure:

```
admin/
├── staff/{staffId}
├── logs/audit/{logId}
├── logs/activity/{activityId}
├── settings/general
├── settings/policies
├── settings/features
├── settings/notifications
├── reports/{reportId}
├── reports/scheduled/{scheduleId}
├── backup/{backupId}
├── permissions/{permissionId}
└── permissions/roles/{roleName}
```

For detailed schema, see `FIREBASE_ADMIN_STRUCTURE.md`

---

## 10. Troubleshooting

### Issue: Firebase database not configured
**Solution**: Check `.env` file has all required Firebase environment variables
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Issue: Permission denied errors
**Solution**: Check Firebase Security Rules. Ensure user is admin and has proper role.

### Issue: Data not updating in real-time
**Solution**: Ensure real-time listener is active and not unsubscribed.

### Issue: Logs not saving
**Solution**: Check Firebase write permissions and ensure `performedBy` is valid user ID.

---

## 11. Next Steps

1. Update `AdminSettingsPage.jsx` to use the new service functions
2. Add admin dashboard with statistics
3. Implement report generation
4. Create backup management interface
5. Add system maintenance scheduling
