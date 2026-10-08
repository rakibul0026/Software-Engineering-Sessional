import AdminLayout from "../components/AdminLayout";

const questionBanks = [
  { id: 1, title: "Data Structures Midterm", subject: "CSE-210", updated: "2026-04-21" },
  { id: 2, title: "DBMS Final Practice", subject: "CSE-312", updated: "2026-04-18" },
  { id: 3, title: "Programming Fundamentals Quiz", subject: "CSE-101", updated: "2026-04-14" },
];

export default function AdminQuestionBankPage() {
  return (
    <AdminLayout title="Question Bank">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <h3 className="text-2xl font-bold text-slate-700">Question Bank Files</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
          <input className="rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none" placeholder="Question bank title" />
          <button type="button" className="rounded-2xl bg-[#4f46e5] px-5 py-3 text-lg font-bold text-white">Upload</button>
        </div>
        <input type="file" className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-500" />

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#fbfbfd] text-lg uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {questionBanks.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 text-lg">
                  <td className="px-6 py-4 font-semibold text-slate-800">{item.title}</td>
                  <td className="px-6 py-4 text-slate-600">{item.subject}</td>
                  <td className="px-6 py-4 text-slate-600">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
