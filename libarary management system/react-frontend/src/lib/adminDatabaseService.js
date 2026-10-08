/**
 * Admin Section Database Service
 * Handles all admin-related database operations for Firebase
 */

import { firebaseDatabase, hasFirebaseConfig } from "./firebaseClient";
import { 
  ref, 
  get, 
  set, 
  push, 
  update, 
  remove, 
  query, 
  orderByChild, 
  limitToLast,
  onValue,
  off 
} from "firebase/database";

function toArray(snapshotValue) {
  if (!snapshotValue || typeof snapshotValue !== "object") {
    return [];
  }

  return Object.entries(snapshotValue).map(([id, value]) => ({
    id,
    ...value,
  }));
}

function sortByTimestampDesc(items) {
  return [...items].sort((left, right) => {
    const leftValue = new Date(left?.timestamp || left?.issuedAt || left?.createdAt || 0).getTime();
    const rightValue = new Date(right?.timestamp || right?.issuedAt || right?.createdAt || 0).getTime();
    return rightValue - leftValue;
  });
}

function normalizeIssueRecord(record, fallback = {}) {
  const issuedAt = record?.issuedAt || record?.timestamp || record?.createdAt || fallback.issuedAt || fallback.timestamp || null;
  const dueDate = record?.dueDate || fallback.dueDate || null;

  return {
    ...record,
    ...fallback,
    issuedAt,
    timestamp: record?.timestamp || issuedAt,
    dueDate,
    borrowerName: record?.borrowerName || fallback.borrowerName || record?.userName || record?.userEmail || record?.userId || fallback.userId || "Unknown User",
  };
}

/**
 * Get all users stored in Firebase Realtime Database
 */
export async function getAllUsers() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const usersRef = ref(firebaseDatabase, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      return [];
    }

    return toArray(snapshot.val());
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Get recent issue transactions from Firebase Realtime Database
 */
export async function getRecentIssuedBooks(limit = 10) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const [transactionsSnapshot, usersSnapshot] = await Promise.all([
      get(ref(firebaseDatabase, "transactions")),
      get(ref(firebaseDatabase, "users")),
    ]);

    const transactionIssues = transactionsSnapshot.exists()
      ? toArray(transactionsSnapshot.val())
          .filter((transaction) => transaction.action === "ISSUED")
          .map((transaction) => normalizeIssueRecord(transaction, {
            borrowerName: transaction.userName || transaction.userEmail || transaction.userId || "Unknown User",
          }))
      : [];

    const borrowedBookIssues = usersSnapshot.exists()
      ? toArray(usersSnapshot.val()).flatMap((user) => {
          const borrowedBooks = user?.borrowedBooks;
          if (!borrowedBooks || typeof borrowedBooks !== "object") {
            return [];
          }

          return Object.entries(borrowedBooks).map(([bookId, borrowedBook]) => normalizeIssueRecord({
            id: `${user.id}-${bookId}`,
            bookId,
            userId: user.id,
            borrowerName: user.name || user.displayName || user.email || user.id,
            action: "ISSUED",
            ...borrowedBook,
          }, {
            borrowerName: user.name || user.displayName || user.email || user.id,
            userId: user.id,
          }));
        })
      : [];

    const mergedIssues = sortByTimestampDesc([
      ...transactionIssues,
      ...borrowedBookIssues,
    ]);

    return mergedIssues.slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent issued books:", error);
    throw error;
  }
}

// ============================================================
// STAFF MANAGEMENT
// ============================================================

/**
 * Get all admin staff members
 */
