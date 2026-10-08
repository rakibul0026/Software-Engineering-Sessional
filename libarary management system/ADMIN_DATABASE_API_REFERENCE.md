# Admin Database Service API Reference

## Quick Import

```javascript
import {
  // Staff
  getAllStaff,
  getStaffById,
  addStaff,
  updateStaff,
  deleteStaff,
  
  // Audit Logs
  logAdminAction,
  getAuditLogs,
  getAuditLogsByUser,
  
  // Settings
  getGeneralSettings,
  updateGeneralSettings,
  getPolicies,
  updatePolicies,
  getFeatures,
  updateFeatures,
  
  // Permissions
  getAllRoles,
  getRole,
  getAllPermissions,
  
  // Reports
  generateReport,
  getAllReports,
  getReportById,
  
  // Real-Time Listeners
  listenToStaff,
  listenToAuditLogs,
  listenToSettings
} from "../lib/adminDatabaseService";
```

---

## Staff Functions

### `getAllStaff()`
Get all admin staff members

**Returns:** `Promise<Staff[]>`
```javascript
const staff = await getAllStaff();
// [{ id, name, email, role, status, createdAt, ... }, ...]
```

### `getStaffById(staffId)`
Get specific staff member by ID

**Parameters:**
- `staffId: string` - The staff member's ID

**Returns:** `Promise<Staff|null>`
```javascript
const staff = await getStaffById("staff123");
```

### `addStaff(staffData)`
Add new admin staff member

**Parameters:**
- `staffData: {name, email, role, department}`

**Returns:** `Promise<Staff>`
```javascript
const newStaff = await addStaff({
  name: "Jane Doe",
  email: "jane@library.com",
  role: "admin",
  department: "Reference"
});
```

### `updateStaff(staffId, staffData)`
Update staff member information

**Parameters:**
- `staffId: string` - The staff member's ID
- `staffData: object` - Fields to update

**Returns:** `Promise<boolean>`
```javascript
await updateStaff("staff123", { role: "moderator", status: "active" });
```

### `deleteStaff(staffId)`
Delete staff member

**Parameters:**
- `staffId: string` - The staff member's ID

**Returns:** `Promise<boolean>`
```javascript
await deleteStaff("staff123");
```

---

## Audit Logging Functions

### `logAdminAction(logData)`
Log admin action to audit trail

**Parameters:**
```javascript
{
  action: string,           // e.g., "add_book", "update_staff", "delete_member"
  performedBy: string,      // Admin user ID
  targetType: string,       // e.g., "book", "user", "staff"
  targetId: string,         // ID of the affected resource
  changes: object,          // What was changed
  ipAddress?: string,       // Optional IP address
  status: string            // "success" or "failed"
}
```

**Returns:** `Promise<AuditLog>`
```javascript
await logAdminAction({
  action: "add_book",
  performedBy: currentUserId,
  targetType: "book",
  targetId: newBookId,
  changes: { title: "React Guide", author: "John" },
  status: "success"
});
```

### `getAuditLogs(limit = 100)`
Get recent audit logs

**Parameters:**
- `limit?: number` - Number of logs to retrieve (default: 100)

**Returns:** `Promise<AuditLog[]>`
```javascript
const logs = await getAuditLogs(50);
// Most recent first
```

### `getAuditLogsByUser(staffId, limit = 50)`
Get audit logs for specific user

**Parameters:**
- `staffId: string` - Staff member's ID
- `limit?: number` - Number of logs to retrieve (default: 50)

**Returns:** `Promise<AuditLog[]>`
```javascript
const userLogs = await getAuditLogsByUser("staff123", 100);
```

---

## Settings Functions

### `getGeneralSettings()`
Get library general information

**Returns:** `Promise<Settings>`
```javascript
const settings = await getGeneralSettings();
// { libraryName, email, phone, address, timezone }
```

### `updateGeneralSettings(settingsData)`
Update library general information

**Parameters:**
- `settingsData: {libraryName?, email?, phone?, address?, timezone?}`

**Returns:** `Promise<boolean>`
```javascript
await updateGeneralSettings({
  libraryName: "Central Library",
  phone: "+1-555-0123"
});
```

### `getPolicies()`
Get borrowing policies

**Returns:** `Promise<Policies>`
```javascript
const policies = await getPolicies();
// { booksPerMember, borrowDurationDays, lateFeePerDay, maxFeeAmount, ... }
```

### `updatePolicies(policiesData)`
Update borrowing policies

**Parameters:**
- `policiesData: object` - Policy fields to update

**Returns:** `Promise<boolean>`
```javascript
await updatePolicies({
  booksPerMember: 5,
  borrowDurationDays: 14,
  lateFeePerDay: 5
});
```

### `getFeatures()`
Get feature toggles

**Returns:** `Promise<Features>`
```javascript
const features = await getFeatures();
// { rfidEnabled, qrEnabled, ebookEnabled, questionBankEnabled, ... }
```

### `updateFeatures(featuresData)`
Enable/disable features

