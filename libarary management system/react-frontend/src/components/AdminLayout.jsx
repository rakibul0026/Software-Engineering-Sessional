import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: "fa-gauge-high", label: "Dashboard", path: "/admin-panel" },
  { icon: "fa-book-open", label: "Total Books", path: "/admin/total-books" },
  { icon: "fa-book-medical", label: "Add Books", path: "/admin/add-books" },
  { icon: "fa-book-reader", label: "Issue Books", path: "/admin/issue-books" },
  { icon: "fa-circle-question", label: "Question Bank", path: "/admin/question-bank" },
  { icon: "fa-file-lines", label: "Publication", path: "/admin/publication" },
  { icon: "fa-book", label: "E-book Section", path: "/admin/ebook-section" },
  { icon: "fa-user", label: "Members", path: "/admin/members" },
  { icon: "fa-lock", label: "Terms & Conditions", path: "/admin/terms" },
  { icon: "fa-gear", label: "Settings", path: "/admin/settings" },
];

function SidebarLink({ icon, label, path, active = false }) {
  return (
    <Link
      to={path}
      className={[
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-base font-medium transition",
        active
          ? "bg-[#4c3fd6] text-white shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
          : "text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <i className={["fas", icon, "w-5 text-center text-sm"].join(" ")} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

export default function AdminLayout({ title = "Product Management", children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const currentAdmin = useMemo(() => {
    if (typeof window === "undefined") {
      return { displayName: "Admin User", role: "Super Admin" };
    }

    try {
      const storedUser = JSON.parse(window.localStorage.getItem("cstuUser") || "null");
      const storedAdmin = JSON.parse(window.localStorage.getItem("adminUser") || "null");
      const user = storedUser || storedAdmin || {};
      const normalizedRole = normalizeRole(window.localStorage.getItem("cstuUserRole") || user.role);

      return {
        displayName: user.displayName || user.name || "Admin User",
        role: normalizedRole === "admin" ? "Admin" : "Super Admin",
      };
    } catch {
      return { displayName: "Admin User", role: "Super Admin" };
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("cstuLoggedIn") === "1";
    const role = window.localStorage.getItem("cstuUserRole");
    const normalizedRole = normalizeRole(role);

    if (isLoggedIn && (normalizedRole === "admin" || normalizedRole === "super_admin")) {
      setIsAuthorized(true);
      return;
    }

    setIsAuthorized(false);
    navigate("/login?error=Please%20login%20as%20admin%20to%20continue", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    window.localStorage.removeItem("cstuLoggedIn");
    window.localStorage.removeItem("cstuUserRole");
    window.localStorage.removeItem("cstuPendingRole");
    window.localStorage.removeItem("cstuUser");
    window.localStorage.removeItem("adminUser");
    window.localStorage.removeItem("adminUid");
    window.dispatchEvent(new Event("cstu-auth-changed"));
    navigate("/login");
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden text-slate-800">
      <div className="relative min-h-screen">
        <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),rgba(59,130,246,0.035)_38%,transparent_70%)]" />
        <div className="absolute -top-24 left-[-8rem] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-24 right-[-5rem] h-72 w-72 rounded-full bg-blue-500/08 blur-3xl" />

        <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 flex-col bg-[#35348f] text-white shadow-[0_12px_35px_rgba(19,24,62,0.25)] lg:flex">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <div className="grid gap-1">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#5cf4c9]" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#5b7cff]" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight">CSTU Admin</h1>
          </div>

          <nav className="flex-1 space-y-4 px-3 py-5">
            {sidebarItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/admin-panel" && location.pathname === "/admin");

              return (
                <SidebarLink
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  active={isActive}
                />
              );
            })}
          </nav>

          <div className="border-t border-white/10 px-5 py-6">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-[#f8b1b2] transition hover:bg-white/10"
            >
              <i className="fas fa-right-from-bracket text-sm" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden bg-transparent">
          <header className="flex items-center justify-between border-b border-white/60 bg-white/80 px-8 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <h2 className="text-2xl font-black tracking-tight text-slate-800">{title}</h2>
            <div className="relative flex items-center gap-4 text-right">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((value) => !value)}
                className="flex items-center gap-4 rounded-2xl px-2 py-2 text-left transition hover:bg-slate-100"
              >
                <div>
                  <p className="text-base font-bold leading-none text-slate-700">{currentAdmin.displayName}</p>
                  <p className="mt-1 text-sm text-slate-500">{currentAdmin.role}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4f46e5] text-xs font-bold text-white shadow-lg">
                  {(currentAdmin.displayName || "AD")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("") || "AD"}
                </div>
              </button>

              {profileMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <i className="fas fa-user-pen w-4 text-slate-500" />
                    Update profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <i className="fas fa-right-from-bracket w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </header>

          <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 lg:px-8">{children}</div>
        </main>
        </div>
      </div>
    </div>
  );
}