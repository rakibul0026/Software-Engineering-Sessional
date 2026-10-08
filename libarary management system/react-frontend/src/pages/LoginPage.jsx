import SiteShell from "../components/SiteShell";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginUser } from "../lib/authService";
import { adminLogin } from "../lib/adminAuthService";
import { hasFirebaseConfig } from "../lib/firebaseClient";

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    const errorMessage = params.get("error");
    const successMessage = params.get("success");
    const [error, setError] = useState(errorMessage || "");
    const [loading, setLoading] = useState(false);
    const [activeRole, setActiveRole] = useState(roleParam === "member" ? "member" : "admin");

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (successMessage && !errorMessage) {
            window.localStorage.setItem("cstuLoggedIn", "1");
            const pendingRole = window.localStorage.getItem("cstuPendingRole");
            if (pendingRole) {
                window.localStorage.setItem("cstuUserRole", pendingRole);
                window.localStorage.removeItem("cstuPendingRole");
            }
        }

        if (errorMessage) {
            window.localStorage.removeItem("cstuPendingRole");
        }
    }, [successMessage, errorMessage]);

    useEffect(() => {
        if (roleParam === "admin" || roleParam === "member") {
            setActiveRole(roleParam);
        }
    }, [roleParam]);

    const getFirebaseErrorMessage = (errorCode) => {
        const messages = {
            "auth/email-already-in-use": "This email is already registered. Please login instead.",
            "auth/invalid-email": "Please enter a valid email address.",
            "auth/weak-password": "Password must be at least 6 characters long.",
            "auth/user-not-found": "No account found with this email. Please sign up.",
            "auth/wrong-password": "Incorrect password. Please try again.",
            "auth/too-many-requests": "Too many login attempts. Please try again later.",
            "auth/operation-not-allowed": "Login is currently disabled. Please try again later.",
        };
        return messages[errorCode] || "Authentication failed. Please try again.";
    };

    const handleAuthSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        if (typeof window === "undefined") {
            return;
        }

        if (!hasFirebaseConfig) {
            setError("Firebase is not configured. Please contact the administrator.");
            setLoading(false);
            return;
        }

        const email = event.target.elements.email?.value;
        const password = event.target.elements.password?.value;

        if (!email || !password) {
            setError("Please enter email and password");
            setLoading(false);
            return;
        }

        try {
            if (activeRole === "admin") {
                const admin = await adminLogin(email, password);

                window.localStorage.setItem("adminUser", JSON.stringify(admin));
                window.localStorage.setItem("adminUid", admin.uid);
                window.localStorage.setItem("cstuUser", JSON.stringify(admin));
                window.localStorage.setItem("cstuLoggedIn", "1");
                window.localStorage.setItem("cstuUserRole", "admin");
                window.dispatchEvent(new Event("cstu-auth-changed"));

                navigate("/admin-panel", { state: { loginMessage: "Login successful!" } });
                setLoading(false);
                return;
            }

            await loginUser(email, password, activeRole);

            navigate("/");
        } catch (err) {
            const errorCode = err.code;
            if (errorCode) {
                setError(getFirebaseErrorMessage(errorCode));
            } else {
                setError(err.message || "Login failed. Please check your credentials.");
            }
            setLoading(false);
        }
    };

    return (
        <SiteShell>
            <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
                {error ? (
                    <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                ) : null}

                {successMessage ? (
                    <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                        {successMessage}
                    </div>
                ) : null}

                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                        Secure Access
                    </p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                        Login To CSTU Library Portal
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                        Choose your login option: Admin or Student.
                    </p>
                </div>

                <div className="mx-auto mb-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-3 shadow-[0_15px_40px_rgba(15,23,42,0.1)] backdrop-blur">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveRole("admin");
                            setError("");
                            navigate("/login?role=admin", { replace: true });
                        }}
                        className={[
                            "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider transition",
                            activeRole === "admin"
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        <i className="fas fa-user-shield" />
                        Admin Login
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveRole("member");
                            setError("");
                            navigate("/login?role=member", { replace: true });
                        }}
                        className={[
                            "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider transition",
                            activeRole === "member"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        <i className="fas fa-user-graduate" />
                        Student Login
                    </button>
                </div>

                <div className="mx-auto max-w-3xl">
                    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur">
                        <div className="mb-6 flex items-center gap-3">
                            <span
                                className={[
                                    "flex h-12 w-12 items-center justify-center rounded-2xl",
                                    activeRole === "admin"
                                        ? "bg-amber-100 text-amber-600"
                                        : "bg-blue-100 text-blue-600",
                                ].join(" ")}
                            >
                                <i className={activeRole === "admin" ? "fas fa-user-shield" : "fas fa-user-graduate"} />
                            </span>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    {activeRole === "admin" ? "Admin Login" : "Student Login"}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {activeRole === "admin"
                                        ? "For librarian and system admin access."
                                        : "For students and members of the library."}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                            <input type="hidden" name="role" value={activeRole} />

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder={activeRole === "admin" ? "admin@example.com" : "student@example.com"}
                                    className={[
                                        "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:bg-white",
                                        activeRole === "admin" ? "focus:border-amber-300" : "focus:border-blue-300",
                                    ].join(" ")}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className={[
                                        "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:bg-white",
                                        activeRole === "admin" ? "focus:border-amber-300" : "focus:border-blue-300",
                                    ].join(" ")}
                                />
                            </div>

                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                                <p className="font-bold text-slate-800">Forgotten password?</p>
                                <p className="mt-1 leading-6">
                                    Contact the library administrator to reset your account, or use the
                                    support email below if you need help regaining access.
                                </p>
                                <a
                                    href="mailto:info@ict.cstu.ac.bd?subject=Password%20reset%20request&body=Hello%2C%0A%0AI%20am%20requesting%20help%20with%20resetting%20my%20library%20account%20password."
                                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
                                >
                                    <i className="fas fa-envelope" />
                                    Request password support
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={[
                                    "inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-50",
                                    activeRole === "admin"
                                        ? "bg-amber-500 shadow-lg shadow-amber-200 hover:bg-amber-600"
                                        : "bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700",
                                ].join(" ")}
                            >
                                <i className={`fas fa-${loading ? "spinner fa-spin" : "sign-in-alt"}`} />
                                {loading
                                    ? "Logging in..."
                                    : activeRole === "admin"
                                    ? "Login As Admin"
                                    : "Login As Student"}
                            </button>
                        </form>

                        {activeRole === "member" ? (
                            <p className="mt-5 text-center text-sm text-slate-500">
                                New to the library?{" "}
                                <a href="/signup" className="font-bold text-blue-600 hover:underline">
                                    Create Student Account
                                </a>
                            </p>
                        ) : (
                            <p className="mt-5 text-center text-sm text-slate-500">
                                Admin signup is disabled. Please contact the system administrator for admin account access.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </SiteShell>
    );
}
