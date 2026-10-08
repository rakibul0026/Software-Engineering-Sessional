/**
 * Admin Setup Script
 * 
 * This script initializes the admin user account in Firebase
 * Run this ONCE during setup to create the initial admin account
 * 
 * Usage:
 * 1. Make sure .env has all Firebase configuration
 * 2. Run: node scripts/setup-admin.js
 * 3. Admin account will be created in Realtime Database with credentials:
 *    - Email: admin@123
 *    - Password: Cstu@123
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import dotenv from "dotenv";

dotenv.config();

// Firebase Config from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Credentials to create
const ADMIN_EMAIL = "admin@123";
const ADMIN_PASSWORD = "Cstu@123";

async function setupAdmin() {
  try {
    console.log("🚀 Starting Admin Setup...\n");

    // Verify Firebase config
    if (!Object.values(firebaseConfig).every(Boolean)) {
      throw new Error("❌ Firebase configuration incomplete. Check .env file.");
    }

    console.log("✅ Firebase configuration loaded");

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    console.log("✅ Firebase initialized");

    // Create admin record in Database
    console.log("\n📝 Creating admin record in Realtime Database...");
    const adminKey = "admin_user";
    const adminRef = ref(database, `users/${adminKey}`);
    await set(adminRef, {
      id: adminKey,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "System Administrator",
      role: "Admin",
      roleKey: "admin",
      permissions: ["all"],
      status: "active",
      createdAt: Date.now(),
      lastLogin: null,
      department: "Administration",
      description: "Initial admin account created during setup"
    });

    console.log("✅ Admin record created in database");

    // Create general settings if they don't exist
    console.log("\n📝 Initializing library settings...");
    const settingsRef = ref(database, "admin/settings/general");
    await set(settingsRef, {
      libraryName: "Library Management System",
      libraryEmail: ADMIN_EMAIL,
      phone: "+1-000-0000",
      address: "Library Address",
      timezone: "UTC"
    }, { merge: true }).catch(() => console.log("   (Settings might already exist)"));

    console.log("✅ Settings initialized");

    // Create default policies
    console.log("\n📝 Initializing default borrowing policies...");
    const policiesRef = ref(database, "admin/settings/policies");
    await set(policiesRef, {
      booksPerMember: 5,
      borrowDurationDays: 14,
      lateFeePerDay: 5,
      maxFeeAmount: 100,
      renewalLimit: 2,
      reservationLimit: 3
    }, { merge: true }).catch(() => console.log("   (Policies might already exist)"));

    console.log("✅ Policies initialized");

    // Create default features
    console.log("\n📝 Initializing feature toggles...");
    const featuresRef = ref(database, "admin/settings/features");
    await set(featuresRef, {
      rfidEnabled: false,
      qrEnabled: true,
      ebookEnabled: true,
      questionBankEnabled: false,
      publicationTrackingEnabled: false,
      maintenanceMode: false
    }, { merge: true }).catch(() => console.log("   (Features might already exist)"));

    console.log("✅ Features initialized");

    // Create default roles
    console.log("\n📝 Initializing roles...");
    const rolesRef = ref(database, "admin/permissions/roles");
    await set(rolesRef, {
      super_admin: {
        permissions: ["all"],
        level: 3
      },
      admin: {
        permissions: ["manage_staff", "manage_books", "manage_users", "view_reports"],
        level: 2
      },
      moderator: {
        permissions: ["manage_books", "view_reports"],
        level: 1
      }
    }, { merge: true }).catch(() => console.log("   (Roles might already exist)"));

    console.log("✅ Roles initialized");

    console.log("\n✅ ========================================");
    console.log("✅ Admin Setup Completed Successfully!");
    console.log("✅ ========================================\n");

    console.log("📋 Admin Account Details:");
    console.log("   Email:    admin@123");
    console.log("   Password: Cstu@123");
    console.log("   Role:     Super Admin");
    console.log("   UID:      admin");

    console.log("\n🔐 Security Notes:");
    console.log("   ⚠️  Change password in production");
    console.log("   ⚠️  Keep credentials secure");
    console.log("   ⚠️  Use strong passwords for real admin accounts");

    console.log("\n🚀 Next Steps:");
    console.log("   1. Start your React app (npm run dev)");
    console.log("   2. Navigate to admin login page");
    console.log("   3. Login with the credentials above");
    console.log("   4. Access the admin dashboard\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Setup Failed:");
    console.error("Error:", error.message);

    if (error.message.includes("Firebase configuration incomplete")) {
      console.error("\n💡 Firebase configuration is missing.");
      console.error("   Make sure you have a .env file with all required variables:");
      console.error("   - VITE_FIREBASE_API_KEY");
      console.error("   - VITE_FIREBASE_AUTH_DOMAIN");
      console.error("   - VITE_FIREBASE_DATABASE_URL");
      console.error("   - VITE_FIREBASE_PROJECT_ID");
      console.error("   - VITE_FIREBASE_STORAGE_BUCKET");
      console.error("   - VITE_FIREBASE_MESSAGING_SENDER_ID");
      console.error("   - VITE_FIREBASE_APP_ID");
    }

    process.exit(1);
  }
}

// Run setup
setupAdmin();
