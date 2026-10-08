import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getLibraryBooks, saveLibraryBooks } from "../lib/libraryBooksStore";

const bookCategories = [
    "Computer Science",
    "Programming",
    "Database",
    "Mathematics",
    "Physics",
    "Literature",
];

const initialEbooks = [
    { id: 1, title: "Android App Development", author: "Google Press", status: "Available" },
    { id: 2, title: "AI Essentials", author: "Open Learning", status: "Available" },
];

function nextId(items) {
    return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function StatusBadge({ status }) {
    const className = status === "Available" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

    return <span className={["rounded-full px-4 py-2 text-sm font-bold", className].join(" ")}>{status}</span>;
}

function DashboardCard({ label, value, valueClassName = "text-slate-900" }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className={[
                "mt-2 text-3xl font-black leading-none",
                valueClassName,
            ].join(" ")}>{value}</p>
        </div>
    );
}

function BookForm({ onSubmit, editingBook, onCancelEdit }) {
    const [form, setForm] = useState(
        editingBook || {
            title: "",
            author: "",
            category: bookCategories[0],
            status: "Available",
        }
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
        if (!editingBook) {
            setForm({ title: "", author: "", category: bookCategories[0], status: "Available" });
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
                    <i className="fas fa-plus" />
                </span>
                <h2 className="text-lg font-bold text-slate-700">Add New Book</h2>
            </div>

            <form className="grid gap-6 px-6 py-6 lg:grid-cols-3" onSubmit={handleSubmit}>
                <div className="lg:col-span-2">
                    <label className="mb-3 block text-sm font-semibold text-slate-600">Book Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="e.g. Introduction to Algorithms"
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-600">Author</label>
                    <input
                        type="text"
                        value={form.author}
                        onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-600">Category</label>
                    <select
                        value={form.category}
                        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                    >
                        <option value="">Select Category</option>
                        {bookCategories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-600">Status</label>
                    <select
                        value={form.status}
                        onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                    >
                        <option value="Available">Available</option>
                        <option value="Issued">Issued</option>
                    </select>
                </div>

                <div className="flex items-end gap-4">
                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-[#4f46e5] px-6 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(79,70,229,0.3)] transition hover:bg-[#4338ca]"
                    >
                        {editingBook ? "Update Book" : "Add Book"}
                    </button>
                    {editingBook ? (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="rounded-2xl border border-slate-300 px-5 py-4 text-lg font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    ) : null}
                </div>
            </form>
        </div>
    );
}

function ResourceUploadCard({ title, buttonLabel, icon, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
                    <i className={["fas", icon].join(" ")} />
                </span>
                <h3 className="text-lg font-bold text-slate-700">{title}</h3>
            </div>
            <div className="mt-5 space-y-4">{children}</div>
            <button
                type="button"
                className="mt-5 rounded-2xl bg-[#4f46e5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4338ca]"
            >
                {buttonLabel}
            </button>
        </div>
    );
}

export default function AdminPage() {
    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [ebooks, setEbooks] = useState(initialEbooks);
    const [editingBook, setEditingBook] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        let isCancelled = false;

        getLibraryBooks().then((initialBooks) => {
            if (!isCancelled) {
                setBooks(initialBooks);
                setIsLoaded(true);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            void saveLibraryBooks(books);
        }
    }, [books, isLoaded]);

    const bannerMessage = location.state?.loginMessage || "Login successful!";

    const stats = useMemo(() => {
        const availableBooks = books.filter((book) => book.status === "Available").length;
        const issuedBooks = books.filter((book) => book.status === "Issued").length;

        return {
            totalBooks: books.length + ebooks.length,
            availableBooks,
            issuedBooks,
            totalUsers: 5,
        };
    }, [books, ebooks]);

    const filteredBooks = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return books;
        }

        return books.filter((book) =>
            book.title.toLowerCase().includes(query)
            || book.author.toLowerCase().includes(query)
            || book.category.toLowerCase().includes(query)
            || book.status.toLowerCase().includes(query)
            || String(book.id).includes(query)
        );
    }, [books, searchQuery]);

    const handleSaveBook = (form) => {
        if (editingBook) {
            setBooks((prev) =>
                prev.map((book) =>
                    book.id === editingBook.id
                        ? { ...book, ...form }
                        : book
                )
            );
            setEditingBook(null);
            return;
        }

        setBooks((prev) => [
            ...prev,
            {
                ...form,
                id: nextId(prev),
            },
        ]);
    };

    return (
        <AdminLayout title="Product Management">
                        <div className="rounded-2xl bg-[#dcfce7] px-6 py-4 text-left text-base text-emerald-700">
                            {bannerMessage}
                        </div>

                        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            <DashboardCard label="Total Books" value={stats.totalBooks} />
                            <DashboardCard label="Available Books" value={stats.availableBooks} valueClassName="text-emerald-600" />
                            <DashboardCard label="Issued Books" value={stats.issuedBooks} valueClassName="text-rose-600" />
                            <DashboardCard label="Total Users" value={stats.totalUsers} valueClassName="text-[#4f46e5]" />
                        </section>

                        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                            <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
                                <h3 className="text-lg font-black text-slate-700">Active Inventory</h3>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search products..."
                                    className="w-[240px] rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
                                />
                            </div>

                            {!isLoaded ? (
                                <div className="px-8 py-8 text-slate-500">Loading inventory from the backend...</div>
                            ) : null}
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-[#fbfbfd] text-sm uppercase text-slate-500">
                                        <tr>
                                            <th className="px-8 py-5">Product Info</th>
                                            <th className="px-8 py-5">Category</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBooks.map((book) => (
                                            <tr key={book.id} className="border-t border-slate-100 text-sm">
                                                <td className="px-8 py-6">
                                                    <div className="font-extrabold text-slate-800">{book.title}</div>
                                                    <div className="mt-1 text-xs text-slate-400">by {book.author}</div>
                                                    <div className="mt-1 text-xs text-slate-400">ID: #{book.id}</div>
                                                </td>
                                                <td className="px-8 py-6 text-slate-500">{book.category}</td>
                                                <td className="px-8 py-6">
                                                    <StatusBadge status={book.status} />
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="inline-flex items-center gap-5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingBook(book)}
                                                            className="text-sm text-[#4f46e5] transition hover:opacity-80"
                                                            aria-label={`Edit ${book.title}`}
                                                        >
                                                            <i className="fas fa-pen-to-square" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setBooks((prev) => prev.filter((item) => item.id !== book.id))}
                                                            className="text-sm text-[#ef4444] transition hover:opacity-80"
                                                            aria-label={`Delete ${book.title}`}
                                                        >
                                                            <i className="fas fa-trash" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredBooks.length === 0 ? (
                                            <tr className="border-t border-slate-100">
                                                <td className="px-8 py-8 text-sm text-slate-500" colSpan={4}>
                                                    No products matched your search.
                                                </td>
                                            </tr>
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>
                        </section>

        </AdminLayout>
    );
}
