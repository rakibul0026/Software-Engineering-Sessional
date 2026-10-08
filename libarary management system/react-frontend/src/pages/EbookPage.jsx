import { useState, useMemo } from "react";
import SiteShell from "../components/SiteShell";

function getPdfUrl(filePath) {
  if (!filePath) {
    return "#";
  }

  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  return encodeURI(filePath);
}

const featuredEbooks = [
  {
    title: "Accounting Principles Thirteenth Edition",
    author: "Library Upload",
    file: "/assets/pdf/Accounting_Principles_Thirteenth_Edition (1)_removed_removed (1).pdf",
  },
  {
    title: "Computer Organization and Architecture 10th",
    author: "Library Upload",
    file: "/assets/pdf/Computer Organization and Architecture 10th.pdf",
  },
  {
    title: "Data Communications and Networking with TCP/IP",
    author: "Behrouz A. Forouzan",
    file: "/assets/pdf/Data_Communications_and_Networking_with_TCPIP_Protocol_Suite_(Behrouz_A._Forouzan)_(2022)[1].pdf",
  },
  {
    title: "Python Programming",
    author: "John Smith",
    file: "/assets/pdf/Python Programming  By John Smith .pdf",
  },
  {
    title: "Software Engineering: A Practitioner's Approach",
    author: "R. Pressman, B. Maxim",
    file: "/assets/pdf/Software Engineering_ A Practitioner's Approach (9th Ed) - R. Pressman, B. Maxim.pdf",
  },
  {
    title: "Assembly Language",
    author: "Ytha Yu, Charles Marut",
    file: "/assets/pdf/Ytha_Yu_Charles_Marut_Assembly_Language.pdf",
  },
];

export default function EbookPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter ebooks based on search query
  const filteredEbooks = useMemo(() => {
    if (!searchQuery.trim()) {
      return featuredEbooks;
    }

    const query = searchQuery.toLowerCase().trim();
    return featuredEbooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <SiteShell>
      <header className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Digital collection
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">Digital E-Book Collection</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Access academic resources and textbooks anytime, anywhere with the same calm library interface used across the rest of the portal.</p>
            <div className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by book name or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-white/70 bg-white px-6 py-4 pl-12 text-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-slate-400 focus:border-blue-300"
                />
                <span className="absolute left-5 top-4 text-slate-400">🔍</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-blue-400/10 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur">
              <div className="flex items-start justify-between gap-4 rounded-[1.5rem] bg-slate-950 p-8 text-white">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-blue-100/80">E-book access</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">Read from any device.</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-blue-50/90">Search digital titles, browse by subject, and move straight into study mode.</p>
                </div>
                <div className="hidden rounded-3xl bg-white/10 px-5 py-4 text-right md:block">
                  <p className="text-3xl font-black">PDF</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-100/70">Library files</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Quick action</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Browse physical books</p>
                  <a href="/books" className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">Open collection</a>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Guidance</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">PDF files are uploaded by the library team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-16 lg:px-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-900">Available E-Books</h2>
            {searchQuery && (
              <span className="text-sm font-semibold text-slate-600">
                {filteredEbooks.length} result{filteredEbooks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {filteredEbooks.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {filteredEbooks.map((book) => (
                <article
                  key={book.title}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{book.title}</h3>
                    <p className="text-sm font-semibold text-blue-600">By {book.author}</p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={getPdfUrl(book.file)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      <i className="fas fa-book-open" />
                      Open PDF
                    </a>
                    <a
                      href={getPdfUrl(book.file)}
                      download
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      <i className="fas fa-download" />
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-600">No e-books found</p>
              <p className="mt-2 text-sm text-slate-500">Try searching with different keywords.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="text-6xl">📚</div>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">More Ebooks Coming Soon</h2>
          <p className="mt-2 text-slate-500">New PDF files will be uploaded by the library team regularly.</p>
          <a href="/books" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Browse Physical Books</a>
        </div>
      </main>
    </SiteShell>
  );
}