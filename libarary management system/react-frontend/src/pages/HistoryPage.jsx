import CategorySubjectPage from "../components/CategorySubjectPage";

const books = [
  {
    title: "World Heritage",
    meta: "Featured title",
    tag: "History",
    image: "/assets/images/history/book/9780231179928.avif",
    description: "A broad history overview with a clean cover presentation for global events and eras.",
  },
  {
    title: "Ancient Civilizations",
    meta: "Timeline study",
    tag: "Past",
    image: "/assets/images/history/book/the-history-of-philosophy-book-cover-.png",
    description: "Curated material on early empires, archaeology, and the foundations of civilization.",
  },
  {
    title: "Modern Asia",
    meta: "Regional history",
    tag: "Study",
    image: "/assets/images/history/book/ade73895-c683-48b5-9cae-d3472dd46171.jpg",
    description: "A compact card for political movements, independence history, and regional context.",
  },
  {
    title: "Bangladesh Chronicle",
    meta: "Local archive",
    tag: "Archive",
    image: "/assets/images/history/book/Bangladesh__A_Political_History_Since_In-Ali_Riaz-9d277-355278.jpg",
    description: "A shelf slot for local history, liberation studies, and archive-based reading lists.",
  },
];

export default function HistoryPage() {
  return (
    <CategorySubjectPage
      eyebrow="Category"
      title="History"
      intro="Track world history, archaeology, political change, and the stories that shaped the present."
      heroImage="/assets/images/history/book/attachment_62255190.jpeg"
      heroAlt="History books"
      accentClass="text-amber-600"
      countLabel="4 books"
      books={books}
    />
  );
}
