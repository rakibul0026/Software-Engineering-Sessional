import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getRecentIssuedBooks } from "../lib/adminDatabaseService";

export default function AdminIssueBooksPage() {
  const [issueQueue, setIssueQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadIssues() {
      try {
        const issues = await getRecentIssuedBooks(15);
        if (isMounted) {
          setIssueQueue(issues);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load recent issues");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadIssues();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout title="Issue Books">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <h3 className="text-2xl font-bold text-slate-700">Recent Issue History</h3>
        <p className="mt-2 text-sm text-slate-500">This list is read from Firebase <code>transactions</code> and falls back to each user's <code>borrowedBooks</code> if the transaction node is empty.</p>

        {error ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#fbfbfd] text-lg uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4">Book ID</th>
                <th className="px-6 py-4">Issued At</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-5 text-slate-500" colSpan={6}>Loading recent issue transactions...</td>
                </tr>
              ) : issueQueue.length ? (
                issueQueue.map((entry) => (
                  <tr key={entry.id} className="border-t border-slate-100 text-lg">
                    <td className="px-6 py-5 font-semibold text-slate-800">{entry.borrowerName}</td>
                    <td className="px-6 py-5 text-slate-600">{entry.bookTitle || "Unknown Book"}</td>
                    <td className="px-6 py-5 text-slate-600">{entry.bookId || "-"}</td>
                    <td className="px-6 py-5 text-slate-600">{entry.timestamp || entry.issuedAt || "-"}</td>
                    <td className="px-6 py-5 text-slate-600">{entry.dueDate || "-"}</td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">Issued</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-5 text-slate-500" colSpan={6}>No issued records found in Firebase transactions or user borrowed-books data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
