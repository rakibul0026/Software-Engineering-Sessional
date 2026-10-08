import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  ["/", "Home"],
  ["/books", "Books"],
  ["/category", "Category"],
  ["/ebook", "E-books"],
  ["/question_bank", "Question bank"],
  ["/publication", "Publication"],
  ["/contact", "Contact"],
  ["/about", "About"],
  ["/rules", "Rules"],
];

function hasSessionCookie() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .some((entry) => entry.startsWith("sessionid=") || entry.startsWith("session="));
}

function hasFrontendLoginState() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem("cstuLoggedIn") === "1";
}

export default function SiteShell({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => hasSessionCookie() || hasFrontendLoginState());

  useEffect(() => {
    if (location.pathname === "/profile") {
      window.localStorage.setItem("cstuLoggedIn", "1");
      setIsLoggedIn(true);
    }

    const refreshAuthState = () => {
      setIsLoggedIn(hasSessionCookie() || hasFrontendLoginState());
    };

    refreshAuthState();
    window.addEventListener("focus", refreshAuthState);
    window.addEventListener("pageshow", refreshAuthState);
    window.addEventListener("cstu-auth-changed", refreshAuthState);

    const intervalId = window.setInterval(refreshAuthState, 2000);

    return () => {
      window.removeEventListener("focus", refreshAuthState);
      window.removeEventListener("pageshow", refreshAuthState);
      window.removeEventListener("cstu-auth-changed", refreshAuthState);
      window.clearInterval(intervalId);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-hidden text-slate-900">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),rgba(59,130,246,0.06)_38%,transparent_70%)]" />
        <div className="absolute -top-24 left-[-8rem] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-28 right-[-5rem] h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

        <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <Link to="/" className="group flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-900/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xl text-white shadow-lg shadow-blue-200/70">🏛️</span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">CSTU</span>
                <span className="text-lg font-black tracking-tight text-slate-900">Library Portal</span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 p-2 text-sm shadow-sm">
              {navLinks.map(([href, label]) => {
                const isActive = location.pathname === href;

                return (
                  <Link
                    key={href}
                    to={href}
                    className={[
                      "rounded-full px-4 py-2 font-semibold transition",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                );
              })}

            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600"
                  >
                    <i className="fas fa-user" />
                    Profile
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        <div className="relative z-10">{children}</div>

        <footer className="mt-10 bg-slate-950 px-4 py-16 text-slate-300 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h3 className="mb-5 border-l-4 border-blue-500 pl-4 text-lg font-bold uppercase tracking-[0.28em] text-white">About Us</h3>
              <p className="mb-6 max-w-md text-sm leading-7 text-slate-400">The University Library serves as the academic hub of Chandpur Science and Technology University, providing resources and services to support learning, teaching, and research.</p>
            </div>

            <div>
              <h3 className="mb-5 border-l-4 border-blue-500 pl-4 text-lg font-bold uppercase tracking-[0.28em] text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/" className="flex items-center gap-2 text-slate-400 transition hover:text-white"><i className="fas fa-chevron-right text-[10px]" /> Home</a></li>
                <li><a href="/about" className="flex items-center gap-2 text-slate-400 transition hover:text-white"><i className="fas fa-chevron-right text-[10px]" /> About</a></li>
                <li><a href="/books" className="flex items-center gap-2 text-slate-400 transition hover:text-white"><i className="fas fa-chevron-right text-[10px]" /> Books</a></li>
                <li><a href="/category" className="flex items-center gap-2 text-slate-400 transition hover:text-white"><i className="fas fa-chevron-right text-[10px]" /> Categories</a></li>
                <li><a href="/contact" className="flex items-center gap-2 text-slate-400 transition hover:text-white"><i className="fas fa-chevron-right text-[10px]" /> Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-5 border-l-4 border-blue-500 pl-4 text-lg font-bold uppercase tracking-[0.28em] text-white">Contact Us</h3>
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4"><i className="fas fa-map-marker-alt mt-1 text-lg text-blue-400" /><p className="leading-relaxed text-slate-400">Chandpur Science and Technology University.<br />Kholishaduli, Wapda Gate, Chandpur-3600.</p></div>
                <div className="flex items-center gap-4"><i className="fas fa-envelope text-lg text-blue-400" /><a href="mailto:info@ict.cstu.ac.bd" className="text-slate-400 transition hover:text-white">info@ict.cstu.ac.bd</a></div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-center text-xs uppercase tracking-[0.35em] text-slate-500">&copy; 2026 CSTU Library. All Rights Reserved.</div>
        </footer>
      </div>
    </div>
  );
}