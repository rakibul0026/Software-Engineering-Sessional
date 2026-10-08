import CategorySubjectPage from "../components/CategorySubjectPage";

const books = [
  {
    title: "Purple Dragon",
    meta: "Featured title",
    tag: "Novel",
    image: "/assets/images/Fiction/book/74a0d61b89e7e3ef10701d2827c5637b.jpg",
    description: "A dramatic story selection with strong character arcs and vivid visual presentation.",
  },
  {
    title: "blackhole-er-baccha",
    meta: "Literary fiction",
    tag: "Story",
    image: "/assets/images/Fiction/book/blackhole-er-baccha.jpg",
    description: "Compact fiction picks for readers who want reflective stories and gentle pacing.",
  },
  {
    title: "Midnight Pages",
    meta: "Modern tale",
    tag: "Fiction",
    image: "/assets/images/Fiction/book/pinterest-murakami.webp",
    description: "A clean shelf-style card for contemporary fiction, romance, and campus reading lists.",
  },
  {
    title: "The Next Chapter",
    meta: "Reader favorite",
    tag: "Novel",
    image: "/assets/images/Fiction/book/a2a9edeff0a9920645e1f60818964292.jpg",
    description: "A popular fiction pick featuring contemporary storytelling and character-driven plots.",
  },
];

export default function FictionPage() {
  return (
    <CategorySubjectPage
      eyebrow="Category"
      title="Fiction"
      intro="A dedicated shelf for novels, short stories, modern drama, and easy browsing by mood or author."
      heroImage="/assets/images/Fiction/book/fa00a3b6-e32b-4f7e-83ac-30d4b0d1c26c.jpg"
      heroAlt="Fiction books"
      accentClass="text-violet-600"
      countLabel="4 books"
      books={books}
    />
  );
}