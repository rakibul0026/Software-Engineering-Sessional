import AdminLayout from "../components/AdminLayout";

export default function AdminTermsPage() {
  return (
    <AdminLayout title="Terms & Conditions">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <h3 className="text-2xl font-bold text-slate-700">Library Terms</h3>
        <ul className="mt-6 list-disc space-y-3 pl-6 text-lg text-slate-600">
          <li>Issued books must be returned within the allowed borrowing period.</li>
          <li>Late returns may be subject to library policy and restrictions.</li>
          <li>Users must keep books in good condition and avoid damage.</li>
          <li>Reference books are for reading room use unless admin approval is granted.</li>
          <li>Library ID is mandatory for all issue and return operations.</li>
        </ul>
      </section>
    </AdminLayout>
  );
}
