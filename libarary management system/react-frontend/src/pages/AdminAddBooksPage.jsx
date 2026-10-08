import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { addBook } from "../lib/databaseService";

const categoryOptions = [
  "General",
  "Engineering",
  "Programming",
  "Computer Science",
  "Database",
  "Mathematics",
  "Data Science",
  "Robotics",
];

export default function AdminAddBooksPage() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Programming",
    status: "Available",
    isbn: "",
    imageUrl: "",
    quantity: 1,
    description: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const created = await addBook(form);
      setMessage(`Book added: ${created.title}`);
      setForm({
        title: "",
        author: "",
        category: "Programming",
        status: "Available",
        isbn: "",
        imageUrl: "",
        quantity: 1,
        description: "",
      });
    } catch (err) {
      setMessage(`Failed to add book: ${err.message || err}`);
    }
  };

  return (
    <AdminLayout title="Add Books">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-2xl font-bold text-slate-700">Add New Book</h3>
        </div>
        {message ? (
          <div className="mx-6 mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        ) : null}

        <form className="grid gap-6 px-6 py-8 lg:grid-cols-3" onSubmit={handleSubmit}>
          <div className="lg:col-span-2">
            <label className="mb-3 block text-lg font-semibold text-slate-600">Book Title</label>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none"
              placeholder="e.g. Introduction to Algorithms"
              required
            />
          </div>
          <div>
            <label className="mb-3 block text-lg font-semibold text-slate-600">Author</label>
            <input
              value={form.author}
              onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none"
              placeholder="e.g. John Doe"
              required
            />
          </div>
          <div>
            <label className="mb-3 block text-lg font-semibold text-slate-600">ISBN</label>
            <input
              value={form.isbn}
              onChange={(event) => setForm((prev) => ({ ...prev, isbn: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none"
              placeholder="e.g. 978-0-123456-78-9"
            />
          </div>
          <div>
            <label className="mb-3 block text-lg font-semibold text-slate-600">Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none"
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div>
            <label className="mb-3 block text-lg font-semibold text-slate-600">Quantity</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none"
            />
          </div>
          <div className="lg:col-span-3">
            <label className="mb-3 block text-lg font-semibold text-slate-600">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none"
              placeholder="Short summary or description"
              rows={4}
            />
          </div>
          <div>
            <label className="mb-3 block text-lg font-semibold text-slate-600">Category</label>
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-lg outline-none"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-3 block text-lg font-semibold text-slate-600">Status</label>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-lg outline-none"
            >
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-2xl bg-[#4f46e5] px-6 py-4 text-xl font-bold text-white transition hover:bg-[#4338ca]">
              Add Book
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}
