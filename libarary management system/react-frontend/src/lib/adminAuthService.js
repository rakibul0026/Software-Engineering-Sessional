/**
 * Admin Authentication Service
 * Handles admin-specific login, registration, and authentication
 */

import { firebaseAuth, firebaseDatabase, hasFirebaseConfig } from "./firebaseClient";
import { 
  signOut,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

function isAdminRole(role) {
  const normalized = normalizeRole(role);
  return normalized === "admin" || normalized === "super_admin";
}

/**
 * Create admin user in Firebase Realtime Database
 * Use this during initial setup to create the admin account
 */
export async function createAdminUser(email, password) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase not configured");
  }

  try {
    const adminKey = "admin_user";
    const adminRef = ref(firebaseDatabase, `users/${adminKey}`);
    await set(adminRef, {
      id: adminKey,
      email,
      password,
      name: "Admin User",
      role: "Admin",
      roleKey: "admin",
      permissions: ["all"],
      status: "active",
      createdAt: Date.now(),
      lastLogin: null,
      department: "Administration"
    });

    console.log("Admin user created successfully");
    return {
      uid: adminKey,
      email
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

/**
 * Admin login with email and password
 * Validates credentials and returns admin info
 */
export async function adminLogin(email, password) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase not configured");
  }

  try {
    // Try several common locations where admin credentials might be stored
    const candidatePaths = [
      "users",
      "admin",
      "system_administration/admin_credentials",
      "admin_credentials",
    ];

    let matchedEntry = null;
    let matchedPath = null;

    for (const path of candidatePaths) {
      const snap = await get(ref(firebaseDatabase, path));
      if (!snap.exists()) continue;

      const records = snap.val();

      // records may be an object with multiple children or a single object
      const entries = Array.isArray(records) ? Object.entries(records) : Object.entries(records);

      matchedEntry = entries.find(([, adminData]) => {
        if (!adminData) return false;

        // normalize common key names
        const storedEmail = String(adminData?.email || adminData?.Email || "").trim();
        const storedPassword = String(adminData?.password || adminData?.Password || "");
        const storedRole = normalizeRole(adminData?.role || adminData?.Role || adminData?.roleKey);

        // Accept if role explicitly admin OR the path strongly suggests admin storage
        const roleOk = isAdminRole(storedRole) || path.startsWith("admin") || path.includes("admin_credentials");

        return (
          storedEmail === String(email || "").trim() &&
          storedPassword === String(password || "") &&
          roleOk
        );
      });

      if (matchedEntry) {
        matchedPath = path;
        break;
      }
    }

    if (!matchedEntry) {
      throw new Error("Authentication failed. Please try again.");
    }

    const [adminKey, adminData] = matchedEntry;

    // Update last login timestamp (use adminKey under a sensible path)
    await updateLastLogin(adminKey);

    return {
      uid: adminKey,
      email: adminData.email || adminData.Email,
      ...adminData,
      role: normalizeRole(adminData.role || adminData.Role || adminData.roleKey) || "admin"
    };
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
}

/**
 * Admin logout
 */
export async function adminLogout() {
  try {
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }
    return true;
  } catch (error) {
    console.error("Admin logout error:", error);
    throw error;
  }
}

/**
 * Get current admin user from database
 */
export async function getCurrentAdmin(uid) {
  if (!firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const adminRef = ref(firebaseDatabase, `admin/staff/${uid}`);
    const snapshot = await get(adminRef);

    if (snapshot.exists()) {
      return {
        uid: uid,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting current admin:", error);
    throw error;
  }
}

/**
 * Update admin last login timestamp
 */
export async function updateLastLogin(uid) {
  if (!firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const adminRef = ref(firebaseDatabase, `admin/staff/${uid}/lastLogin`);
    await set(adminRef, Date.now());
  } catch (error) {
    console.error("Error updating last login:", error);
    // Don't throw - this is non-critical
  }
}

/**
 * Verify if user is admin
 */
export async function isUserAdmin(uid) {
  if (!firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const adminRef = ref(firebaseDatabase, `admin/staff/${uid}`);
    const snapshot = await get(adminRef);
    if (!snapshot.exists()) {
      return false;
    }

    const adminData = snapshot.val();
    return isAdminRole(adminData.role);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get admin role level
 */
export async function getAdminRole(uid) {
  if (!firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const adminRef = ref(firebaseDatabase, `admin/staff/${uid}/role`);
    const snapshot = await get(adminRef);
    const role = snapshot.val();
    return role ? normalizeRole(role) : null;
  } catch (error) {
    console.error("Error getting admin role:", error);
    throw error;
  }
}

/**
 * Check if admin has specific permission
 */
export async function hasAdminPermission(uid, permission) {
  if (!firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const permissionsRef = ref(firebaseDatabase, `admin/staff/${uid}/permissions`);
    const snapshot = await get(permissionsRef);
    
    if (snapshot.exists()) {
      const permissions = snapshot.val();
      return permissions.includes(permission) || permissions.includes("all");
    }
    return false;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

/**
 * Verify specific credentials (email and password match)
 * This checks against Firebase Auth, not database
 */
export async function verifyAdminCredentials(email, password) {
  try {
    await adminLogin(email, password);
    return true;
  } catch (error) {
    return false;
  }
}
