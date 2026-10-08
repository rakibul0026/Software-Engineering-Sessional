import CategorySubjectPage from "../components/CategorySubjectPage";

const books = [
  {
    title: "Leonardo Science & Tech",
    meta: "Featured title",
    tag: "Science",
    image: "/images/Leonardo-ScienceTech_Cover.jpg",
    description: "A broad introduction to modern lab tools, innovation, and STEM thinking for students.",
  },
  {
    title: "Internet of Things",
    meta: "Connected systems",
    tag: "IoT",
    image: "/images/IOT.jpg",
    description: "Covers sensors, smart devices, and practical IoT deployments in campus and industry settings.",
  },
  {
    title: "Machine Learning Basics",
    meta: "AI and data",
    tag: "ML",
    image: "/images/ML.png",
    description: "Introduces learning models, datasets, and the core ideas behind applied machine learning.",
  },
  {
    title: "Future IoT Systems",
    meta: "Emerging tech",
    tag: "Tech",
    image: "/images/future-iot-book.png",
    description: "A forward-looking guide to smart environments, automation, and connected infrastructure.",
  },
];

export default function ScienceTechPage() {
  return (
    <CategorySubjectPage
      eyebrow="Category"
      title="Science & Tech"
      intro="Browse a focused collection for physics, computing, electronics, automation, and modern engineering topics."
      heroImage="/images/Leonardo-ScienceTech_Cover.jpg"
      heroAlt="Science and technology books"
      accentClass="text-cyan-600"
      countLabel="4 books"
      books={books}
    />
  );
}