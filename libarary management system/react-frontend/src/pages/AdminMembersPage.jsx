import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllUsers, getRecentIssuedBooks } from "../lib/adminDatabaseService";

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [users, issues] = await Promise.all([
          getAllUsers(),
          getRecentIssuedBooks(8),
        ]);

        if (!isMounted) {
          return;
        }

        setMembers(users);
        setRecentIssues(issues);
        setError("");
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load Firebase data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const userRows = useMemo(() => {
    return members.map((member) => ({
      id: member.id,
      name: member.name || member.displayName || member.email || member.id,
      email: member.email || "-",
      role: member.role || member.roleKey || "Member",
      status: member.status || "Active",
    }));
  }, [members]);

  return (
    <AdminLayout title="Members">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <h3 className="text-2xl font-bold text-slate-700">Firebase Signups</h3>
          <p className="mt-2 text-sm text-slate-500">Users loaded directly from the <code>users</code> node.</p>

          {error ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#fbfbfd] text-lg uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Name / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-6 py-5 text-slate-500" colSpan={4}>Loading Firebase users...</td>
                  </tr>
                ) : userRows.length ? (
                  userRows.map((member) => (
                    <tr key={member.id} className="border-t border-slate-100 text-lg">
                      <td className="px-6 py-5 font-semibold text-slate-800">{member.id}</td>
                      <td className="px-6 py-5 text-slate-600">
                        <div className="font-semibold text-slate-800">{member.name}</div>
                        <div className="text-sm text-slate-500">{member.email}</div>
                      </td>
                      <td className="px-6 py-5 text-slate-600">{member.role}</td>
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-5 text-slate-500" colSpan={4}>No users found in Firebase.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <h3 className="text-2xl font-bold text-slate-700">Recent Issues</h3>
          <p className="mt-2 text-sm text-slate-500">Latest issued books read from Firebase <code>transactions</code> or each user's <code>borrowedBooks</code> data.</p>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-xl border border-slate-100 px-4 py-3 text-sm text-slate-500">Loading recent issue history...</div>
            ) : recentIssues.length ? (
              recentIssues.map((issue) => (
                <div key={issue.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">{issue.action}</p>
                      <h4 className="mt-1 text-lg font-black text-slate-900">{issue.bookTitle || issue.bookId || "Unknown Book"}</h4>
                      <p className="mt-1 text-sm text-slate-600">Borrower: {issue.borrowerName}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
                      Issued
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-500">
                    <div>Book ID: {issue.bookId || "-"}</div>
                    <div>Issued at: {issue.timestamp || issue.issuedAt || "-"}</div>
                    <div>Due date: {issue.dueDate || "-"}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-100 px-4 py-3 text-sm text-slate-500">No recent issue transactions found.</div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
