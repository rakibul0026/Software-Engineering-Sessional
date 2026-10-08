import AdminLayout from "../components/AdminLayout";

const books = [
  { id: 1, title: "Python Programming", category: "Programming", status: "Issued" },
  { id: 2, title: "Data Structures", category: "Computer Science", status: "Issued" },
  { id: 3, title: "Database Systems", category: "Database", status: "Issued" },
  { id: 4, title: "Java Fundamentals", category: "Programming", status: "Available" },
  { id: 5, title: "C++ Programming", category: "Programming", status: "Available" },
];

export default function AdminTotalBooksPage() {
  return (
    <AdminLayout title="Total Books">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
        <div className="border-b border-slate-200 px-8 py-6">
          <h3 className="text-[1.9rem] font-black text-slate-700">Library Book List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#fbfbfd] text-xl uppercase text-slate-500">
              <tr>
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Title</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t border-slate-100 text-xl">
                  <td className="px-8 py-6 text-slate-500">#{book.id}</td>
                  <td className="px-8 py-6 font-bold text-slate-800">{book.title}</td>
                  <td className="px-8 py-6 text-slate-500">{book.category}</td>
                  <td className="px-8 py-6">
                    <span className={[
                      "rounded-full px-4 py-2 text-sm font-bold",
                      book.status === "Available" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
                    ].join(" ")}>
                      {book.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
