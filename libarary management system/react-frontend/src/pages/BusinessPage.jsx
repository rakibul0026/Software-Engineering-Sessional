import CategorySubjectPage from "../components/CategorySubjectPage";

const books = [
  {
    title: "Business Strategy",
    meta: "Featured title",
    tag: "Business",
    image: "/assets/images/Business/book/lviv-ukraine-february-20-2025-260nw-2597958335.webp",
    description: "A clean business collection starter with planning, growth, and management themes.",
  },
  {
    title: "Marketing Essentials",
    meta: "Brand growth",
    tag: "Market",
    image: "/assets/images/Business/book/9789325982406.jpg",
    description: "Focuses on promotion, consumer behavior, and practical marketing frameworks.",
  },
  {
    title: "Principles of Management",
    meta: "Core text",
    tag: "Management",
    image: "/assets/images/Business/book/Marketing_Management.jpg",
    description: "A simple visual for leadership, operations, and decision-making references.",
  },
  {
    title: "Entrepreneurship",
    meta: "Startup focus",
    tag: "Startup",
    image: "/assets/images/Business/book/Free-Entrepreneur-Book-Cover-Template-2x.jpg",
    description: "Explains startup planning, funding basics, and practical entrepreneurship case studies.",
  },
];

export default function BusinessPage() {
  return (
    <CategorySubjectPage
      eyebrow="Category"
      title="Business"
      intro="Find economics, management, marketing, entrepreneurship, and practical strategy material in one place."
      heroImage="/assets/images/Business/book/business.jpg"
      heroAlt="Business books"
      accentClass="text-emerald-600"
      countLabel="4 books"
      books={books}
    />
  );
}