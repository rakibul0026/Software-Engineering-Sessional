import { firebaseDatabase, hasFirebaseConfig } from "./firebaseClient";
import { ref, get, set } from "firebase/database";

const STORAGE_KEY = "cstuLibraryBooks";
const FALLBACK_IMAGE = "/images/front_img_cover.jpg";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(/\/$/, "");
const BOOKS_ENDPOINT = `${API_BASE_URL}/api/books/`;
const TITLE_ALIASES = {
  "Front Office Library Guide": "Machine Learning Algorithm",
  "C Programming": "C++ Programming",
  "Object Oriented Programming": "Machine Learning",
};

export const DEFAULT_LIBRARY_BOOKS = [
  {
    id: 1,
    title: "Machine Learning Algorithm",
    author: "CSTU Library",
    category: "General",
    status: "Available",
    image: "/images/front_img_cover.jpg",
    issuedBy: null,
  },
  {
    id: 2,
    title: "Engineering II",
    author: "Academic Press",
    category: "Engineering",
    status: "Available",
    image: "/images/Engineering_II_Cover_WEB.jpg",
    issuedBy: null,
  },
  {
    id: 3,
    title: "C++ Programming",
    author: "Brian Kernighan",
    category: "Programming",
    status: "Available",
    image: "/images/c-programming.jpg",
    issuedBy: null,
  },
  {
    id: 4,
    title: "Fundamentals of Mathematics",
    author: "CSTU Research Unit",
    category: "Mathematics",
    status: "Issued",
    image: "/images/fundamentals-of-math.jpg",
    issuedBy: "self",
  },
  {
    id: 5,
    title: "Bots and Automation",
    author: "Tech Future Team",
    category: "Robotics",
    status: "Available",
    image: "/images/bots-cover.jpg",
    issuedBy: null,
  },
  {
    id: 6,
    title: "Big Data Essentials",
    author: "Data Lab",
    category: "Data Science",
    status: "Issued",
    image: "/images/bigdata-cover.jpg",
    issuedBy: "other",
  },
  {
    id: 7,
    title: "Operating Systems",
    author: "Silberschatz",
    category: "Computer Science",
    status: "Available",
    image: "/images/os-cover.jpg",
    issuedBy: null,
  },
  {
    id: 8,
    title: "Machine Learning",
    author: "CSE Final Question",
    category: "Computer Science",
    status: "Available",
    image: "/images/cover_fmt.jpg",
    issuedBy: null,
  },
  {
    id: 9,
    title: "Robotics Fundamentals",
    author: "STEM Library",
    category: "Robotics",
    status: "Issued",
    image: "/images/robotics-cover.jpg",
    issuedBy: "self",
  },
];

function normalizeBook(book, index, options = {}) {
  const { applyAliases = false } = options;
  const status = book?.status === "Issued" ? "Issued" : "Available";
  const title = String(book?.title || "Untitled Book");
  const rawImage = String(book?.image || FALLBACK_IMAGE);
  const image = IMAGE_BASE_URL && rawImage.startsWith("/")
    ? `${IMAGE_BASE_URL}${rawImage}`
    : rawImage;

  return {
    id: Number.isFinite(Number(book?.id)) ? Number(book.id) : index + 1,
    title: applyAliases ? (TITLE_ALIASES[title] || title) : title,
    author: String(book?.author || "Unknown Author"),
    category: String(book?.category || "General"),
    status,
    image,
    issuedBy: status === "Issued" ? (book?.issuedBy || "other") : null,
  };
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      return null;
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

function getLocalLibraryBooks() {
  if (typeof window === "undefined") {
    return DEFAULT_LIBRARY_BOOKS;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;

  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map(normalizeBook);
  }

  return DEFAULT_LIBRARY_BOOKS.map((book, index) => normalizeBook(book, index, { applyAliases: true }));
}

function saveLocalLibraryBooks(books) {
  if (typeof window === "undefined") {
    return [];
  }

  const normalized = Array.isArray(books) ? books.map(normalizeBook) : [];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

function mergeLibraryBooks(primaryBooks = [], secondaryBooks = []) {
  const merged = [];
  const seen = new Set();

  const allBooks = [...secondaryBooks, ...primaryBooks];
  for (const book of allBooks) {
    const key = `${String(book?.title || "").trim().toLowerCase()}|${String(book?.author || "").trim().toLowerCase()}|${String(book?.category || "").trim().toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(book);
  }

  return merged;
}

async function readFirebaseBooks() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    return null;
  }

  try {
    const snapshot = await get(ref(firebaseDatabase, "books"));
    if (!snapshot.exists()) {
      return null;
    }

    const snapshotValue = snapshot.val();
    if (Array.isArray(snapshotValue)) {
      return snapshotValue.map(normalizeBook);
    }

    return Object.entries(snapshotValue).map(([key, value], index) => normalizeBook({ id: key, ...value }, index));
  } catch (error) {
    console.error("Error reading Firebase books:", error);
    return null;
  }
}

async function saveFirebaseBooks(books) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    return books;
  }

  try {
    const payload = Array.isArray(books) ? books : [];
    await set(ref(firebaseDatabase, "books"), payload);
  } catch (error) {
    console.error("Error saving Firebase books:", error);
  }

  return books;
}

export async function getLibraryBooks() {
  const remoteBooks = await fetchJson(BOOKS_ENDPOINT);
  if (Array.isArray(remoteBooks) && remoteBooks.length > 0) {
    return saveLocalLibraryBooks(mergeLibraryBooks(remoteBooks, DEFAULT_LIBRARY_BOOKS.map(normalizeBook)));
  }

  if (remoteBooks && Array.isArray(remoteBooks.results) && remoteBooks.results.length > 0) {
    return saveLocalLibraryBooks(mergeLibraryBooks(remoteBooks.results, DEFAULT_LIBRARY_BOOKS.map(normalizeBook)));
  }

  const firebaseBooks = await readFirebaseBooks();
  if (Array.isArray(firebaseBooks) && firebaseBooks.length > 0) {
    const localBooks = getLocalLibraryBooks();
    return saveLocalLibraryBooks(mergeLibraryBooks(firebaseBooks, [
      ...DEFAULT_LIBRARY_BOOKS.map(normalizeBook),
      ...localBooks,
    ]));
  }

  return getLocalLibraryBooks();
}

export async function saveLibraryBooks(books) {
  const normalized = saveLocalLibraryBooks(books);

  await fetchJson(BOOKS_ENDPOINT, {
    method: "PUT",
    body: JSON.stringify(normalized),
  });

  await saveFirebaseBooks(normalized);

  return normalized;
}

export async function addLibraryBook(form) {
  const books = await getLibraryBooks();
  const nextId = books.length ? Math.max(...books.map((book) => Number(book.id) || 0)) + 1 : 1;

  const newBook = normalizeBook(
    {
      ...form,
      id: nextId,
      image: form?.image || FALLBACK_IMAGE,
      issuedBy: form?.status === "Issued" ? "other" : null,
    },
    books.length
  );

  const updatedBooks = [...books, newBook];
  await saveLibraryBooks(updatedBooks);
  return newBook;
}