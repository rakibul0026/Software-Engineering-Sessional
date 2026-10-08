import SiteShell from "../components/SiteShell";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, getUserBorrowedBooks, getUserTransactions, getBookById, updateUserProfile, createUserProfile } from "../lib/databaseService";
import { changeCurrentUserPassword, updateCurrentUserDisplayName, updateCurrentUserPhotoURL, watchAuthState } from "../lib/authService";

function handleLogout(event) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("cstuLoggedIn");
    window.localStorage.removeItem("cstuUserRole");
    window.localStorage.removeItem("cstuPendingRole");
    window.localStorage.removeItem("cstuUser");
    window.dispatchEvent(new Event("cstu-auth-changed"));
  }

  window.location.href = "/login";
  event.preventDefault();
}

function getCurrentUser() {
  try {
    const raw = window.localStorage.getItem("cstuUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [borrowed, setBorrowed] = useState({});
  const [borrowedDetails, setBorrowedDetails] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => getCurrentUser()); // Make it state so it updates
  const [dialogType, setDialogType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropZoom, setCropZoom] = useState(1);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [cropOffsetX, setCropOffsetX] = useState(0);
  const [cropOffsetY, setCropOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropCanvasRef = useRef(null);
  const cropContainerRef = useRef(null);

  const currentPhotoUrl = profile?.photoURL || profile?.avatarUrl || user?.photoURL || "";

  // Watch for auth changes and update user state
  useEffect(() => {
    const unsubscribe = watchAuthState((freshUser) => {
      console.log("ProfilePage - Firebase auth state changed:", freshUser);
      setUser(freshUser || getCurrentUser());
    });

    const handleAuthChange = () => {
      const freshUser = getCurrentUser();
      console.log("ProfilePage - Local auth changed, fresh user:", freshUser);
      setUser(freshUser);
    };

    window.addEventListener("cstu-auth-changed", handleAuthChange);
    return () => {
      unsubscribe?.();
      window.removeEventListener("cstu-auth-changed", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    console.log("ProfilePage - Current user from state:", user);
    
    // If no user is found, show a message but don't redirect immediately
    // Just set loading to false so the error state is displayed
    if (!user?.uid) {
      console.warn("ProfilePage - No authenticated user found");
      
      // Check if user just signed up - if so, wait longer before showing error
      const justSignedUp = window.localStorage.getItem("cstuJustSignedUp") === "1";
      if (justSignedUp) {
        console.log("ProfilePage - User just signed up, waiting for auth to propagate...");
        // Wait a bit longer for auth to propagate
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
      }
      
      setLoading(false);
      return;
    }

    // User exists, clear the signup flag
    window.localStorage.removeItem("cstuJustSignedUp");

    (async () => {
      try {
        console.log("ProfilePage - Fetching user profile for UID:", user.uid);
        let p = await getUserProfile(user.uid);

        if (!p) {
          p = await createUserProfile(user.uid, {
            name: user.displayName || user.email?.split("@")[0] || "",
            displayName: user.displayName || user.email?.split("@")[0] || "",
            email: user.email || "",
            role: user.role || "member",
            photoURL: user.photoURL || "",
          });
        }

        setProfile(p || {});

        const b = await getUserBorrowedBooks(user.uid);
        setBorrowed(b || {});

        const tx = await getUserTransactions(user.uid);
        const txByBookId = (tx || []).reduce((acc, transaction) => {
          if (transaction?.bookId) {
            acc[transaction.bookId] = transaction;
          }
          return acc;
        }, {});
        setTransactions(tx || []);

        // fetch book details for borrowed books
        const ids = Object.keys(b || {});
        const details = await Promise.all(ids.map(async (id) => {
          const book = await getBookById(id);
          const borrowedRecord = b[id] || {};
          const relatedTransaction = txByBookId[id] || {};
          return {
            id,
            bookTitle: borrowedRecord.bookTitle || relatedTransaction.bookTitle || book?.title || id,
            issuedAt: borrowedRecord.issuedAt || relatedTransaction.timestamp,
            dueDate: borrowedRecord.dueDate,
          };
        }));
        setBorrowedDetails(details);
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    const name = profile?.displayName || profile?.name || user?.displayName || user?.email?.split("@")[0] || "";
    setDisplayName(name);
  }, [profile, user]);

  function openEditDialog() {
    setDialogType("edit");
    setDialogError("");
    setDialogMessage("");
    const name = profile?.displayName || profile?.name || user?.displayName || user?.email?.split("@")[0] || "";
    setDisplayName(name);
  }

  function openPasswordDialog() {
    setDialogType("password");
    setDialogError("");
    setDialogMessage("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function closeDialog() {
    setDialogType(null);
    setDialogError("");
    setDialogMessage("");
    setSaving(false);
  }

  function triggerPhotoPicker() {
    setPhotoError("");
    setPhotoMessage("");
    fileInputRef.current?.click();
  }

  function handleCropZoomChange(e) {
    setCropZoom(Number(e.target.value));
  }

  function handleZoomIn() {
    setCropZoom((prev) => Math.min(prev + 0.2, 3));
  }

  function handleZoomOut() {
    setCropZoom((prev) => Math.max(prev - 0.2, 0.5));
  }

  function handleMouseDown(e) {
    if (!cropContainerRef.current) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setCropOffsetX((prev) => prev + deltaX);
    setCropOffsetY((prev) => prev + deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function getCroppedImage() {
    if (!cropCanvasRef.current || !selectedImageFile) {
      return null;
    }

    const canvas = cropCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const img = new Image();
    img.onload = () => {
      const size = 300;
      canvas.width = size;
      canvas.height = size;

      const scale = cropZoom;
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;

      // Draw centered and offset image
      const x = (size - scaledWidth) / 2 + cropOffsetX;
      const y = (size - scaledHeight) / 2 + cropOffsetY;

      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, size, size);

      // Draw circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      ctx.restore();
    };
    img.src = selectedImageUrl;

    return canvas;
  }

  async function handleCropConfirm() {
    if (!selectedImageFile || !cropCanvasRef.current) {
      setPhotoError("Please select an image first.");
      return;
    }

    getCroppedImage();

    setTimeout(async () => {
      try {
        cropCanvasRef.current.toBlob(async (blob) => {
          if (!blob) {
            setPhotoError("Failed to crop image.");
            return;
          }

          setCropDialogOpen(false);
          setPhotoUploading(true);
          setPhotoError("");
          setPhotoMessage("Uploading cropped image...");

          try {
            const croppedFile = new File([blob], "profile-avatar.jpg", { type: "image/jpeg" });
            const uploadedPhotoUrl = await uploadImageToCloudinary(croppedFile);

            if (!uploadedPhotoUrl) {
              throw new Error("Could not get image URL after upload.");
            }

            await updateCurrentUserPhotoURL(uploadedPhotoUrl);
            await updateUserProfile(user.uid, {
              photoURL: uploadedPhotoUrl,
              avatarUrl: uploadedPhotoUrl,
            });

            setProfile((currentProfile) => ({
              ...(currentProfile || {}),
              photoURL: uploadedPhotoUrl,
              avatarUrl: uploadedPhotoUrl,
            }));

            setUser((currentUser) => ({
              ...(currentUser || {}),
              photoURL: uploadedPhotoUrl,
            }));

            setPhotoMessage("Profile image updated successfully.");
            setSelectedImageFile(null);
            setSelectedImageUrl("");
          } catch (error) {
            setPhotoError(error?.message || "Unable to upload profile image.");
          } finally {
            setPhotoUploading(false);
          }
        }, "image/jpeg", 0.9);
      } catch (err) {
        console.error("Error creating blob:", err);
        setPhotoError("Failed to process cropped image.");
        setPhotoUploading(false);
      }
    }, 100);
  }

  async function uploadImageToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary config missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "library/profile-images");

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    let response;
    try {
      response = await fetch(url, { method: "POST", body: formData });
    } catch (networkErr) {
      console.error("Network error uploading image to Cloudinary:", networkErr);
      throw new Error("Network error while uploading image. Check your connection and try again.");
    }

    let payloadText = "";
    try {
      payloadText = await response.text();
      // Try parse JSON if possible
      const payload = payloadText ? JSON.parse(payloadText) : {};
      if (!response.ok) {
        console.error("Cloudinary upload error", response.status, payload);
        const msg = payload?.error?.message || payload?.message || `Upload failed with status ${response.status}`;
        throw new Error(msg);
      }
      return payload.secure_url || payload.url || "";
    } catch (err) {
      // If parsing failed or we already caught an error above, fall back to informative message
      if (err instanceof SyntaxError) {
        // response wasn't JSON
        console.error("Cloudinary upload returned non-JSON response:", payloadText);
        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
        return "";
      }
      throw err;
    }
  }

  async function handleProfilePhotoSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image size must be 5MB or less.");
      return;
    }

    if (!user?.uid) {
      setPhotoError("You must be logged in to upload a profile image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImageFile(file);
      setSelectedImageUrl(e.target?.result || "");
      setCropZoom(1);
      setCropOffsetX(0);
      setCropOffsetY(0);
      setCropDialogOpen(true);
      setPhotoError("");
      setPhotoMessage("");
    };
    reader.onerror = () => {
      setPhotoError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  }

  async function handleEditProfileSubmit(event) {
    event.preventDefault();
    if (!user?.uid) {
      setDialogError("You must be logged in to update your profile.");
      return;
    }

    const nextName = displayName.trim();
    if (!nextName) {
      setDialogError("Please enter your name.");
      return;
    }

    setSaving(true);
    setDialogError("");

    try {
      await updateCurrentUserDisplayName(nextName);
      await updateUserProfile(user.uid, {
        name: nextName,
        displayName: nextName,
        email: user.email || profile?.email || "",
        studentId: profile?.studentId || "",
        role: profile?.role || "member",
      });

      setProfile((currentProfile) => ({
        ...(currentProfile || {}),
        name: nextName,
        displayName: nextName,
      }));
      setDialogMessage("Profile updated successfully.");
      setTimeout(() => closeDialog(), 900);
    } catch (error) {
      setDialogError(error?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChangeSubmit(event) {
    event.preventDefault();
    if (!currentPassword || !newPassword) {
      setDialogError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setDialogError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    setDialogError("");

    try {
      await changeCurrentUserPassword(currentPassword, newPassword);
      setDialogMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => closeDialog(), 900);
    } catch (error) {
      setDialogError(error?.message || "Unable to change password.");
    } finally {
      setSaving(false);
    }
  }

  // Auto-redirect to login if no user after 5 seconds
  useEffect(() => {
    if (!loading && !user) {
      console.log("ProfilePage - No user after loading complete, will redirect in 5 seconds");
      const timer = setTimeout(() => {
        console.log("ProfilePage - Redirecting to login");
        navigate("/login", { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, user, navigate]);

  const currentIssued = Object.keys(borrowed || {}).length;
  const totalRead = transactions.filter((t) => t.action === "ISSUED").length;
  const returned = transactions.filter((t) => t.action === "RETURNED").length;

  // If still loading, show loading state
  if (loading) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-8 text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-blue-600" />
            <p className="mt-4 text-lg font-semibold text-blue-700">Loading your profile...</p>
          </div>
        </section>
      </SiteShell>
    );
  }

  // If no user is authenticated, show login message
  if (!user) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <i className="fas fa-lock text-4xl text-red-600" />
            <p className="mt-4 text-lg font-semibold text-red-700">You must be logged in to access your profile</p>
            <p className="mt-2 text-sm text-red-600 mb-6">Redirecting to login in a moment...</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <i className="fas fa-sign-in-alt" />
              Go to Login
            </button>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-600">Member Dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">My Profile</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Manage account details, check reading activity, and keep your library access secure.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-700"
          >
            <i className="fas fa-sign-out-alt" />
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="text-center">
              {currentPhotoUrl ? (
                <img
                  src={currentPhotoUrl}
                  alt="Profile"
                  className="mx-auto h-28 w-28 rounded-full object-cover shadow-xl shadow-blue-200/70"
                />
              ) : (
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-4xl text-white shadow-xl shadow-blue-200/70">
                  {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0) || "U")}
                </div>
              )}
              <h2 className="mt-5 text-2xl font-black text-slate-900">{profile?.displayName || user?.email || "Library User"}</h2>
              <p className="mt-1 text-sm text-slate-500">Member ID: {profile?.memberId || (user?.uid || "-")}</p>

              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoSelected}
                  className="hidden"
                />
                <canvas ref={cropCanvasRef} className="hidden" />
                <button
                  type="button"
                  onClick={triggerPhotoPicker}
                  disabled={photoUploading}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <i className="fas fa-camera" />
                  {photoUploading ? "Uploading..." : "Upload Photo"}
                </button>
                {photoError ? <p className="mt-2 text-xs font-semibold text-red-600">{photoError}</p> : null}
                {photoMessage ? <p className="mt-2 text-xs font-semibold text-emerald-600">{photoMessage}</p> : null}
              </div>
            </div>

            <div className="mt-8 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800">{user?.email || profile?.email || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Role</span>
                <span className="font-semibold text-emerald-600">{profile?.role || "Student Member"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">{profile?.status || "Active"}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button type="button" onClick={openEditDialog} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
                <i className="fas fa-edit mr-2" />
                Edit Profile
              </button>
              <button type="button" onClick={openPasswordDialog} className="w-full rounded-xl bg-slate-700 py-3 font-bold text-white transition hover:bg-slate-800">
                <i className="fas fa-lock mr-2" />
                Change Password
              </button>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Current Issued</p>
                <p className="mt-3 text-4xl font-black text-slate-900">{currentIssued}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Total Read</p>
                <p className="mt-3 text-4xl font-black text-slate-900">{totalRead}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Returned</p>
                <p className="mt-3 text-4xl font-black text-slate-900">{returned}</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Currently Issued Books</h3>
                <a href="/books" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800">Browse Books</a>
              </div>

              {borrowedDetails.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <i className="fas fa-inbox text-4xl text-slate-300" />
                  <p className="mt-4 text-lg font-semibold text-slate-700">No books currently issued</p>
                  <p className="mt-2 text-sm text-slate-500">When you issue books, they will appear here with due dates and status.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {borrowedDetails.map((b) => (
                    <div key={b.id} className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                      <div>
                        <div className="font-bold text-slate-900">{b.bookTitle}</div>
                        <div className="text-sm text-slate-500">Issued: {new Date(b.issuedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-700">Due: {new Date(b.dueDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {dialogType ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {dialogType === "edit" ? "Edit Profile" : "Change Password"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {dialogType === "edit"
                      ? "Update the name shown on your profile."
                      : "Use your current password to set a new one."}
                  </p>
                </div>
                <button type="button" onClick={closeDialog} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200">
                  Close
                </button>
              </div>

              {dialogError ? (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {dialogError}
                </div>
              ) : null}

              {dialogMessage ? (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {dialogMessage}
                </div>
              ) : null}

              {dialogType === "edit" ? (
                <form onSubmit={handleEditProfileSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Display Name</span>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white"
                      disabled={saving}
                    />
                  </label>

                  <div className="flex gap-3">
                    <button type="button" onClick={closeDialog} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200" disabled={saving}>
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</span>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                      disabled={saving}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">New Password</span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                      disabled={saving}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                      disabled={saving}
                    />
                  </label>

                  <div className="flex gap-3">
                    <button type="button" onClick={closeDialog} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200" disabled={saving}>
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving}>
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : null}

        {cropDialogOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-gradient-to-b from-slate-100 to-slate-200 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Crop Profile Photo</h3>
                  <p className="mt-1 text-sm text-slate-600">Drag the image to adjust. Your photo will be circular.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCropDialogOpen(false);
                    setSelectedImageFile(null);
                    setSelectedImageUrl("");
                    setCropOffsetX(0);
                    setCropOffsetY(0);
                  }}
                  className="rounded-full border-2 border-emerald-500 bg-white px-3 py-2 text-2xl font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  ✕
                </button>
              </div>

              {selectedImageUrl ? (
                <div className="space-y-6">
                  <div className="mx-auto flex flex-col items-center justify-center gap-6 lg:flex-row">
                    {/* Left zoom minus button */}
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      disabled={cropZoom <= 0.5 || photoUploading}
                      className="rounded-full bg-slate-700 px-4 py-4 text-2xl font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      −
                    </button>

                    {/* Circular crop preview */}
                    <div
                      ref={cropContainerRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="relative flex h-80 w-80 cursor-move items-center justify-center overflow-hidden rounded-full border-4 border-emerald-500 bg-slate-300 shadow-2xl"
                    >
                      <img
                        src={selectedImageUrl}
                        alt="Preview"
                        style={{
                          width: `${300 * cropZoom}px`,
                          height: "auto",
                          transform: `translate(${cropOffsetX}px, ${cropOffsetY}px)`,
                          userSelect: "none",
                        }}
                        className="pointer-events-none transition-transform"
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="text-center text-sm font-semibold text-white drop-shadow-lg">Drag to adjust</span>
                      </div>
                    </div>

                    {/* Right zoom plus button */}
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      disabled={cropZoom >= 3 || photoUploading}
                      className="rounded-full bg-slate-700 px-4 py-4 text-2xl font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Zoom percentage display and slider */}
                  <div className="mx-auto max-w-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Zoom: {Math.round(cropZoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={cropZoom}
                      onChange={handleCropZoomChange}
                      disabled={photoUploading}
                      className="w-full"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCropDialogOpen(false);
                        setSelectedImageFile(null);
                        setSelectedImageUrl("");
                        setCropOffsetX(0);
                        setCropOffsetY(0);
                      }}
                      className="rounded-full border-2 border-slate-400 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                      disabled={photoUploading}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleCropConfirm}
                      className="rounded-full border-2 border-emerald-500 bg-emerald-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={photoUploading}
                    >
                      <i className="fas fa-check mr-2" />
                      {photoUploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}
