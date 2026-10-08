import { useState } from "react";
import SiteShell from "../components/SiteShell";

const inquiryTypes = [
    "General Query",
    "Borrow / Return Issue",
    "Digital Library Access",
    "RFID System Help",
];

const initialFormState = {
    fullName: "",
    studentId: "",
    email: "",
    message: "",
};

function getApiBaseUrl() {
    const configured = (import.meta.env.VITE_API_BASE_URL || "").trim();
    if (configured) {
        return configured.replace(/\/$/, "");
    }

    if (typeof window === "undefined") {
        return "http://127.0.0.1:8000";
    }

    const host = window.location.hostname || "127.0.0.1";
    return `${window.location.protocol}//${host}:8000`;
}

export default function ContactPage() {
    const [selectedType, setSelectedType] = useState(inquiryTypes[0]);
    const [formData, setFormData] = useState(initialFormState);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState({ type: "", message: "" });

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setResult({ type: "", message: "" });

        try {
            const endpoint = `${getApiBaseUrl()}/api/contact-messages/`;
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: formData.fullName.trim(),
                    studentId: formData.studentId.trim(),
                    email: formData.email.trim(),
                    inquiryType: selectedType,
                    message: formData.message.trim(),
                }),
            });

            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(payload.detail || "Could not submit your message. Please try again.");
            }

            setResult({
                type: "success",
                message: "Your message has been sent successfully. Library support will contact you soon.",
            });
            setFormData(initialFormState);
            setSelectedType(inquiryTypes[0]);
        } catch (error) {
            const message = (error && error.message) || "";
            const isNetworkFailure = message.includes("Failed to fetch") || message.includes("NetworkError");
            setResult({
                type: "error",
                message: isNetworkFailure
                    ? "Cannot reach backend server. Start Django on http://127.0.0.1:8000 and check CORS settings."
                    : error?.message || "Could not submit your message. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <SiteShell>
            <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-24">
                <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
                    <div className="mb-10 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                            Contact Desk
                        </p>
                        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                            Get In Touch With Library Support
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                            Need account help, borrowing support, or catalog guidance? Reach us
                            quickly through the channels below.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <div className="space-y-5">
                            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                                <div className="bg-[linear-gradient(130deg,#0f172a_0%,#1d4ed8_65%,#38bdf8_100%)] p-6 text-white">
                                    <p className="text-xs uppercase tracking-[0.35em] text-blue-100/80">
                                        Librarian Profile
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black">Mamunur Rashid</h2>
                                    <p className="mt-1 text-sm text-blue-100/90">
                                        Senior Cataloguer, CSTU Library
                                    </p>
                                </div>

                                <div className="grid gap-6 p-6 sm:grid-cols-[170px_1fr]">
                                    <img
                                        src="/images/Mamunur-Rashid.jpeg"
                                        alt="Mamunur Rashid"
                                        className="h-44 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
                                    />

                                    <div>
                                        <p className="mb-3 text-sm italic text-slate-500">
                                            MA & BA in Information Science and Library Management (DU)
                                        </p>
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                                <i className="fas fa-user-check mr-1" /> Available
                                            </span>
                                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                                <i className="fas fa-language mr-1" /> Bangla & English
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-slate-600">
                                            <p>
                                                <i className="fas fa-envelope mr-2 text-blue-500" />
                                                mamunur.lib@cstu.ac.bd
                                            </p>
                                            <p>
                                                <i className="fas fa-phone-alt mr-2 text-blue-500" />
                                                +8801930257846
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-slate-950 p-6 text-slate-100 shadow-sm">
                                <h3 className="mb-4 text-lg font-bold">
                                    <i className="fas fa-business-time mr-2 text-blue-400" />
                                    Service Hours
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p className="text-slate-400">Sun - Thu</p>
                                    <p className="font-semibold">9:00 AM - 5:00 PM</p>
                                    <p className="text-slate-400">Friday</p>
                                    <p className="font-semibold">Closed</p>
                                    <p className="text-slate-400">Saturday</p>
                                    <p className="font-semibold">10:00 AM - 2:00 PM</p>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    <i className="fas fa-map-marker-alt mr-2 text-blue-600" />
                                    Campus Location
                                </h3>
                                <p className="text-sm leading-7 text-slate-600">
                                    Library, Academic Building - 1 (3rd Floor),
                                    <br />
                                    Holding No: 0937-02, Kholishaduli, Wapda Gate,
                                    <br />
                                    Cumilla Road, Chandpur Sadar, Chandpur-3600.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    <i className="fas fa-phone-alt mr-2 text-blue-600" />
                                    Quick Contact
                                </h3>
                                <div className="space-y-3 text-sm text-slate-600">
                                    <p>
                                        <i className="fas fa-envelope mr-2 text-blue-500" />
                                        info@ict.cstu.ac.bd
                                    </p>
                                    <p>
                                        <i className="fas fa-phone mr-2 text-blue-500" />
                                        +880 9678 123456
                                    </p>
                                    <p>
                                        <i className="fas fa-clock mr-2 text-blue-500" />
                                        Sun - Thu, 9:00 AM - 5:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                                <h2 className="text-2xl font-black text-slate-900">Send Us A Message</h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Fill out the form and our team will respond as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    {result.message ? (
                                        <div
                                            className={[
                                                "rounded-xl border px-4 py-3 text-sm font-medium",
                                                result.type === "success"
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-rose-200 bg-rose-50 text-rose-700",
                                            ].join(" ")}
                                        >
                                            {result.message}
                                        </div>
                                    ) : null}

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="Your Name"
                                                value={formData.fullName}
                                                onChange={handleFieldChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                                                Student ID
                                            </label>
                                            <input
                                                type="text"
                                                name="studentId"
                                                placeholder="CSTU-XXXX"
                                                value={formData.studentId}
                                                onChange={handleFieldChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="email@ict.cstu.ac.bd"
                                            value={formData.email}
                                            onChange={handleFieldChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
                                            Inquiry Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {inquiryTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setSelectedType(type)}
                                                    className={[
                                                        "rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
                                                        selectedType === type
                                                            ? "border-blue-600 bg-blue-600 text-white"
                                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                                                    ].join(" ")}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                        <input type="hidden" name="inquiry_type" value={selectedType} />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                                            Message
                                        </label>
                                        <textarea
                                            rows="5"
                                            name="message"
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={handleFieldChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                                    >
                                        <i className="fas fa-paper-plane" /> {submitting ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                                <h3 className="mb-3 font-bold text-slate-800">
                                    <i className="fas fa-map-marked-alt mr-2 text-blue-600" /> Find Us On Map
                                </h3>
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
                                    <iframe
                                        title="CSTU Library Map"
                                        src="https://www.google.com/maps?q=Chandpur%20Science%20and%20Technology%20University&output=embed"
                                        className="h-64 w-full"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteShell>
    );
}
