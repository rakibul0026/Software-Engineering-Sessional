# Admin Authentication Setup Guide

## Overview

This guide explains how to set up and use admin authentication with Firebase for your library management system.

**Admin Credentials:**
- **Email**: admin@123
- **Password**: Cstu@123

---

## Files Created

1. **adminAuthService.js** - Authentication service functions
2. **AdminLoginPage.jsx** - Admin login UI component
3. **admin-login.css** - Login page styling
4. **setup-admin.js** - Script to initialize admin account

---

## Setup Instructions

### Step 1: Verify Firebase Configuration

Make sure your `.env` file has all required Firebase variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 2: Run Admin Setup Script

Run this command ONCE to create the admin account:

```bash
cd react-frontend
npm install dotenv  # If not already installed
node scripts/setup-admin.js
```

**Expected Output:**
```
🚀 Starting Admin Setup...
✅ Firebase configuration loaded
✅ Firebase initialized
✅ Admin user created in Authentication
✅ Admin record created in database
✅ Settings initialized
✅ Admin Setup Completed Successfully!

📋 Admin Account Details:
   Email:    admin@123
   Password: Cstu@123
   Role:     Super Admin
```

### Step 3: Add Admin Login Route

Update your routes file to include the admin login page:

```javascript
// routes.generated.jsx or your routing file
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";

export const routes = [
  {
    path: "/admin/login",
    component: AdminLoginPage,
    title: "Admin Login"
  },
  {
    path: "/admin",
    component: AdminPage,
    title: "Admin Dashboard"
  }
  // ... other routes
];
```

### Step 4: Start Your App

```bash
npm run dev
```

---

## Using Admin Authentication

### Login Flow

#### 1. Admin Login (AdminLoginPage.jsx)

```javascript
import { adminLogin } from "../lib/adminAuthService";

const handleLogin = async (email, password) => {
  try {
    const admin = await adminLogin(email, password);
    // Admin logged in successfully
    // admin = { uid, email, name, role, permissions, ... }
    localStorage.setItem("adminUser", JSON.stringify(admin));
    navigate("/admin");
  } catch (error) {
    // Show error message
  }
};
```

#### 2. Verify Admin on Protected Routes

```javascript
import { useEffect, useState } from "react";
import { getCurrentAdmin } from "../lib/adminAuthService";

export default function ProtectedAdminPage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("adminUid");
    if (!uid) {
      navigate("/admin/login");
      return;
    }

    getCurrentAdmin(uid)
      .then(setAdmin)
      .catch(() => navigate("/admin/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!admin) return <div>Unauthorized</div>;

  return <div>Welcome, {admin.name}!</div>;
}
```

#### 3. Admin Logout

```javascript
import { adminLogout } from "../lib/adminAuthService";

const handleLogout = async () => {
  try {
    await adminLogout();
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminUid");
    navigate("/admin/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
```

---

## API Reference

### adminAuthService.js Functions

#### `createAdminUser(email, password)`
Create new admin user (use only during setup)

```javascript
const user = await createAdminUser("admin@123", "Cstu@123");
```

#### `adminLogin(email, password)`
Login admin user

```javascript
const admin = await adminLogin("admin@123", "Cstu@123");
// Returns: { uid, email, name, role, permissions, status, ... }
```

#### `adminLogout()`
Logout current admin user

```javascript
await adminLogout();
```

#### `getCurrentAdmin(uid)`
Get admin details by UID

```javascript
const admin = await getCurrentAdmin("admin_uid");
```

#### `isUserAdmin(uid)`
Check if user is admin

```javascript
const isAdmin = await isUserAdmin(uid);
```

#### `getAdminRole(uid)`
Get admin role

```javascript
const role = await getAdminRole(uid);
// Returns: "super_admin", "admin", or "moderator"
```

#### `hasAdminPermission(uid, permission)`
Check if admin has specific permission

```javascript
const canManageStaff = await hasAdminPermission(uid, "manage_staff");
```

#### `verifyAdminCredentials(email, password)`
Verify credentials without logging in

```javascript
const isValid = await verifyAdminCredentials("admin@123", "Cstu@123");
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────┐
│          Admin Login Page                        │
│  Email: admin@123                              │
│  Password: Cstu@123                            │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│    Firebase Authentication                      │
│  (Verify email & password)                     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│    Firebase Database                            │
│  (Get admin record from admin/staff/{uid})    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│   Update Last Login                             │
│  (admin/staff/{uid}/lastLogin = now)          │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│   Return Admin Object                           │
│  { uid, email, name, role, permissions... }  │
└─────────────────────────────────────────────────┘
```

---

## Database Structure After Setup

