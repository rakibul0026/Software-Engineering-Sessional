import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const initialEbooks = [
  { id: 1, title: "Android App Development", author: "Google Press", status: "Available" },
  { id: 2, title: "AI Essentials", author: "Open Learning", status: "Available" },
  { id: 3, title: "Network Security", author: "Cyber Team", status: "Issued" },
];

export default function AdminEbookSectionPage() {
  const [ebooks, setEbooks] = useState(initialEbooks);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEbook = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!title.trim()) {
      setError("Please enter an e-book title.");
      return;
    }
    if (!author.trim()) {
      setError("Please enter an author name.");
      return;
    }
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 50MB.");
      return;
    }

    setLoading(true);

    try {
      // Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "library_ebooks");
      formData.append("folder", "library/ebooks");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(uploadError.error?.message || "Failed to upload PDF file.");
      }

      const uploadedFile = await uploadResponse.json();

      // Add e-book to list
      const newEbook = {
        id: Date.now(),
        title: title.trim(),
        author: author.trim(),
        status: "Available",
        fileUrl: uploadedFile.secure_url,
      };

      setEbooks([...ebooks, newEbook]);
      setSuccess(`"${title}" has been added successfully!`);

      // Reset form
      setTitle("");
      setAuthor("");
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      setError(err.message || "Failed to add e-book. Please try again.");
      console.error("E-book upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="E-book Section">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <h3 className="text-2xl font-bold text-slate-700">E-book Management</h3>

        {error && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-700">
            {success}
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E-book title"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            disabled={loading}
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-500"
          disabled={loading}
        />

        <button
          type="button"
          onClick={handleAddEbook}
          disabled={loading}
          className="mt-4 rounded-2xl bg-[#4f46e5] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add E-book"}
        </button>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#fbfbfd] text-lg uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {ebooks.length > 0 ? (
                ebooks.map((book) => (
                  <tr key={book.id} className="border-t border-slate-100 text-lg">
                    <td className="px-6 py-4 font-semibold text-slate-800">{book.title}</td>
                    <td className="px-6 py-4 text-slate-600">{book.author}</td>
                    <td className="px-6 py-4">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-sm font-bold",
                          book.status === "Available" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
                        ].join(" ")}
                      >
                        {book.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-slate-500">
                    No e-books added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