export async function getAllStaff() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const staffRef = ref(firebaseDatabase, "admin/staff");
    const snapshot = await get(staffRef);
    
    if (snapshot.exists()) {
      const staffData = snapshot.val();
      return Object.keys(staffData).map(key => ({
        id: key,
        ...staffData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
}

/**
 * Get staff member by ID
 */
export async function getStaffById(staffId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const staffRef = ref(firebaseDatabase, `admin/staff/${staffId}`);
    const snapshot = await get(staffRef);
    
    if (snapshot.exists()) {
      return {
        id: staffId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching staff member:", error);
    throw error;
  }
}

/**
 * Add new staff member
 */
export async function addStaff(staffData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const newRef = push(ref(firebaseDatabase, "admin/staff"));
    const staffId = newRef.key;

    const staff = {
      id: staffId,
      name: staffData.name,
      email: staffData.email,
      role: staffData.role || "moderator",
      permissions: staffData.permissions || [],
      status: "active",
      createdAt: Date.now(),
      lastLogin: null,
      department: staffData.department || ""
    };

    await set(newRef, staff);
    return staff;
  } catch (error) {
    console.error("Error adding staff:", error);
    throw error;
  }
}

/**
 * Update staff member
 */
export async function updateStaff(staffId, staffData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const staffRef = ref(firebaseDatabase, `admin/staff/${staffId}`);
    await update(staffRef, {
      ...staffData,
      updatedAt: Date.now()
    });
    return true;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
}

/**
 * Delete staff member
 */
export async function deleteStaff(staffId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const staffRef = ref(firebaseDatabase, `admin/staff/${staffId}`);
    await remove(staffRef);
    return true;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
}

// ============================================================
// AUDIT LOGGING
// ============================================================

/**
 * Log admin action to audit trail
 */
export async function logAdminAction(logData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const newRef = push(ref(firebaseDatabase, "admin/logs/audit"));
    const logId = newRef.key;

    const auditLog = {
      id: logId,
      action: logData.action,
      performedBy: logData.performedBy,
      targetType: logData.targetType,
      targetId: logData.targetId,
      changes: logData.changes || {},
      timestamp: Date.now(),
      ipAddress: logData.ipAddress || "",
      status: logData.status || "success"
    };

    await set(newRef, auditLog);
    return auditLog;
  } catch (error) {
    console.error("Error logging admin action:", error);
    throw error;
  }
}

/**
 * Get audit logs with pagination
 */
export async function getAuditLogs(limit = 100) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const logsRef = ref(firebaseDatabase, "admin/logs/audit");
    const logsQuery = query(logsRef, orderByChild("timestamp"), limitToLast(limit));
    const snapshot = await get(logsQuery);
    
    if (snapshot.exists()) {
      const logsData = snapshot.val();
      const logs = Object.keys(logsData).map(key => ({
        id: key,
        ...logsData[key]
      }));
      return logs.reverse(); // Most recent first
    }
    return [];
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
}

/**
 * Get audit logs by user
 */
export async function getAuditLogsByUser(staffId, limit = 50) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const logsRef = ref(firebaseDatabase, "admin/logs/audit");
    const snapshot = await get(logsRef);
    
    if (snapshot.exists()) {
      const logsData = snapshot.val();
      const logs = Object.keys(logsData)
        .map(key => ({
          id: key,
          ...logsData[key]
        }))
        .filter(log => log.performedBy === staffId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
      
      return logs;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user audit logs:", error);
    throw error;
  }
}

// ============================================================
// SETTINGS MANAGEMENT
// ============================================================

/**
 * Get general library settings
 */
export async function getGeneralSettings() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const settingsRef = ref(firebaseDatabase, "admin/settings/general");
    const snapshot = await get(settingsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error("Error fetching general settings:", error);
    throw error;
  }
}

/**
 * Update general library settings
 */
export async function updateGeneralSettings(settingsData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const settingsRef = ref(firebaseDatabase, "admin/settings/general");
    await update(settingsRef, settingsData);
    return true;
  } catch (error) {
    console.error("Error updating general settings:", error);
    throw error;
  }
}

/**
 * Get borrowing policies
 */
export async function getPolicies() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const policiesRef = ref(firebaseDatabase, "admin/settings/policies");
    const snapshot = await get(policiesRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error("Error fetching policies:", error);
    throw error;
  }
}

/**
 * Update borrowing policies
 */
export async function updatePolicies(policiesData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const policiesRef = ref(firebaseDatabase, "admin/settings/policies");
    await update(policiesRef, policiesData);
    return true;
  } catch (error) {
    console.error("Error updating policies:", error);
    throw error;
  }
}

/**
 * Get feature toggles
 */
