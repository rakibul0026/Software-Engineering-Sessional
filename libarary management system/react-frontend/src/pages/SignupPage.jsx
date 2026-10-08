import SiteShell from "../components/SiteShell";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../lib/authService";
import { createUserProfile } from "../lib/databaseService";

const inputBaseClass =
    "peer w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white";

function getBackendUrl(path) {
    if (typeof window === "undefined") {
        return path;
    }

    const host = window.location.hostname || "127.0.0.1";
    return `${window.location.protocol}//${host}:8000${path}`;
}

export default function SignupPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const signupAction = getBackendUrl("/signup");
    const [submitting, setSubmitting] = useState(false);
    const [localError, setLocalError] = useState(null);
    const params = new URLSearchParams(location.search);
    const errorMessage = params.get("error");

    async function handleSignup(e) {
        e.preventDefault();
        setLocalError(null);
        setSubmitting(true);

        try {
            const form = new FormData(e.target);
            const full_name = form.get("full_name")?.toString()?.trim();
            const username = form.get("username")?.toString()?.trim();
            const email = form.get("email")?.toString()?.trim();
            const password = (form.get("password")?.toString() || "").trim();
            const confirm = (form.get("confirm_password")?.toString() || "").trim();

            if (!full_name || !username || !email || !password) {
                setLocalError("Please fill all required fields.");
                setSubmitting(false);
                return;
            }

            if (password !== confirm) {
                setLocalError("Passwords do not match. Please re-type them.");
                setSubmitting(false);
                const pwInput = e.target.querySelector('input[name="password"]');
                if (pwInput) pwInput.focus();
                return;
            }

            // Sign up with Firebase Auth
            console.log("Starting Firebase signup for:", email);
            const userData = await signupUser(email, password, "member");
            console.log("Firebase signup successful, user UID:", userData?.uid);
            console.log("localStorage after signup:", {
                cstuUser: window.localStorage.getItem("cstuUser"),
                cstuLoggedIn: window.localStorage.getItem("cstuLoggedIn"),
                cstuUserRole: window.localStorage.getItem("cstuUserRole")
            });

            if (!userData?.uid) {
                throw new Error("No user ID returned from signup");
            }

            // Verify user was saved to localStorage
            const savedUser = window.localStorage.getItem("cstuUser");
            if (!savedUser) {
                throw new Error("User data was not saved to localStorage");
            }

            // Save profile to Realtime Database
            console.log("Saving user profile to database...");
            await createUserProfile(userData.uid, {
                name: full_name,
                email: email,
                studentId: username,
                role: "member",
                createdAt: new Date().toISOString(),
            });
            console.log("User profile saved successfully");

            // Redirect to login page after signup
            console.log("Redirecting to login page...");
            // Small delay to ensure data is saved
            setTimeout(() => {
                navigate("/login?success=Signup%20successful.%20Please%20log%20in%20with%20your%20credentials.", { replace: true });
            }, 500);
        } catch (err) {
            console.error("Signup failed:", err);
            const msg = err?.message || String(err) || "Signup failed";
            setLocalError(msg);
            setSubmitting(false);
        }
    }

    return (
        <SiteShell>
            <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 lg:px-8 lg:pb-24">
                {errorMessage ? (
                    <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                        Membership Portal
                    </p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                        Create Your Student Library Account
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                        Get instant access to borrowing, issue history, and ebook services with one profile.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <aside className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-[0_28px_75px_rgba(30,64,175,0.35)]">
                        <span className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
                            <i className="fas fa-user-plus" />
                        </span>

                        <h2 className="text-3xl font-black leading-tight">
                            Student
                            <br />
                            Registration
                        </h2>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-blue-100">
                            Use your institutional email and student ID to open your account.
                            Once approved, you can issue books and track returns from the dashboard.
                        </p>

                        <ul className="mt-8 space-y-4 text-sm">
                            <li className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <i className="fas fa-check" />
                                </span>
                                Borrow and return tracking
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <i className="fas fa-check" />
                                </span>
                                Ebook and question bank access
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <i className="fas fa-check" />
                                </span>
                                Profile and activity management
                            </li>
                        </ul>
                    </aside>

                    <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
                        <form onSubmit={(e) => handleSignup(e)} className="space-y-6">
                            <input type="hidden" name="role" value="member" />

                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Full Name
                                    </span>
                                    <span className="relative block">
                                        <i className="fas fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder="Mamunur Rashid"
                                            className={inputBaseClass}
                                            required
                                        />
                                    </span>
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Student ID
                                    </span>
                                    <span className="relative block">
                                        <i className="fas fa-id-card pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="2024-001"
                                            className={inputBaseClass}
                                            required
                                        />
                                    </span>
                                </label>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Institutional Email
                                </span>
                                <span className="relative block">
                                    <i className="fas fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="username@ict.cstu.ac.bd"
                                        className={inputBaseClass}
                                        required
                                    />
                                </span>
                            </label>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Password
                                    </span>
                                    <span className="relative block">
                                        <i className="fas fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            className={inputBaseClass}
                                            required
                                        />
                                    </span>
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Confirm Password
                                    </span>
                                    <span className="relative block">
                                        <i className="fas fa-shield-alt pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            placeholder="••••••••"
                                            className={inputBaseClass}
                                            required
                                        />
                                    </span>
                                </label>
                            </div>

                            <label className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                                />
                                <span>
                                    I agree to the {" "}
                                    <a href="/rules" className="font-bold text-blue-700 hover:underline">
                                        Library Code of Conduct
                                    </a>{" "}
                                    and 2026 Academic Policies.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-lg font-black text-white shadow-[0_14px_32px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-60"
                            >
                                {submitting ? "Registering..." : "Register Now"}
                                <i className="fas fa-arrow-right" />
                            </button>
                            {localError ? (
                                <div className="mt-3 rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 border border-rose-100">{localError}</div>
                            ) : null}
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600">
                            Already a member? {" "}
                            <a href="/login" className="font-bold text-blue-700 hover:underline">
                                Sign In here
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </SiteShell>
    );
}