**Parameters:**
- `featuresData: {rfidEnabled?, qrEnabled?, ebookEnabled?, ...}`

**Returns:** `Promise<boolean>`
```javascript
await updateFeatures({
  rfidEnabled: true,
  maintenanceMode: false
});
```

---

## Permissions & Roles Functions

### `getAllRoles()`
Get all admin roles with permissions

**Returns:** `Promise<{[roleName]: Role}>`
```javascript
const roles = await getAllRoles();
// { super_admin: {...}, admin: {...}, moderator: {...} }
```

### `getRole(roleName)`
Get specific role details

**Parameters:**
- `roleName: string` - Role name (e.g., "admin", "moderator")

**Returns:** `Promise<Role|null>`
```javascript
const adminRole = await getRole("admin");
// { permissions: [...], level: 2 }
```

### `getAllPermissions()`
Get all available permissions

**Returns:** `Promise<{[permissionId]: Permission}>`
```javascript
const permissions = await getAllPermissions();
```

---

## Reports Functions

### `generateReport(reportData)`
Create and save a report

**Parameters:**
```javascript
{
  title: string,            // Report title
  type: string,             // e.g., "circulation", "inventory", "members"
  generatedBy: string,      // Admin user ID
  data: object,             // Report data
  filters?: object,         // Applied filters
  format?: string,          // "pdf", "csv", or "json"
  downloadUrl?: string      // Optional download link
}
```

**Returns:** `Promise<Report>`
```javascript
const report = await generateReport({
  title: "Monthly Circulation",
  type: "circulation",
  generatedBy: userId,
  data: reportData,
  format: "pdf"
});
```

### `getAllReports(limit = 50)`
Get generated reports

**Parameters:**
- `limit?: number` - Number of reports (default: 50)

**Returns:** `Promise<Report[]>`
```javascript
const reports = await getAllReports(20);
// Most recent first
```

### `getReportById(reportId)`
Get specific report

**Parameters:**
- `reportId: string` - Report ID

**Returns:** `Promise<Report|null>`
```javascript
const report = await getReportById("report123");
```

---

## Real-Time Listener Functions

### `listenToStaff(callback)`
Subscribe to staff changes

**Parameters:**
- `callback: (staff: Staff[]) => void` - Function called when staff changes

**Returns:** Function to unsubscribe
```javascript
const unsubscribe = listenToStaff((staff) => {
  console.log("Staff updated:", staff);
  setStaff(staff);
});

// Later, cleanup:
useEffect(() => {
  return () => unsubscribe();
}, []);
```

### `listenToAuditLogs(callback)`
Subscribe to audit log changes

**Parameters:**
- `callback: (logs: AuditLog[]) => void` - Function called when logs change

**Returns:** Function to unsubscribe
```javascript
const unsubscribe = listenToAuditLogs((logs) => {
  setLogs(logs);
});
```

### `listenToSettings(callback)`
Subscribe to settings changes

**Parameters:**
- `callback: (settings: object) => void` - Function called when settings change

**Returns:** Function to unsubscribe
```javascript
const unsubscribe = listenToSettings((settings) => {
  setSettings(settings);
});
```

---

## TypeScript Interfaces

```typescript
interface Staff {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
  status: "active" | "inactive" | "suspended";
  createdAt: number;
  lastLogin: number | null;
  department: string;
  updatedAt?: number;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetType: string;
  targetId: string;
  changes: object;
  timestamp: number;
  ipAddress: string;
  status: "success" | "failed";
}

interface Settings {
  libraryName: string;
  libraryEmail: string;
  phone: string;
  address: string;
  timezone: string;
}

interface Policies {
  booksPerMember: number;
  borrowDurationDays: number;
  lateFeePerDay: number;
  maxFeeAmount: number;
  renewalLimit: number;
  reservationLimit: number;
}

interface Features {
  rfidEnabled: boolean;
  qrEnabled: boolean;
  ebookEnabled: boolean;
  questionBankEnabled: boolean;
  publicationTrackingEnabled: boolean;
  maintenanceMode: boolean;
}

interface Report {
  id: string;
  title: string;
  type: string;
  generatedBy: string;
  generatedAt: number;
  filters: object;
  data: object;
  format: string;
  downloadUrl: string;
}

interface Role {
  permissions: string[];
  level: number;
}
```

---

## Error Handling

All functions throw errors on failure. Always wrap calls in try-catch:

```javascript
try {
  const staff = await getAllStaff();
} catch (error) {
  console.error("Failed to fetch staff:", error.message);
  // Handle error - show message to user
}
```

Common error messages:
- `"Firebase database not configured"` - Check .env variables
- `"Permission denied"` - User doesn't have admin access
- Network errors - Check internet connection

---

## Usage Pattern

```javascript
import { useEffect, useState } from "react";
import { getAllStaff, listenToStaff } from "../lib/adminDatabaseService";

export default function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getAllStaff();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Subscribe to real-time updates (optional)
  useEffect(() => {
    const unsubscribe = listenToStaff((staff) => {
      setData(staff);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render data */}
    </div>
  );
}
```
