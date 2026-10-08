/**
 * Integrated Library System Setup Script
 * 
 * This script uploads the integrated_library_system.json configuration
 * to Firebase Realtime Database
 * 
 * Usage:
 * 1. Make sure .env has all Firebase configuration
 * 2. Place integrated_library_system.json in the project root
 * 3. Run: node scripts/setup-integrated-system.js
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function uploadIntegratedSystem() {
  try {
    console.log(" Starting Integrated Library System Setup...\n");

    // Verify Firebase config
    if (!Object.values(firebaseConfig).every(Boolean)) {
      throw new Error("❌ Firebase configuration incomplete. Check .env file.");
    }

    console.log("✅ Firebase configuration loaded");

    // Read the integrated_library_system.json file
    const filePaths = [
      path.join(__dirname, "../integrated_library_system.json"),
      path.join(__dirname, "../Downloads/integrated_library_system.json"),
      "c:/Users/user/Downloads/integrated_library_system.json",
    ];

    let configData = null;
    let foundPath = null;

    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          configData = JSON.parse(content);
          foundPath = filePath;
          console.log(`✅ Configuration file loaded from: ${filePath}\n`);
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (!configData) {
      throw new Error(
        "❌ Could not find integrated_library_system.json. Please place it in the project root or Downloads folder."
      );
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    console.log("📤 Uploading configuration to Firebase Realtime Database...\n");

    // Upload system administration
    if (configData.system_administration) {
      await set(
        ref(database, "system_administration"),
        configData.system_administration
      );
      console.log("✅ System administration data uploaded");
    }

    // Upload catalog
    if (configData.catalog) {
      if (configData.catalog.categories) {
        await set(ref(database, "catalog/categories"), configData.catalog.categories);
        console.log("✅ Categories uploaded");
      }

      if (configData.catalog.books) {
        await set(ref(database, "catalog/books"), configData.catalog.books);
        console.log("✅ Books catalog uploaded");
      }
    }

    // Upload other sections if present
    for (const key in configData) {
      if (key !== "system_administration" && key !== "catalog") {
        await set(ref(database, key), configData[key]);
        console.log(`✅ ${key} uploaded`);
      }
    }

    console.log("\n✨ Integrated Library System setup completed successfully!");
    console.log(`\n📍 Source file: ${foundPath}`);
    console.log("📍 Firebase Database URL:", firebaseConfig.databaseURL);
    console.log("\n💡 You can now access the data in your Firebase Realtime Database");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

uploadIntegratedSystem();
