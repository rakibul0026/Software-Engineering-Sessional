import { useMemo, useState } from "react";
import SiteShell from "../components/SiteShell";

const departmentOptions = ["ICT", "CSE", "BBA"];
const semesterOptions = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"];

const questionSections = [
  {
    title: "Class Test Questions",
    badge: "Class Test",
    badgeClass: "bg-emerald-100 text-emerald-600",
    items: [
      { subject: "Programming with C", year: "2024", semester: "1st Semester", department: "ICT", pdf: "/assets/pdf/CSE%20Final%20Question%20(2nd%20batch)%20(1).pdf" },
      { subject: "Object Oriented Programming", year: "2026", semester: "2nd Semester", department: "CSE", pdf: "/assets/pdf/CSE%20Final%20Question%20(2nd%20batch)%20(1).pdf" },
      { subject: "Quiz-02 Greedy Technique", year: "2026", semester: "3rd Semester", department: "CSE", pdf: "/assets/pdf/Quiz-02%20Greedy%20Technique.pdf" },
      { subject: "Algorithm Time Complexity Quiz", year: "2026", semester: "3rd Semester", department: "CSE", pdf: "/assets/pdf/Algorithm_Time_Complexity_Quiz.pdf" },
    ],
  },
  {
    title: "Final Exam Questions",
    badge: "Final Exam",
    badgeClass: "bg-indigo-100 text-indigo-600",
    items: [
      { subject: "Discrete Mathematics", year: "2023", semester: "3rd Semester", department: "CSE", pdf: "/assets/pdf/CSE%20Final%20Question%20(2nd%20batch)%20(1).pdf" },
      { subject: "Digital Logic Design", year: "2024", semester: "4th Semester", department: "ICT", pdf: "/assets/pdf/CSE%20Final%20Question%20(2nd%20batch)%20(1).pdf" },
    ],
  },
  {
    title: "Lab Questions",
    badge: "Lab",
    badgeClass: "bg-amber-100 text-amber-600",
    items: [
      { subject: "Digital Logic Design Lab", year: "2024", semester: "3rd Semester", department: "CSE", pdf: "/assets/pdf/CSE%20Final%20Question%20(2nd%20batch)%20(1).pdf" },
    ],
  },
  {
    title: "Sessional Questions",
    badge: "Sessional",
    badgeClass: "bg-orange-100 text-orange-600",
    items: [
      { subject: "Microcontroller Sessional", year: "2023", semester: "2nd Semester", department: "ICT", pdf: "/assets/pdf/CSE%20Final%20Question%20(2nd%20batch)%20(1).pdf" },
    ],
  },
];

function SectionBadge({ badge, badgeClass }) {
  return <span className={["rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide", badgeClass].join(" ")}>{badge}</span>;
}

function QuestionTable({ title, badge, badgeClass, items }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <SectionBadge badge={badge} badgeClass={badgeClass} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-6 py-4">Subject Name</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={`${title}-${item.subject}`} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-800">{item.subject}</td>
                  <td className="px-6 py-4 text-slate-600">{item.year}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">{item.department}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a
                      href={item.pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800"
                    >
                      <i className="fas fa-download" />
                      PDF
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                  No questions found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function QuestionBankPage() {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [semester, setSemester] = useState(semesterOptions[0]);
  const [appliedSemester, setAppliedSemester] = useState(semesterOptions[0]);

  const filteredSections = useMemo(() => {
    const departments = selectedDepartments.length > 0 ? selectedDepartments : departmentOptions;

    return questionSections.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => departments.includes(item.department) && item.semester === appliedSemester
      ),
    }));
  }, [selectedDepartments, appliedSemester]);

  const toggleDepartment = (department) => {
    setSelectedDepartments((prev) =>
      prev.includes(department)
        ? prev.filter((item) => item !== department)
        : [...prev, department]
    );
  };

  const handleApplyFilter = (event) => {
    event.preventDefault();
    setAppliedSemester(semester);
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">Academic Question Bank</h1>
          <p className="mt-3 text-slate-600">Find previous year exam questions of Chandpur Science and Technology University.</p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full space-y-6 lg:w-72">
            <form onSubmit={handleApplyFilter} className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <h3 className="border-b border-slate-200 pb-3 text-2xl font-black text-slate-800">Filter by Department</h3>
                <div className="mt-5 space-y-4 text-sm">
                  {departmentOptions.map((department) => (
                    <label key={department} className="flex cursor-pointer items-center gap-3 text-lg text-slate-800">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department)}
                        onChange={() => toggleDepartment(department)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{department}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <h3 className="border-b border-slate-200 pb-3 text-2xl font-black text-slate-800">Select Semester</h3>
                <select
                  name="semester"
                  value={semester}
                  onChange={(event) => setSemester(event.target.value)}
                  className="mt-5 w-full rounded-2xl border border-blue-400 bg-white px-4 py-4 text-lg outline-none focus:border-blue-500"
                >
                  {semesterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="mt-5 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
                >
                  Apply Filter
                </button>
              </div>
            </form>
          </aside>

          <main className="flex-1 space-y-10">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Applied Semester</h2>
                  <p className="mt-1 text-sm text-slate-500">Currently selected: {appliedSemester}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Question Sections
                </span>
              </div>

              <div className="space-y-8">
                {filteredSections.map((section) => (
                  <QuestionTable
                    key={section.title}
                    title={section.title}
                    badge={section.badge}
                    badgeClass={section.badgeClass}
                    items={section.items}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SiteShell>
  );
}