```
Firebase Database
└── admin/
    ├── staff/
    │   └── {uid}
    │       ├── id: uid
    │       ├── email: "admin@123"
    │       ├── name: "System Administrator"
    │       ├── role: "super_admin"
    │       ├── permissions: ["all"]
    │       ├── status: "active"
    │       ├── createdAt: timestamp
    │       ├── lastLogin: timestamp
    │       └── department: "Administration"
    │
    ├── settings/
    │   ├── general/
    │   │   ├── libraryName: "Library Management System"
    │   │   ├── libraryEmail: "admin@123"
    │   │   ├── phone: "+1-000-0000"
    │   │   ├── address: "Library Address"
    │   │   └── timezone: "UTC"
    │   │
    │   ├── policies/
    │   │   ├── booksPerMember: 5
    │   │   ├── borrowDurationDays: 14
    │   │   ├── lateFeePerDay: 5
    │   │   └── ...
    │   │
    │   └── features/
    │       ├── rfidEnabled: false
    │       ├── qrEnabled: true
    │       └── ...
    │
    └── permissions/
        └── roles/
            ├── super_admin/
            │   ├── permissions: ["all"]
            │   └── level: 3
            ├── admin/
            │   ├── permissions: [...]
            │   └── level: 2
            └── moderator/
                ├── permissions: [...]
                └── level: 1
```

---

## Security Best Practices

### 1. Store Credentials Securely

```javascript
// ❌ DON'T do this
const admin = JSON.parse(localStorage.getItem("adminUser"));
console.log(admin.password); // Never store passwords!

// ✅ DO this
const admin = JSON.parse(localStorage.getItem("adminUser"));
// Only store non-sensitive data like uid, email, role, name
```

### 2. Protect Admin Routes

```javascript
// Create a ProtectedRoute component
function ProtectedRoute({ component: Component }) {
  return localStorage.getItem("adminUid") ? (
    <Component />
  ) : (
    <Navigate to="/admin/login" />
  );
}

// Use in routes
<Route path="/admin" element={<ProtectedRoute component={AdminPage} />} />
```

### 3. Check Permissions

```javascript
// Always verify permissions before showing admin features
if (await hasAdminPermission(uid, "manage_staff")) {
  // Show staff management UI
}
```

### 4. Firebase Security Rules

Ensure your Firebase Security Rules restrict access:

```javascript
{
  "rules": {
    "admin": {
      ".read": "root.child('admin').child('staff').child(auth.uid).exists()",
      ".write": "root.child('admin').child('staff').child(auth.uid).child('role').val() === 'super_admin'",
      
      "staff": {
        ".write": "root.child('admin').child('staff').child(auth.uid).child('role').val() === 'super_admin'"
      },
      
      "logs": {
        ".read": "root.child('admin').child('staff').child(auth.uid).exists()",
        ".write": false
      }
    }
  }
}
```

---

## Troubleshooting

### Problem: "Admin account already exists"

**Solution**: The account was already created. Either:
1. Use the existing credentials (admin@123 / Cstu@123)
2. Delete the user from Firebase Console and run setup again

### Problem: "Firebase configuration incomplete"

**Solution**: Check your `.env` file has all required variables. Rebuild if needed.

### Problem: "User is not an admin"

**Solution**: Make sure the user record exists in `admin/staff/{uid}`. Run the setup script again.

### Problem: Login page not appearing

**Solution**: Verify the route is added to your router configuration.

### Problem: Can't log in with the credentials

**Solution**:
1. Check Firebase is properly configured
2. Verify .env variables are correct
3. Check user wasn't deleted from Firebase Console
4. Run setup script again if needed

---

## Default Setup Values

After running the setup script, these are created:

| Setting | Value |
|---------|-------|
| Admin Email | admin@123 |
| Admin Password | Cstu@123 |
| Admin Role | super_admin |
| Library Name | Library Management System |
| Books Per Member | 5 |
| Borrow Duration | 14 days |
| Late Fee | $5/day |
| QR Enabled | true |
| RFID Enabled | false |
| E-books Enabled | true |
| Question Bank | false |
| Maintenance Mode | false |

---

## Next Steps

1. ✅ Run setup-admin.js script
2. ✅ Add admin routes to your app
3. ✅ Test login with admin@123 / Cstu@123
4. ✅ Create protected admin pages
5. ✅ Add permission checks
6. ✅ Update Firebase Security Rules

---

## Additional Resources

- [adminAuthService.js](../src/lib/adminAuthService.js) - Authentication functions
- [AdminLoginPage.jsx](../src/pages/AdminLoginPage.jsx) - Login UI
- [adminDatabaseService.js](../src/lib/adminDatabaseService.js) - Database operations
- [ADMIN_DATABASE_QUICKSTART.md](./ADMIN_DATABASE_QUICKSTART.md) - Quick start guide
