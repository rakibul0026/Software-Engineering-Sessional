# Firebase Admin Section Database Structure

## Firebase Realtime Database Schema

```
https://cstu-lms-default-rtdb.firebaseio.com/
├── books/
├── transactions/
├── users/
├── admin/
│   ├── staff/
│   │   ├── {staffId}/
│   │   │   ├── id: string
│   │   │   ├── name: string
│   │   │   ├── email: string
│   │   │   ├── role: string (super_admin, admin, moderator)
│   │   │   ├── permissions: array
│   │   │   ├── status: string (active, inactive, suspended)
│   │   │   ├── createdAt: timestamp
│   │   │   ├── lastLogin: timestamp
│   │   │   └── department: string
│   │
│   ├── logs/
│   │   ├── audit/
│   │   │   ├── {logId}/
│   │   │   │   ├── id: string
│   │   │   │   ├── action: string
│   │   │   │   ├── performedBy: string (staffId)
│   │   │   │   ├── targetType: string (book, user, member, etc)
│   │   │   │   ├── targetId: string
│   │   │   │   ├── changes: object
│   │   │   │   ├── timestamp: timestamp
│   │   │   │   ├── ipAddress: string
│   │   │   │   └── status: string (success, failed)
│   │   │
│   │   └── activity/
│   │       ├── {activityId}/
│   │       │   ├── type: string (login, export, bulk_action, etc)
│   │       │   ├── staffId: string
│   │       │   ├── details: object
│   │       │   └── timestamp: timestamp
│   │
│   ├── settings/
│   │   ├── general/
│   │   │   ├── libraryName: string
│   │   │   ├── libraryEmail: string
│   │   │   ├── phone: string
│   │   │   ├── address: string
│   │   │   └── timezone: string
│   │   │
│   │   ├── policies/
│   │   │   ├── booksPerMember: number
│   │   │   ├── borrowDurationDays: number
│   │   │   ├── lateFeePerDay: number
│   │   │   ├── maxFeeAmount: number
│   │   │   ├── renewalLimit: number
│   │   │   └── reservationLimit: number
│   │   │
│   │   ├── features/
│   │   │   ├── rfidEnabled: boolean
│   │   │   ├── qrEnabled: boolean
│   │   │   ├── ebookEnabled: boolean
│   │   │   ├── questionBankEnabled: boolean
│   │   │   ├── publicationTrackingEnabled: boolean
│   │   │   └── maintenanceMode: boolean
│   │   │
│   │   └── notifications/
│   │       ├── emailEnabled: boolean
│   │       ├── smsEnabled: boolean
│   │       └── reminderDaysBefore: number
│   │
│   ├── reports/
│   │   ├── {reportId}/
│   │   │   ├── id: string
│   │   │   ├── title: string
│   │   │   ├── type: string (books_inventory, member_activity, overdue, etc)
│   │   │   ├── generatedBy: string (staffId)
│   │   │   ├── generatedAt: timestamp
│   │   │   ├── filters: object
│   │   │   ├── data: object
│   │   │   ├── format: string (pdf, csv, json)
│   │   │   └── downloadUrl: string
│   │   │
│   │   ├── scheduled/
│   │   │   ├── {scheduleId}/
│   │   │   │   ├── reportType: string
│   │   │   │   ├── frequency: string (daily, weekly, monthly)
│   │   │   │   ├── nextRun: timestamp
│   │   │   │   ├── recipients: array
│   │   │   │   ├── enabled: boolean
│   │   │   │   └── createdAt: timestamp
│   │
│   ├── backup/
│   │   ├── {backupId}/
│   │   │   ├── id: string
│   │   │   ├── timestamp: timestamp
│   │   │   ├── size: number
│   │   │   ├── type: string (auto, manual)
│   │   │   ├── performedBy: string (staffId)
│   │   │   ├── status: string (completed, failed)
│   │   │   ├── backupUrl: string
│   │   │   └── checksum: string
│   │
│   ├── permissions/
│   │   ├── {permissionId}/
│   │   │   ├── name: string
│   │   │   ├── code: string
│   │   │   ├── description: string
│   │   │   └── module: string (books, members, reports, etc)
│   │   │
│   │   └── roles/
│   │       ├── super_admin/
│   │       │   ├── permissions: array
│   │       │   └── level: number
│   │       ├── admin/
│   │       │   ├── permissions: array
│   │       │   └── level: number
│   │       └── moderator/
│   │           ├── permissions: array
│   │           └── level: number
│   │
│   ├── notifications/
│   │   ├── {notificationId}/
│   │   │   ├── id: string
│   │   │   ├── title: string
│   │   │   ├── message: string
│   │   │   ├── type: string (alert, warning, info, success)
│   │   │   ├── recipient: string (staffId or 'all')
│   │   │   ├── read: boolean
│   │   │   ├── createdAt: timestamp
│   │   │   └── expiresAt: timestamp
│   │
│   └── maintenance/
│       ├── schedules/
│       │   ├── {scheduleId}/
│       │   │   ├── name: string
│       │   │   ├── type: string (system, database, backup)
│       │   │   ├── scheduledFor: timestamp
│       │   │   ├── duration: number (minutes)
│       │   │   ├── createdBy: string
│       │   │   └── status: string (scheduled, in_progress, completed)
│       │
│       └── tasks/
│           ├── {taskId}/
│           │   ├── name: string
│           │   ├── description: string
│           │   ├── priority: string (high, medium, low)
│           │   ├── status: string (pending, in_progress, completed, failed)
│           │   ├── assignedTo: string (staffId)
│           │   ├── createdAt: timestamp
│           │   └── dueDate: timestamp
```

