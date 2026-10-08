import { useEffect, useMemo, useState } from "react";
import SiteShell from "../components/SiteShell";
import { getAllBooks, issueBook, returnBook, getBookById } from "../lib/databaseService";

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

function getBadgeClass(available, quantity) {
  return available > 0 ? "bg-emerald-500" : "bg-rose-500";
}

function handleImageError(event) {
  event.currentTarget.src = "/images/front_img_cover.jpg";
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loadingIds, setLoadingIds] = useState({});
  const [selectedBookId, setSelectedBookId] = useState(null);

  const setLoadingFor = (id, value) => {
    setLoadingIds((prev) => ({ ...prev, [id]: value }));
  };

  const isLoadingFor = (id) => !!loadingIds[id];

  useEffect(() => {
    let isCancelled = false;

    getAllBooks()
      .then((initialBooks) => {
        if (!isCancelled) {
          setBooks(initialBooks);
          setIsLoaded(true);
          setError(null);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("Failed to load books:", err);
          setError("Failed to load books from database");
          setIsLoaded(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return books.filter((book) => {
      const status = book.available > 0 ? "Available" : "Issued";
      const statusMatch =
        statusFilter === "All" || status === statusFilter;
      const textMatch =
        q.length === 0 ||
        book.title?.toLowerCase().includes(q) ||
        book.author?.toLowerCase().includes(q) ||
        book.category?.toLowerCase().includes(q);

      return statusMatch && textMatch;
    });
  }, [books, query, statusFilter]);

  const getCurrentUser = () => {
    try {
      const userStr = window.localStorage.getItem("cstuUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const handleIssueBook = async (bookId) => {
    setMessage(null);
    setError(null);

    if (isLoadingFor(bookId)) {
      console.debug("Issue already in progress for", bookId);
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      if (!canIssueBooks()) {
        window.location.href = "/login";
        return;
      }
      setError("Please login to issue books");
      return;
    }

    setLoadingFor(bookId, true);
    try {
      console.debug("Issuing book", bookId);
      const result = await issueBook(bookId, user.uid, user.email);
      setMessage(result.message);

      // Reload books list
      const updatedBooks = await getAllBooks();
      setBooks(updatedBooks);
    } catch (err) {
      console.error("Error issuing book:", err);
      if (err && err.message && String(err.message).includes("Book is not available")) {
        try {
          const b = await getBookById(bookId);
          setError(
            `Book is not available (available: ${b?.available ?? "unknown"}, quantity: ${b?.quantity ?? "unknown"})`
          );
        } catch (inner) {
          setError(err.message || "Book is not available");
        }
      } else {
        setError(err.message || "Failed to issue book");
      }
    } finally {
      setLoadingFor(bookId, false);
    }
  };

  const handleReturnBook = async (bookId) => {
    setMessage(null);
    setError(null);

    if (isLoadingFor(bookId)) {
      console.debug("Return already in progress for", bookId);
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      setError("Please login to return books");
      return;
    }

    setLoadingFor(bookId, true);
    try {
      console.debug("Returning book", bookId);
      const result = await returnBook(bookId, user.uid, user.email);
      setMessage(result.message);

      // Reload books list
      const updatedBooks = await getAllBooks();
      setBooks(updatedBooks);
    } catch (err) {
      console.error("Error returning book:", err);
      setError(err.message || "Failed to return book");
    } finally {
      setLoadingFor(bookId, false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              Static Collection
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Explore Our Collection
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              When the book list is empty, this static catalog keeps the page useful
              with local covers and issue/return actions.
            </p>
          </div>

          <form
            className="mb-10"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <i className="fas fa-search pointer-events-none absolute left-4 top-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by title, author, or category..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-blue-300"
                />
              </div>
              <button
                type="submit"
                className="rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">
                  Categories
                </h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {[
                    "General",
                    "Engineering",
                    "Programming",
                    "Mathematics",
                    "Robotics",
                    "Data Science",
                    "Computer Science",
                  ].map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm"
                    >
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">
                  Status
                </h3>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="All">All Status</option>
                  <option>Available</option>
                  <option>Issued</option>
                </select>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5 text-slate-100 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-100/80">
                  Issue / Return System
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Available books show <span className="font-bold text-white">Issue Book</span>.
                  Books borrowed by you show <span className="font-bold text-white">Return Book</span>.
                  Books borrowed by others are locked.
                </p>
              </div>
            </aside>

            <main>
              {!isLoaded ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
                  Loading books from Firebase database...
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-600">
                  {error}
                </div>
              ) : null}
              {message ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-emerald-700">
                  ✓ {message}
                </div>
              ) : null}
              {isLoaded && !error ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Total Books: <span className="font-bold text-slate-900">{filteredBooks.length}</span>
                    </p>
                    <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 outline-none">
                      <option>Sort by: Newest</option>
                      <option>Sort by: A-Z</option>
                    </select>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredBooks.map((book) => {
                      const status = book.available > 0 ? "Available" : "Issued";
                      const canIssue = status === "Available" && canIssueBooks();

                      return (
                        <article
                          key={book.id}
                          onClick={() => setSelectedBookId((prev) => (prev === book.id ? null : book.id))}
                          className={[
                            "group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl",
                            selectedBookId === book.id ? "ring-2 ring-blue-200" : "",
                          ].join(" ")}
                        >
                          <div className="relative h-72 overflow-hidden bg-slate-100">
                            <img
                              src={book.imageUrl || "/images/front_img_cover.jpg"}
                              alt={book.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              onError={handleImageError}
                            />
                            <span
                              className={[
                                "absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-md",
                                getBadgeClass(book.available, book.quantity),
                              ].join(" ")}
                            >
                              {status}
                            </span>
                          </div>

                          <div className="space-y-4 p-5">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                                {book.category}
                              </p>
                              <h3 className="mt-2 text-xl font-black text-slate-950">
                                {book.title}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">By {book.author}</p>
                              <p className="mt-2 text-xs text-slate-400">ISBN: {book.isbn}</p>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                              <div className="mb-3 flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                  <span className="font-bold text-slate-700">{book.available}</span> / {book.quantity} available
                                </span>
                              </div>

                              {selectedBookId === book.id ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleIssueBook(book.id); }}
                                    disabled={!canIssue || isLoadingFor(book.id)}
                                    className={[
                                      "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white transition",
                                      canIssue && !isLoadingFor(book.id)
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : "cursor-not-allowed bg-slate-300",
                                    ].join(" ")}
                                  >
                                    <i className={`fas fa-${isLoadingFor(book.id) ? "spinner fa-spin" : "book-open"}`} />
                                    {isLoadingFor(book.id) ? "..." : "Issue"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleReturnBook(book.id); }}
                                    disabled={isLoadingFor(book.id)}
                                    className={[
                                      "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white transition",
                                      !isLoadingFor(book.id)
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "cursor-not-allowed bg-slate-300",
                                    ].join(" ")}
                                  >
                                      <i className={`fas fa-${isLoadingFor(book.id) ? "spinner fa-spin" : "undo"}`} />
                                      {isLoadingFor(book.id) ? "..." : "Return"}
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-3">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setSelectedBookId(book.id); }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                  >
                                    View actions
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </main>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}