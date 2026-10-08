import { firebaseDatabase, hasFirebaseConfig } from "./firebaseClient";
import { getLibraryBooks } from "./libraryBooksStore";
import { ref, get, query, orderByChild, limitToFirst, onValue, off, update, push, set } from "firebase/database";

function normalizeBookRecord(bookId, bookData = {}) {
  const quantity = Number(bookData.quantity ?? bookData.available ?? 1) || 1;
  const available = Number.isFinite(Number(bookData.available))
    ? Number(bookData.available)
    : (String(bookData.status || "").toLowerCase() === "issued" ? 0 : quantity);

  return {
    id: bookId,
    title: bookData.title || "Untitled Book",
    author: bookData.author || "Unknown Author",
    isbn: bookData.isbn || "",
    category: bookData.category || "General",
    description: bookData.description || "",
    imageUrl: bookData.imageUrl || bookData.image || "/images/front_img_cover.jpg",
    quantity,
    available,
    status: available > 0 ? "Available" : "Issued",
    issuedBy: bookData.issuedBy || null,
  };
}

function mergeBookRecords(primaryBooks = [], secondaryBooks = []) {
  const merged = [];
  const seen = new Set();

  for (const book of [...secondaryBooks, ...primaryBooks]) {
    const key = `${String(book?.title || "").trim().toLowerCase()}|${String(book?.author || "").trim().toLowerCase()}|${String(book?.category || "").trim().toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(book);
  }

  return merged;
}

function getUserNodePaths(userId) {
  return [`users/${userId}`, `members/${userId}`];
}

function getUserChildPaths(userId, childPath) {
  return getUserNodePaths(userId).map((basePath) => `${basePath}/${childPath}`);
}

async function getFallbackBooks() {
  try {
    const books = await getLibraryBooks();
    return books.map((book, index) => normalizeBookRecord(book.id ?? index + 1, book));
  } catch (error) {
    console.error("Error loading fallback books:", error);
    return [];
  }
}

/**
 * Fetch all books from Firebase Realtime Database
 * Database structure:
 * /catalog/books/{bookId} = {
 *   id, title, author, isbn, category, description, imageUrl, quantity, available
 * }
 */
export async function getAllBooks() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    return getFallbackBooks();
  }

  try {
    // Try /catalog/books first, then fallback to /books
    let booksRef = ref(firebaseDatabase, "catalog/books");
    let snapshot = await get(booksRef);
    
    if (!snapshot.exists()) {
      booksRef = ref(firebaseDatabase, "books");
      snapshot = await get(booksRef);
    }
    
    if (snapshot.exists()) {
      const booksData = snapshot.val();
      // Convert object to array format and merge with fallback/local catalog.
      const firebaseBooks = Object.keys(booksData).map((key) => normalizeBookRecord(key, booksData[key]));
      const fallbackBooks = await getFallbackBooks();
      return mergeBookRecords(firebaseBooks, fallbackBooks);
    }
    return getFallbackBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
    return getFallbackBooks();
  }
}

/**
 * Fetch books by category
 */
export async function getBooksByCategory(category) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    const fallbackBooks = await getFallbackBooks();
    return fallbackBooks.filter(book => book.category?.toLowerCase() === category?.toLowerCase());
  }

  try {
    // Try /catalog/books first, then fallback to /books
    let booksRef = ref(firebaseDatabase, "catalog/books");
    let snapshot = await get(booksRef);
    
    if (!snapshot.exists()) {
      booksRef = ref(firebaseDatabase, "books");
      snapshot = await get(booksRef);
    }
    
    if (snapshot.exists()) {
      const booksData = snapshot.val();
      const firebaseBooks = Object.keys(booksData).map((key) => normalizeBookRecord(key, booksData[key]));
      const fallbackBooks = await getFallbackBooks();
      const books = mergeBookRecords(firebaseBooks, fallbackBooks);
      return books.filter(book => book.category?.toLowerCase() === category?.toLowerCase());
    }
    const fallbackBooks = await getFallbackBooks();
    return fallbackBooks.filter(book => book.category?.toLowerCase() === category?.toLowerCase());
  } catch (error) {
    console.error("Error fetching books by category:", error);
    const fallbackBooks = await getFallbackBooks();
    return fallbackBooks.filter(book => book.category?.toLowerCase() === category?.toLowerCase());
  }
}

/**
 * Fetch single book by ID
 */
export async function getBookById(bookId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    const fallbackBooks = await getFallbackBooks();
    return fallbackBooks.find(book => String(book.id) === String(bookId)) || null;
  }

  try {
    // Try /catalog/books first, then fallback to /books
    let bookRef = ref(firebaseDatabase, `catalog/books/${bookId}`);
    let snapshot = await get(bookRef);
    
    if (!snapshot.exists()) {
      bookRef = ref(firebaseDatabase, `books/${bookId}`);
      snapshot = await get(bookRef);
    }
    
    if (snapshot.exists()) {
      return {
        ...normalizeBookRecord(bookId, snapshot.val()),
      };
    }
    const fallbackBooks = await getFallbackBooks();
    return fallbackBooks.find(book => String(book.id) === String(bookId)) || null;
  } catch (error) {
    console.error("Error fetching book:", error);
    const fallbackBooks = await getFallbackBooks();
    return fallbackBooks.find(book => String(book.id) === String(bookId)) || null;
  }
}

/**
 * Add a new book to the database
 */
export async function addBook(bookData) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const newRef = push(ref(firebaseDatabase, "catalog/books"));
    const key = newRef.key;

    const quantity = Number(bookData.quantity) || 1;
    const status = bookData.status === "Issued" ? "Issued" : "Available";
    const available = status === "Issued" ? Math.max(0, quantity - 1) : quantity;

    const payload = {
      id: key,
      title: bookData.title || "Untitled",
      author: bookData.author || "Unknown",
      isbn: bookData.isbn || "",
      category: bookData.category || "General",
      description: bookData.description || "",
      imageUrl: bookData.imageUrl || "",
      quantity: quantity,
      available: available,
      createdAt: new Date().toISOString(),
    };

    await set(ref(firebaseDatabase, `catalog/books/${key}`), payload);
    return payload;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
}

/**
 * Search books by title or author
 */
export async function searchBooks(searchTerm) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    // Try /catalog/books first, then fallback to /books
    let booksRef = ref(firebaseDatabase, "catalog/books");
    let snapshot = await get(booksRef);
    
    if (!snapshot.exists()) {
      booksRef = ref(firebaseDatabase, "books");
      snapshot = await get(booksRef);
    }
    
    if (snapshot.exists()) {
      const booksData = snapshot.val();
      const books = Object.keys(booksData).map(key => ({
        id: key,
        ...booksData[key]
      }));
      
      const term = searchTerm.toLowerCase();
      return books.filter(book => 
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term) ||
        book.isbn?.includes(term)
      );
    }
    return [];
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
}

/**
 * Real-time listener for books changes
 * Useful for updates when other users modify book data
 */
export function watchBooks(callback) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    console.warn("Firebase database not configured");
    return () => {};
  }

  try {
    const booksRef = ref(firebaseDatabase, "catalog/books");
    const unsubscribe = onValue(booksRef, (snapshot) => {
      if (snapshot.exists()) {
        const booksData = snapshot.val();
        const books = Object.keys(booksData).map(key => ({
          id: key,
          ...booksData[key]
        }));
        callback(books, null);
      } else {
        // Fallback to /books if /catalog/books doesn't exist
        const fallbackRef = ref(firebaseDatabase, "books");
        onValue(fallbackRef, (fallbackSnapshot) => {
          if (fallbackSnapshot.exists()) {
            const booksData = fallbackSnapshot.val();
            const books = Object.keys(booksData).map(key => ({
              id: key,
              ...booksData[key]
            }));
            callback(books, null);
          } else {
            callback([], null);
          }
        }, (error) => {
          console.error("Error watching books:", error);
          callback(null, error);
        });
      }
    }, (error) => {
      console.error("Error watching books:", error);
      callback(null, error);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up book listener:", error);
    return () => {};
  }
}

/**
 * Get user's borrowed books from user profile data
 */
export async function getUserBorrowedBooks(userId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    for (const path of getUserChildPaths(userId, "borrowedBooks")) {
      const snapshot = await get(ref(firebaseDatabase, path));
      if (snapshot.exists()) {
        return snapshot.val() || [];
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching user borrowed books:", error);
    throw error;
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    for (const path of getUserNodePaths(userId)) {
      const snapshot = await get(ref(firebaseDatabase, path));
      if (snapshot.exists()) {
        return snapshot.val();
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

  /**
   * Create or update a user profile in the Realtime Database
   */
  export async function createUserProfile(userId, profileData = {}) {
    if (!hasFirebaseConfig || !firebaseDatabase) {
      throw new Error("Firebase database not configured");
    }

    try {
      const payload = {
        id: userId,
        name: profileData.name || profileData.displayName || "",
        email: profileData.email || "",
        studentId: profileData.studentId || profileData.username || "",
        role: profileData.role || "member",
        createdAt: profileData.createdAt || new Date().toISOString(),
      };

      await Promise.all(getUserNodePaths(userId).map((path) => set(ref(firebaseDatabase, path), payload)));
      return payload;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  /**
   * Update an existing user profile in the Realtime Database
   */
  export async function updateUserProfile(userId, profileData = {}) {
    if (!hasFirebaseConfig || !firebaseDatabase) {
      throw new Error("Firebase database not configured");
    }

    try {
      const currentProfile = await getUserProfile(userId);
      const payload = {
        ...(currentProfile || {}),
        ...profileData,
        id: userId,
      };

      await Promise.all(getUserNodePaths(userId).map((path) => set(ref(firebaseDatabase, path), payload)));
      return payload;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Get books by category with real-time updates
   */
  export function watchBooksByCategory(category, callback) {
    if (!hasFirebaseConfig || !firebaseDatabase) {
      console.warn("Firebase database not configured");
      return () => {};
    }

    try {
      const booksRef = ref(firebaseDatabase, "catalog/books");
      const unsubscribe = onValue(booksRef, (snapshot) => {
        if (snapshot.exists()) {
          const booksData = snapshot.val();
          const books = Object.keys(booksData)
            .map(key => ({
              id: key,
              ...booksData[key]
            }))
            .filter(book => book.category?.toLowerCase() === category?.toLowerCase());
          callback(books, null);
        } else {
          // Fallback to /books if /catalog/books doesn't exist
          const fallbackRef = ref(firebaseDatabase, "books");
          onValue(fallbackRef, (fallbackSnapshot) => {
            if (fallbackSnapshot.exists()) {
              const booksData = fallbackSnapshot.val();
              const books = Object.keys(booksData)
                .map(key => ({
                  id: key,
                  ...booksData[key]
                }))
                .filter(book => book.category?.toLowerCase() === category?.toLowerCase());
              callback(books, null);
            } else {
              callback([], null);
            }
          }, (error) => {
            console.error("Error watching books:", error);
            callback(null, error);
          });
        }
      }, (error) => {
        console.error("Error watching books:", error);
        callback(null, error);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up book listener:", error);
      return () => {};
    }
  }

  /**
   * Issue a book to a user
   * Updates: book quantity, user borrowed books, transaction history, circulation
   */
  export async function issueBook(bookId, userId, userEmail) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    let book = await getBookById(bookId);

    // If book is not present in Firebase but exists in fallback/static catalog,
    // create a record in Firebase so issuing/returning behaves consistently.
    if (!book) {
      const fallbackBooks = await getFallbackBooks();
      const fallback = fallbackBooks.find((b) => String(b.id) === String(bookId));
      if (fallback) {
        const quantity = Number(fallback.quantity ?? fallback.available ?? 1) || 1;
        const available = Number.isFinite(Number(fallback.available)) ? Number(fallback.available) : quantity;
        const payload = {
          id: String(bookId),
          title: fallback.title || "Untitled",
          author: fallback.author || "Unknown",
          isbn: fallback.isbn || "",
          category: fallback.category || "General",
          description: fallback.description || "",
          imageUrl: fallback.imageUrl || fallback.image || "/images/front_img_cover.jpg",
          quantity: quantity,
          available: available,
          createdAt: new Date().toISOString(),
        };

        // Try /catalog/books first, then fallback to /books
        await set(ref(firebaseDatabase, `catalog/books/${bookId}`), payload).catch(() => 
          set(ref(firebaseDatabase, `books/${bookId}`), payload)
        );
        book = normalizeBookRecord(String(bookId), payload);
      }
    }

    if (!book) {
      throw new Error("Book not found");
    }

    if (Number(book.available) <= 0) {
      throw new Error("Book is not available");
    }

    const timestamp = new Date().toISOString();
    const transactionId = push(ref(firebaseDatabase, "transactions")).key;

    // Update book quantity and create transaction
    const updates = {};

    // Decrease book availability in /catalog/books
    updates[`catalog/books/${bookId}/available`] = (book.available || 1) - 1;
    // Also update /books for fallback compatibility
    updates[`books/${bookId}/available`] = (book.available || 1) - 1;

    // Add to user's borrowed books
    for (const path of getUserChildPaths(userId, `borrowedBooks/${bookId}`)) {
      updates[path] = {
        bookId: bookId,
        bookTitle: book.title,
        author: book.author,
        category: book.category,
        imageUrl: book.imageUrl,
        issuedAt: timestamp,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
      };
    }

    // Record transaction
    updates[`transactions/${transactionId}`] = {
      id: transactionId,
      bookId: bookId,
      userId: userId,
      userEmail: userEmail,
      action: "ISSUED",
      timestamp: timestamp,
      bookTitle: book.title
    };

    // Add to circulation record
    updates[`circulation/${transactionId}`] = {
      id: transactionId,
      bookId: bookId,
      userId: userId,
      userEmail: userEmail,
      action: "ISSUED",
      timestamp: timestamp,
      bookTitle: book.title
    };

    // Add to transaction history
    for (const path of getUserChildPaths(userId, `transactionHistory/${transactionId}`)) {
      updates[path] = {
        bookId: bookId,
        action: "ISSUED",
        timestamp: timestamp
      };
    }

    await update(ref(firebaseDatabase), updates);

    return {
      success: true,
      message: `Book "${book.title}" issued successfully`,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error("Error issuing book:", error);
    throw error;
  }
}

/**
 * Return a book from a user
 * Updates: book quantity, user borrowed books, transaction history, circulation
 */
export async function returnBook(bookId, userId, userEmail) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const book = await getBookById(bookId);
    const userBorrowedBooks = await getUserBorrowedBooks(userId);

    if (!book) {
      throw new Error("Book not found");
    }

    if (!userBorrowedBooks?.[bookId]) {
      throw new Error("User does not have this book");
    }

    const timestamp = new Date().toISOString();
    const transactionId = push(ref(firebaseDatabase, "transactions")).key;
    const issuedData = userBorrowedBooks[bookId];

    // Update book quantity and create transaction
    const updates = {};

    // Increase book availability in /catalog/books
    updates[`catalog/books/${bookId}/available`] = (book.available || 0) + 1;
    // Also update /books for fallback compatibility
    updates[`books/${bookId}/available`] = (book.available || 0) + 1;

    // Remove from user's borrowed books
    for (const path of getUserChildPaths(userId, `borrowedBooks/${bookId}`)) {
      updates[path] = null;
    }

    // Record transaction
    updates[`transactions/${transactionId}`] = {
      id: transactionId,
      bookId: bookId,
      userId: userId,
      userEmail: userEmail,
      action: "RETURNED",
      timestamp: timestamp,
      bookTitle: book.title,
      issuedAt: issuedData.issuedAt,
      returnedAt: timestamp
    };

    // Add to circulation record
    updates[`circulation/${transactionId}`] = {
      id: transactionId,
      bookId: bookId,
      userId: userId,
      userEmail: userEmail,
      action: "RETURNED",
      timestamp: timestamp,
      bookTitle: book.title,
      issuedAt: issuedData.issuedAt,
      returnedAt: timestamp
    };

    // Add to transaction history
    for (const path of getUserChildPaths(userId, `transactionHistory/${transactionId}`)) {
      updates[path] = {
        bookId: bookId,
        action: "RETURNED",
        timestamp: timestamp,
        issuedAt: issuedData.issuedAt
      };
    }

    await update(ref(firebaseDatabase), updates);

    return {
      success: true,
      message: `Book "${book.title}" returned successfully`
    };
  } catch (error) {
    console.error("Error returning book:", error);
    throw error;
  }
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(userId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    for (const path of getUserChildPaths(userId, "transactionHistory")) {
      const snapshot = await get(ref(firebaseDatabase, path));
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        return Object.keys(historyData).map(key => ({
          id: key,
          ...historyData[key]
        }));
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw error;
  }
}

/**
 * Get all transactions (admin only)
 */
export async function getAllTransactions() {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const transactionsRef = ref(firebaseDatabase, "transactions");
    const snapshot = await get(transactionsRef);

    if (snapshot.exists()) {
      const transactionsData = snapshot.val();
      return Object.keys(transactionsData).map(key => ({
        id: key,
        ...transactionsData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

/**
 * Watch user's borrowed books with real-time updates
 */
export function watchUserBorrowedBooks(userId, callback) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    console.warn("Firebase database not configured");
    return () => {};
  }

  try {
    const userPaths = getUserChildPaths(userId, "borrowedBooks");
    const activeCallbacks = new Map();

    const emitCombined = async () => {
      for (const path of userPaths) {
        const snapshot = await get(ref(firebaseDatabase, path));
        if (snapshot.exists()) {
          callback(snapshot.val(), null);
          return;
        }
      }
      callback({}, null);
    };

    userPaths.forEach((path) => {
      const listener = onValue(ref(firebaseDatabase, path), () => {
        emitCombined();
      }, (error) => {
        console.error("Error watching borrowed books:", error);
        callback(null, error);
      });
      activeCallbacks.set(path, listener);
    });

    return () => {
      userPaths.forEach((path) => off(ref(firebaseDatabase, path)));
      activeCallbacks.clear();
    };
  } catch (error) {
    console.error("Error setting up borrowed books listener:", error);
    return () => {};
  }
}

/**
 * Get user's currently borrowed books count
 */
export async function getBorrowedBooksCount(userId) {
  if (!hasFirebaseConfig || !firebaseDatabase) {
    throw new Error("Firebase database not configured");
  }

  try {
    const borrowedBooks = await getUserBorrowedBooks(userId);
    return Object.keys(borrowedBooks || {}).length;
  } catch (error) {
    console.error("Error fetching borrowed books count:", error);
    return 0;
  }
}
