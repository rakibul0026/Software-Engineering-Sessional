import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const initialPublications = [
  { id: 1, title: "CSTU Annual Research Digest", type: "Journal", year: "2025" },
  { id: 2, title: "Software Engineering Trends", type: "Magazine", year: "2026" },
  { id: 3, title: "Academic Writing Handbook", type: "Guide", year: "2024" },
];

export default function AdminPublicationPage() {
  const [publications, setPublications] = useState(initialPublications);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadPublicationToCloudinary = async (selectedFile) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_PUBLICATION_UPLOAD_PRESET ||
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary config missing. Set VITE_CLOUDINARY_CLOUD_NAME and a publication upload preset.");
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "library/publications");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();
    let payload;
    try {
      payload = responseText ? JSON.parse(responseText) : {};
    } catch {
      payload = { raw: responseText };
    }

    if (!response.ok) {
      throw new Error(payload?.error?.message || payload?.raw || "Failed to upload publication to Cloudinary.");
    }

    return payload;
  };

  const handleUpload = async () => {
    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Please enter a publication title.");
      return;
    }

    if (!file) {
      setError("Please choose a PDF file.");
      return;
    }

    if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) {
      setError("Please select a PDF file.");
      return;
    }

    setUploading(true);

    try {
      const uploaded = await uploadPublicationToCloudinary(file);
      const currentYear = String(new Date().getFullYear());

      setPublications((current) => [
        {
          id: Date.now(),
          title: title.trim(),
          type: "Publication",
          year: currentYear,
          fileUrl: uploaded.secure_url,
        },
        ...current,
      ]);

      setMessage("Publication uploaded to Cloudinary successfully.");
      setTitle("");
      setFile(null);

      const fileInput = document.getElementById("publication-file-input");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(err?.message || "Failed to upload publication.");
      console.error("Publication upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout title="Publication">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <h3 className="text-2xl font-bold text-slate-700">Publication Upload</h3>

        {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div> : null}
        {message ? <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</div> : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none focus:border-[#4f46e5]"
            placeholder="Publication title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={uploading}
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-2xl bg-[#4f46e5] px-5 py-3 text-lg font-bold text-white transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <input
          id="publication-file-input"
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-500"
          disabled={uploading}
        />

        <div className="mt-6 space-y-3">
          {publications.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
              <div>
                <p className="text-lg font-bold text-slate-800">{item.title}</p>
                <p className="text-sm text-slate-500">{item.type} • {item.year}</p>
              </div>
              <a
                href={item.fileUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
              >
                View
              </a>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