## Key Admin Features

### 1. Staff Management
- Multiple admin roles with different permission levels
- Staff activity tracking and login history
- Status management (active, inactive, suspended)

### 2. Audit Logging
- Track all admin actions (create, update, delete)
- Record who made changes, when, and what changed
- Failed action logging for security

### 3. Settings Management
- General library information
- Borrowing policies and rules
- Feature toggles for system capabilities
- Notification preferences

### 4. Reports
- On-demand report generation
- Scheduled automated reports
- Multiple export formats (PDF, CSV, JSON)
- Report distribution to staff

### 5. Access Control
- Granular permission system
- Role-based access control (RBAC)
- Permission-to-role mapping

### 6. Data Management
- Automated and manual backups
- Backup versioning and recovery
- Data integrity checks

### 7. Maintenance
- Scheduled maintenance windows
- Task management system
- Priority-based task tracking

## Firebase Security Rules Template

```javascript
{
  "rules": {
    "admin": {
      ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true && root.child('users').child(auth.uid).child('role').val() === 'super_admin'",
      
      "staff": {
        ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": "root.child('users').child(auth.uid).child('role').val() === 'super_admin'"
      },
      
      "logs": {
        ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": false
      },
      
      "settings": {
        ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": "root.child('users').child(auth.uid).child('role').val() === 'super_admin'"
      }
    }
  }
}
```

## Usage in Frontend

### Reading Admin Data
```javascript
// Read staff list
const staffRef = ref(db, 'admin/staff');
const staffSnapshot = await get(staffRef);

// Read audit logs
const auditRef = ref(db, 'admin/logs/audit');
const auditSnapshot = await get(auditRef);

// Read settings
const settingsRef = ref(db, 'admin/settings/general');
const settingsSnapshot = await get(settingsRef);
```

### Writing Admin Data
```javascript
// Log admin action
const logRef = ref(db, `admin/logs/audit/${newLogId}`);
await set(logRef, {
  action: 'update_book',
  performedBy: currentStaffId,
  targetType: 'book',
  targetId: bookId,
  changes: changeObject,
  timestamp: Date.now(),
  status: 'success'
});

// Update settings
const settingRef = ref(db, 'admin/settings/general/libraryName');
await set(settingRef, 'New Library Name');
```
