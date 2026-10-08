import SiteShell from "../components/SiteShell";

const facultyAuthors = [
  {
    name: "Md. Jahidul Islam",
    role: "Researcher",
    image: "/assets/images/jahidul_islam.png",
  },
  {
    name: "Mujahidul",
    role: "Researcher",
    image: "/assets/images/mujahidul.png",
  },
  {
    name: "Prince Mahmud",
    role: "Researcher",
    image: "/assets/images/Prince_Mahmud.jpg",
  },
  {
    name: "Nazim Uddin",
    role: "Researcher",
    image: "/assets/images/Nazim Uddin.png",
  },
];

const journalPublications = [
  {
    title: "Genetic Optimization-Based Layers Tuning And Freezing In Deep CNN For Low-Cost Disease Detection Using Chest X-Rays",
    venue: "SN Computer Science",
    year: "2025",
    link: "https://doi.org/10.1007/s42979-025-04094-y",
  },
  {
    title: "AI-Assisted Smart Library Recommendation for Academic Resources",
    venue: "Journal of Educational Technology",
    year: "2024",
    link: "#",
  },
];

const conferencePublications = [
  {
    title: "RFID-Enabled Automated Book Tracking for University Libraries",
    venue: "International Conference on Smart Campus Systems",
    year: "2025",
    link: "#",
  },
  {
    title: "Student-Centric E-Book Access Analytics in Higher Education",
    venue: "IEEE Conference on Data and Learning Technologies",
    year: "2024",
    link: "#",
  },
];

export default function PublicationPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-600">Research & Publications</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Faculty Publications</h1>
          <p className="mt-3 max-w-3xl text-slate-600">Meet our faculty contributors and explore publication highlights from CSTU library research activities.</p>
        </div>

        <div className="mb-12 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Research Rules & Regulations (2025)</h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  Eligibility, budget limits, publication requirements, and project timeline guidance for faculty research proposals.
                </p>
              </div>
              <a
                href="https://drive.google.com/file/d/1CEmiqBhB8xm5M8EhfvDHGyXuyw0GegZY/view"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <i className="fas fa-file-alt" />
                View Full Rules
              </a>
            </div>
          </div>

          <h2 className="mb-6 text-2xl font-black text-slate-900">Meet Our Faculty Authors</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facultyAuthors.map((author) => (
              <article key={author.name} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <img
                  src={author.image}
                  alt={author.name}
                  className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-blue-100"
                />
                <h3 className="mt-4 text-lg font-bold text-slate-900">{author.name}</h3>
                <p className="text-sm font-semibold text-blue-600">{author.role}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur">
            <h2 className="text-2xl font-black text-slate-900">Journal Publications</h2>
            <div className="mt-5 space-y-4">
              {journalPublications.map((paper) => (
                <article key={paper.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Journal • {paper.year}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{paper.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{paper.venue}</p>
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                  >
                    <i className="fas fa-external-link-alt" />
                    View Journal Paper
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur">
            <h2 className="text-2xl font-black text-slate-900">Conference Publications</h2>
            <div className="mt-5 space-y-4">
              {conferencePublications.map((paper) => (
                <article key={paper.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Conference • {paper.year}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{paper.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{paper.venue}</p>
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:underline"
                  >
                    <i className="fas fa-external-link-alt" />
                    View Conference Paper
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
