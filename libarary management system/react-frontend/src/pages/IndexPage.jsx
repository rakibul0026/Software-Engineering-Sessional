import SiteShell from "../components/SiteShell";

export default function IndexPage() {
  return (
    <SiteShell>
      <header className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Academic resources for CSTU
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">A clearer library experience for study, research, and discovery.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Access textbooks, e-books, question banks, and curated research materials through a cleaner portal designed to help CSTU students move faster.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="/books" className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-slate-300/60 transition hover:-translate-y-0.5 hover:bg-slate-800"><i className="fas fa-search" /> Browse Collections</a>
              <a href="/contact" className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950">Contact Library</a>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-3xl font-black text-slate-950">4+</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Total Categories</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-3xl font-black text-slate-950">18+</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Total Books</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-3xl font-black text-slate-950">350</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Active Students</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
              <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] p-8 text-white">
                <div className="flex items-center justify-between text-sm text-blue-100">
                  <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Featured access</span>
                  <span className="font-medium">CSTU Central Library</span>
                </div>
                <div className="mt-8 space-y-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-blue-100/80">Now live</p>
                  <h2 className="text-3xl font-black tracking-tight">Everything students need, in one calm interface.</h2>
                  <p className="max-w-md text-base leading-7 text-blue-50/90">Navigate by category, jump into reading, or manage your account without fighting the UI.</p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-100/70">Fast search</p>
                    <p className="mt-2 text-lg font-semibold">Find books quickly</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-100/70">Smart access</p>
                    <p className="mt-2 text-lg font-semibold">Login, profile, admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        <div className="mb-8 text-center sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Browse by category</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Find resources tailored to each subject area</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">The collection cards are designed to be lighter, cleaner, and easier to scan at a glance.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Fiction",
              count: "7 Books Available",
              src: "/assets/images/Fiction/book/pinterest-murakami.webp",
              href: "/category/fiction",
            },
            {
              title: "Science & Tech",
              count: "5 Books Available",
              src: "/images/Leonardo-ScienceTech_Cover.jpg",
              href: "/category/science-tech",
            },
            {
              title: "Business",
              count: "3 Books Available",
              src: "/assets/images/Business/book/lviv-ukraine-february-20-2025-260nw-2597958335.webp",
              href: "/category/business",
            },
            {
              title: "History",
              count: "3 Books Available",
              src: "/assets/images/history/book/attachment_62255190.jpeg",
              href: "/category/history",
            },
          ].map(({ title, count, src, href }) => (
            <div key={title} className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
              <img src={src} className="h-72 w-full object-cover" alt={title} />
              <div className="space-y-4 p-6 text-center">
                <h4 className="text-2xl font-bold text-slate-950">{title}</h4>
                <p className="text-sm font-semibold text-blue-600">{count}</p>
                <a href={href} className="inline-flex w-full items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white">View Collection</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}