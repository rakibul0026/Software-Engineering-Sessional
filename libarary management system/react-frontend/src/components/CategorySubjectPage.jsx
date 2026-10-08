import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteShell from "./SiteShell";
import { issueBook, returnBook } from "../lib/databaseService";
import { hasFirebaseConfig } from "../lib/firebaseClient";

function canIssueBooks() {
  if (typeof window !== "undefined") {
    const frontendLogin = window.localStorage.getItem("cstuLoggedIn") === "1";
    if (frontendLogin) {
      return true;
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .some((entry) => entry.startsWith("sessionid=") || entry.startsWith("session="));
}

function getCurrentUser() {
  try {
    const raw = window.localStorage.getItem("cstuUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CategorySubjectPage({
  title,
  eyebrow,
  intro,
  heroImage,
  heroAlt,
  accentClass,
  countLabel,
  books,
}) {
  const categoryStorageKey = `cstuCategoryBooks:${title}`;

  const [categoryBooks, setCategoryBooks] = useState(() =>
    {
      const normalized = books.map((book, index) => ({
        ...book,
        id: book.id ?? index + 1,
        status: book.status ?? "Available",
        issuedBy: book.issuedBy ?? null,
      }));

      if (typeof window === "undefined") {
        return normalized;
      }

      const savedRaw = window.localStorage.getItem(categoryStorageKey);
      if (!savedRaw) {
        return normalized;
      }

      try {
        const saved = JSON.parse(savedRaw);
        if (!Array.isArray(saved)) {
          return normalized;
        }

        return normalized.map((book) => {
          const matched = saved.find((item) => item.title === book.title);
          return matched
            ? {
              ...book,
              status: matched.status === "Issued" ? "Issued" : "Available",
              issuedBy: matched.status === "Issued" ? (matched.issuedBy || "other") : null,
            }
            : book;
        });
      } catch {
        return normalized;
      }
    }
  );

  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const isBookLoading = (bookId) => loading[bookId] || false;
  const setBookLoading = (bookId, isLoading) => {
    setLoading((prev) => ({
      ...prev,
      [bookId]: isLoading,
    }));
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(categoryStorageKey, JSON.stringify(categoryBooks));
  }, [categoryBooks, categoryStorageKey]);

  const handleIssueBook = async (bookId) => {
    const book = categoryBooks.find((b) => b.id === bookId);
    if (!book) return;

    if (book.status !== "Available") {
      return;
    }

    const user = getCurrentUser();

    setBookLoading(bookId, true);
    setError(null);

    try {
      // Try Firebase if configured and user is available
      if (hasFirebaseConfig && user?.uid && user?.email) {
        console.log("Recording issue to Firebase for user:", user.uid);
        await issueBook(bookId, user.uid, user.email);
      } else if (!hasFirebaseConfig) {
        console.log("Using local-only mode (Firebase not configured)");
      } else {
        console.log("Using local-only mode (user not logged in or Firebase not ready)");
      }

      // Update local state
      setCategoryBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, status: "Issued", issuedBy: "self" } : b
        )
      );
    } catch (err) {
      console.error("Error issuing book:", err);
      setError(`Failed to issue book: ${err.message || "Unknown error"}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setBookLoading(bookId, false);
    }
  };

  const handleReturnBook = async (bookId) => {
    const book = categoryBooks.find((b) => b.id === bookId);
    if (!book || !(book.status === "Issued" && book.issuedBy === "self")) {
      return;
    }

    const user = getCurrentUser();

    setBookLoading(bookId, true);
    setError(null);

    try {
      // Try Firebase if configured and user is available
      if (hasFirebaseConfig && user?.uid && user?.email) {
        console.log("Recording return to Firebase for user:", user.uid);
        await returnBook(bookId, user.uid, user.email);
      } else if (!hasFirebaseConfig) {
        console.log("Using local-only mode (Firebase not configured)");
      } else {
        console.log("Using local-only mode (user not logged in or Firebase not ready)");
      }

      // Update local state
      setCategoryBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, status: "Available", issuedBy: null } : b
        )
      );
    } catch (err) {
      console.error("Error returning book:", err);
      setError(`Failed to return book: ${err.message || "Unknown error"}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setBookLoading(bookId, false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}
        
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className={["text-sm font-semibold uppercase tracking-[0.35em]", accentClass].join(" ")}>{eyebrow}</p>
              <h1 className="mt-4 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">{intro}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
                  {countLabel}
                </span>
                <Link
                  to="/books"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  Back to Books
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Focus</p>
                  <p className="mt-2 text-lg font-black text-slate-950">Curated study picks</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Format</p>
                  <p className="mt-2 text-lg font-black text-slate-950">Readable shelf view</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Access</p>
                  <p className="mt-2 text-lg font-black text-slate-950">Open from one page</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] bg-slate-100 lg:min-h-[520px]">
              <img src={heroImage} alt={heroAlt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categoryBooks.map((book) => (
            <article
              key={`${book.id}-${book.title}`}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-slate-700 backdrop-blur">
                  {book.tag}
                </span>
                <span
                  className={[
                    "absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-white",
                    book.status === "Available" ? "bg-emerald-500" : "bg-rose-500",
                  ].join(" ")}
                >
                  {book.status}
                </span>
              </div>
              <div className="space-y-3 p-5">
                <p className={['text-xs font-bold uppercase tracking-[0.3em]', accentClass].join(' ')}>{book.meta}</p>
                <h2 className="text-xl font-black text-slate-950">{book.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{book.description}</p>

                <div className="border-t border-slate-100 pt-3">
                  {book.status === "Issued" && book.issuedBy === "other" ? (
                    <p className="mb-3 text-xs font-semibold text-slate-500">Issued by another user</p>
                  ) : (
                    <p className="mb-3 text-xs font-semibold text-slate-500">
                      {book.status === "Available" ? "Ready to issue" : "Issued by you"}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleIssueBook(book.id)}
                      disabled={book.status !== "Available" || isBookLoading(book.id)}
                      className={[
                        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white transition",
                        book.status === "Available" && !isBookLoading(book.id)
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "cursor-not-allowed bg-slate-300",
                      ].join(" ")}
                    >
                      {isBookLoading(book.id) ? (
                        <i className="fas fa-spinner fa-spin" />
                      ) : (
                        <i className="fas fa-book-open" />
                      )}
                      Issue
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReturnBook(book.id)}
                      disabled={!(book.status === "Issued" && book.issuedBy === "self") || isBookLoading(book.id)}
                      className={[
                        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white transition",
                        book.status === "Issued" && book.issuedBy === "self" && !isBookLoading(book.id)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "cursor-not-allowed bg-slate-300",
                      ].join(" ")}
                    >
                      {isBookLoading(book.id) ? (
                        <i className="fas fa-spinner fa-spin" />
                      ) : (
                        <i className="fas fa-undo" />
                      )}
                      Return
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}