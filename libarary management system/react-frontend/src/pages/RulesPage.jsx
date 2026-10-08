import { useMemo, useState } from "react";
import SiteShell from "../components/SiteShell";


const ruleSections = [
    {
        id: "conduct",
        title: "General Conduct",
        icon: "fas fa-volume-off",
        severity: "high",
        intro:
            "Maintain a focused academic environment for everyone in the library.",
        items: [
            "Maintain complete silence inside the library premises.",
            "Keep mobile phones on silent mode and avoid calls in reading zones.",
            "Eating, smoking, and non-water drinks are not permitted.",
            "Use designated locker spaces for personal belongings.",
        ],
    },
    {
        id: "rfid",
        title: "RFID Issuing System",
        icon: "fas fa-microchip",
        severity: "medium",
        intro:
            "Borrowing and returning books must be completed through your own account.",
        items: [
            "Use only your own account for issuing and returning books.",
            "Maximum 3 physical books can be borrowed at one time.",
            "Standard issuing period is 14 days from issue date.",
            "Confirm the screen shows Success before leaving with a book.",
        ],
    },
    {
        id: "penalty",
        title: "Fine & Penalty Policy",
        icon: "fas fa-gavel",
        severity: "high",
        intro:
            "Late returns and misuse reduce resource availability for other students.",
        items: [
            "Overdue books: BDT 10 per day after 14 days.",
            "Damaged pages/markings: full replacement value.",
            "Lost books: original price plus 20% penalty.",
            "Account sharing: account suspension up to 30 days.",
        ],
    },
    {
        id: "support",
        title: "Help & Support",
        icon: "fas fa-headset",
        severity: "low",
        intro:
            "Reach out quickly if you need library assistance or report issues.",
        items: [
            "Contact the front desk for lost items or urgent support.",
            "Use official email for account and access-related issues.",
            "Mention your student ID in all support communication.",
            "Follow librarian instructions during system maintenance periods.",
        ],
    },
];

const severityStyles = {
    high: "bg-rose-100 text-rose-700 border-rose-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function RulesPage() {
    const [query, setQuery] = useState("");
    const [activeSeverity, setActiveSeverity] = useState("all");
    const [expanded, setExpanded] = useState(() =>
        Object.fromEntries(ruleSections.map((section) => [section.id, true]))
    );

    const filteredSections = useMemo(() => {
        const text = query.trim().toLowerCase();

        return ruleSections.filter((section) => {
            const severityMatch =
                activeSeverity === "all" || section.severity === activeSeverity;

            const textMatch =
                text.length === 0 ||
                section.title.toLowerCase().includes(text) ||
                section.items.some((item) => item.toLowerCase().includes(text));

            return severityMatch && textMatch;
        });
    }, [activeSeverity, query]);

    const toggleCard = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <SiteShell>
            <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
                <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
                    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                                Policy Center
                            </p>
                            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                                Interactive Rules & Regulations
                            </h1>
                            <p className="mt-3 max-w-2xl text-slate-600">
                                Explore, filter, and review library policies with a clearer,
                                interactive experience.
                            </p>
                        </div>

                        <a
                            href="mailto:library@cstu.ac.bd"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                        >
                            <i className="fas fa-envelope" />
                            Contact Library Support
                        </a>
                    </div>

                    <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto]">
                        <div className="relative">
                            <i className="fas fa-search pointer-events-none absolute left-4 top-4 text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                type="text"
                                placeholder="Search a rule, keyword, or topic..."
                                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-blue-300"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {[
                                ["all", "All"],
                                ["high", "High Priority"],
                                ["medium", "Important"],
                                ["low", "General"],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setActiveSeverity(value)}
                                    className={[
                                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                        activeSeverity === value
                                            ? "border-slate-900 bg-slate-900 text-white"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                                    ].join(" ")}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-5">
                        {filteredSections.map((section, index) => (
                            <article
                                key={section.id}
                                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleCard(section.id)}
                                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <i className={section.icon} />
                                        </span>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-black text-slate-900">
                                                    {index + 1}. {section.title}
                                                </h2>
                                                <span
                                                    className={[
                                                        "rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                                                        severityStyles[section.severity],
                                                    ].join(" ")}
                                                >
                                                    {section.severity}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-600">{section.intro}</p>
                                        </div>
                                    </div>

                                    <i
                                        className={[
                                            "fas fa-chevron-down text-slate-400 transition-transform",
                                            expanded[section.id] ? "rotate-180" : "",
                                        ].join(" ")}
                                    />
                                </button>

                                {expanded[section.id] ? (
                                    <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                                        <ul className="grid gap-3">
                                            {section.items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-slate-700"
                                                >
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </article>
                        ))}

                        {filteredSections.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                <p className="text-slate-600">
                                    No matching rules found for your current filters.
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        </SiteShell>
    );
}
