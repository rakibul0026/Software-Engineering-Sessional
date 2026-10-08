import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { updateCurrentUserDisplayName } from "../lib/authService";

export default function AdminSettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const adminProfile = useMemo(() => {
    if (typeof window === "undefined") {
      return { displayName: "Admin User", email: "admin@cstu.edu" };
    }

    try {
      const storedUser = JSON.parse(window.localStorage.getItem("cstuUser") || "null");
      const storedAdmin = JSON.parse(window.localStorage.getItem("adminUser") || "null");
      const user = storedUser || storedAdmin || {};

      return {
        displayName: user.displayName || user.name || "Admin User",
        email: user.email || "admin@cstu.edu",
      };
    } catch {
      return { displayName: "Admin User", email: "admin@cstu.edu" };
    }
  }, []);

  useEffect(() => {
    setDisplayName(adminProfile.displayName);
    setEmail(adminProfile.email);
  }, [adminProfile.displayName, adminProfile.email]);

  const handleSaveProfile = async () => {
    setError("");
    setMessage("");

    if (!displayName.trim()) {
      setError("Please enter an admin name.");
      return;
    }

    setSaving(true);

    try {
      const storedUser = JSON.parse(window.localStorage.getItem("cstuUser") || "null") || {};
      const updatedUser = {
        ...storedUser,
        displayName: displayName.trim(),
        email: email.trim(),
      };

      window.localStorage.setItem("cstuUser", JSON.stringify(updatedUser));

      const storedAdmin = JSON.parse(window.localStorage.getItem("adminUser") || "null") || {};
      window.localStorage.setItem(
        "adminUser",
        JSON.stringify({
          ...storedAdmin,
          ...updatedUser,
        })
      );

      if (storedUser?.uid) {
        try {
          await updateCurrentUserDisplayName(displayName.trim());
        } catch {
          // Keep the local profile update even if Firebase Auth is unavailable.
        }
      }

      window.dispatchEvent(new Event("cstu-auth-changed"));
      setMessage("Admin profile updated successfully.");
    } catch (err) {
      setError(err?.message || "Failed to update admin profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <h3 className="text-2xl font-bold text-slate-700">General Settings</h3>
          <div className="mt-6 space-y-4 text-lg text-slate-600">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span>Enable Issue Notifications</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span>Allow Student Self Request</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <h3 className="text-2xl font-bold text-slate-700">Admin Profile</h3>
          <div className="mt-6 space-y-4">
            {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div> : null}
            {message ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</div> : null}
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none focus:border-[#4f46e5]"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Admin name"
              disabled={saving}
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none focus:border-[#4f46e5]"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              disabled={saving}
            />
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-xl bg-[#4f46e5] px-5 py-3 text-lg font-bold text-white transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