export async function getFeatures() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const featuresRef = ref(firebaseDatabase, "admin/settings/features");
    const snapshot = await get(featuresRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
}

/**
 * Update feature toggles
 */
export async function updateFeatures(featuresData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const featuresRef = ref(firebaseDatabase, "admin/settings/features");
    await update(featuresRef, featuresData);
    return true;
  } catch (error) {
    console.error("Error updating features:", error);
    throw error;
  }
}

// ============================================================
// PERMISSIONS & ROLES
// ============================================================

/**
 * Get all roles
 */
export async function getAllRoles() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const rolesRef = ref(firebaseDatabase, "admin/permissions/roles");
    const snapshot = await get(rolesRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

/**
 * Get role by name
 */
export async function getRole(roleName) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const roleRef = ref(firebaseDatabase, `admin/permissions/roles/${roleName}`);
    const snapshot = await get(roleRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching role:", error);
    throw error;
  }
}

/**
 * Get all permissions
 */
export async function getAllPermissions() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const permissionsRef = ref(firebaseDatabase, "admin/permissions");
    const snapshot = await get(permissionsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Filter out roles object if present
      const permissions = Object.keys(data)
        .filter(key => key !== "roles")
        .reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});
      
      return permissions;
    }
    return {};
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
}

// ============================================================
// REPORTS
// ============================================================

/**
 * Generate and save a report
 */
export async function generateReport(reportData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const newRef = push(ref(firebaseDatabase, "admin/reports"));
    const reportId = newRef.key;

    const report = {
      id: reportId,
      title: reportData.title,
      type: reportData.type,
      generatedBy: reportData.generatedBy,
      generatedAt: Date.now(),
      filters: reportData.filters || {},
      data: reportData.data || {},
      format: reportData.format || "json",
      downloadUrl: reportData.downloadUrl || ""
    };

    await set(newRef, report);
    return report;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

/**
 * Get all reports
 */
export async function getAllReports(limit = 50) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const reportsRef = ref(firebaseDatabase, "admin/reports");
    const reportsQuery = query(reportsRef, orderByChild("generatedAt"), limitToLast(limit));
    const snapshot = await get(reportsQuery);
    
    if (snapshot.exists()) {
      const reportsData = snapshot.val();
      const reports = Object.keys(reportsData)
        .map(key => ({
          id: key,
          ...reportsData[key]
        }))
        .reverse(); // Most recent first
      
      return reports;
    }
    return [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

/**
 * Get report by ID
 */
export async function getReportById(reportId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const reportRef = ref(firebaseDatabase, `admin/reports/${reportId}`);
    const snapshot = await get(reportRef);
    
    if (snapshot.exists()) {
      return {
        id: reportId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
}

// ============================================================
// REAL-TIME LISTENERS
// ============================================================

/**
 * Listen to real-time staff changes
 */
export function listenToStaff(callback) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  const staffRef = ref(firebaseDatabase, "admin/staff");
  
  onValue(staffRef, (snapshot) => {
    if (snapshot.exists()) {
      const staffData = snapshot.val();
      const staff = Object.keys(staffData).map(key => ({
        id: key,
        ...staffData[key]
      }));
      callback(staff);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error listening to staff:", error);
  });

  // Return unsubscribe function
  return () => off(staffRef);
}

/**
 * Listen to real-time audit logs
 */
export function listenToAuditLogs(callback) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  const logsRef = ref(firebaseDatabase, "admin/logs/audit");
  
  onValue(logsRef, (snapshot) => {
    if (snapshot.exists()) {
      const logsData = snapshot.val();
      const logs = Object.keys(logsData)
        .map(key => ({
          id: key,
          ...logsData[key]
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      
      callback(logs);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error listening to audit logs:", error);
  });

  // Return unsubscribe function
  return () => off(logsRef);
}

/**
 * Listen to settings changes
 */
export function listenToSettings(callback) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  const settingsRef = ref(firebaseDatabase, "admin/settings");
  
  onValue(settingsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback({});
    }
  }, (error) => {
    console.error("Error listening to settings:", error);
  });

  // Return unsubscribe function
  return () => off(settingsRef);
}
