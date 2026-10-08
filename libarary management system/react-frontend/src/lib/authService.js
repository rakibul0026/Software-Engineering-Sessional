import { firebaseAuth, hasFirebaseConfig } from "./firebaseClient";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile
} from "firebase/auth";

function emitAuthChange() {
  if (typeof window === "undefined") {
    return;
  }

  // Keep both event names for backward compatibility with existing listeners.
  window.dispatchEvent(new Event("auth-change"));
  window.dispatchEvent(new Event("cstu-auth-changed"));
}

export async function firebaseSignup(email, password) {
  if (!hasFirebaseConfig) {
    throw new Error("Firebase is not configured");
  }
  if (!firebaseAuth) {
    throw new Error("Firebase Auth not initialized");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase signup error:", error);
    throw error;
  }
}

export async function firebaseSignin(email, password) {
  if (!hasFirebaseConfig) {
    throw new Error("Firebase is not configured");
  }
  if (!firebaseAuth) {
    throw new Error("Firebase Auth not initialized");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase signin error:", error);
    throw error;
  }
}

export async function firebaseSignout() {
  if (!hasFirebaseConfig || !firebaseAuth) {
    return;
  }

  try {
    await signOut(firebaseAuth);
  } catch (error) {
    console.error("Firebase signout error:", error);
  }
}

export async function getFirebaseIdToken() {
  if (!firebaseAuth?.currentUser) {
    throw new Error("No user logged in");
  }

  try {
    return await firebaseAuth.currentUser.getIdToken();
  } catch (error) {
    console.error("Error getting ID token:", error);
    throw error;
  }
}

export async function loginUser(email, password, role = "member") {
  try {
    const user = await firebaseSignin(email, password);
    const idToken = await getFirebaseIdToken();
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      idToken: idToken,
      role: role
    };
    
    window.localStorage.setItem("cstuUser", JSON.stringify(userData));
    window.localStorage.setItem("cstuLoggedIn", "1");
    window.localStorage.setItem("cstuUserRole", role);
    emitAuthChange();
    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signupUser(email, password, role = "member") {
  try {
    console.log("authService.signupUser - Starting signup for:", email);
    const user = await firebaseSignup(email, password);
    console.log("authService.signupUser - Firebase user created:", user.uid);
    
    const idToken = await getFirebaseIdToken();
    console.log("authService.signupUser - Got ID token");
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      idToken: idToken,
      role: role,
      createdAt: new Date().toISOString()
    };
    
    console.log("authService.signupUser - Saving to localStorage:", userData);
    window.localStorage.setItem("cstuUser", JSON.stringify(userData));
    window.localStorage.setItem("cstuLoggedIn", "1");
    window.localStorage.setItem("cstuUserRole", role);
    
    console.log("authService.signupUser - Verifying localStorage:");
    console.log("  cstuUser:", window.localStorage.getItem("cstuUser"));
    console.log("  cstuLoggedIn:", window.localStorage.getItem("cstuLoggedIn"));
    console.log("  cstuUserRole:", window.localStorage.getItem("cstuUserRole"));
    
    emitAuthChange();
    console.log("authService.signupUser - Auth change event emitted");
    return userData;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await firebaseSignout();
    window.localStorage.removeItem("cstuUser");
    window.localStorage.removeItem("cstuLoggedIn");
    window.localStorage.removeItem("cstuUserRole");
    emitAuthChange();
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed");
  }
}

export async function updateCurrentUserDisplayName(displayName) {
  if (!hasFirebaseConfig || !firebaseAuth?.currentUser) {
    throw new Error("No authenticated user found");
  }

  const user = firebaseAuth.currentUser;
  await updateProfile(user, { displayName });

  const storedUser = getStoredUser() || {};
  const userData = {
    ...storedUser,
    uid: user.uid,
    email: user.email,
    displayName,
  };

  window.localStorage.setItem("cstuUser", JSON.stringify(userData));
  emitAuthChange();
  return userData;
}

export async function updateCurrentUserPhotoURL(photoURL) {
  if (!hasFirebaseConfig || !firebaseAuth?.currentUser) {
    throw new Error("No authenticated user found");
  }

  const user = firebaseAuth.currentUser;
  await updateProfile(user, { photoURL });

  const storedUser = getStoredUser() || {};
  const userData = {
    ...storedUser,
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: photoURL || "",
  };

  window.localStorage.setItem("cstuUser", JSON.stringify(userData));
  emitAuthChange();
  return userData;
}

export async function changeCurrentUserPassword(currentPassword, newPassword) {
  if (!hasFirebaseConfig || !firebaseAuth?.currentUser) {
    throw new Error("No authenticated user found");
  }

  const user = firebaseAuth.currentUser;
  if (!user.email) {
    throw new Error("No email address is associated with this account");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
  return true;
}

export function watchAuthState(callback) {
  if (!firebaseAuth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
      window.localStorage.setItem("cstuUser", JSON.stringify(userData));
      window.localStorage.setItem("cstuLoggedIn", "1");
      callback(userData);
    } else {
      window.localStorage.removeItem("cstuUser");
      window.localStorage.removeItem("cstuLoggedIn");
      callback(null);
    }
    emitAuthChange();
  });
}

export function getStoredUser() {
  try {
    const stored = window.localStorage.getItem("cstuUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  return getStoredUser();
}

export function isUserLoggedIn() {
  return !!getStoredUser();
}
