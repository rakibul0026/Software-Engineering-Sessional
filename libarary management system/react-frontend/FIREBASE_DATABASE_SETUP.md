# Firebase Realtime Database Setup Guide

## Database Structure

Your Firebase Realtime Database should be organized as follows:

```
/books
  /bookId1
    - id: "bookId1"
    - title: "Book Title"
    - author: "Author Name"
    - isbn: "978-0-123456-78-9"
    - category: "Fiction"
    - description: "Book description..."
    - imageUrl: "https://example.com/image.jpg"
    - quantity: 5
    - available: 3
    - publishedYear: 2023
    - publisher: "Publisher Name"
  /bookId2
    - (same structure)

/users
  /userId1
    - email: "user@example.com"
    - displayName: "User Name"
    - role: "admin" | "member"
    - createdAt: "2026-04-30T12:00:00.000Z"
    - borrowedBooks: ["bookId1", "bookId2"]
    - borrowHistory: [...]
```

## How to Add Books to Firebase

### Option 1: Firebase Console (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **CSTU-LMS** project
3. Go to **Realtime Database**
4. Click **Create Database** (if not created yet)
5. Choose **Start in test mode** for development
6. Click on the **Data** tab
7. Click the **+** button to add `books` node
8. Add book data following the structure above

### Option 2: Import JSON (Bulk Upload)
1. In Firebase Console, go to Realtime Database
2. Click the three-dot menu → **Import JSON**
3. Upload a JSON file with books data:

```json
{
  "books": {
    "book_fiction_001": {
      "id": "book_fiction_001",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5",
      "category": "Fiction",
      "description": "A classic American novel about wealth, love, and the American Dream.",
      "imageUrl": "https://example.com/gatsby.jpg",
      "quantity": 10,
      "available": 7,
      "publishedYear": 1925,
      "publisher": "Scribner"
    },
    "book_science_001": {
      "id": "book_science_001",
      "title": "A Brief History of Time",
      "author": "Stephen Hawking",
      "isbn": "978-0-553-38016-3",
      "category": "Science/Tech",
      "description": "Explores the universe from the Big Bang to black holes.",
      "imageUrl": "https://example.com/history.jpg",
      "quantity": 8,
      "available": 6,
      "publishedYear": 1988,
      "publisher": "Bantam"
    },
    "book_history_001": {
      "id": "book_history_001",
      "title": "The History of Rome",
      "author": "Various",
      "isbn": "978-0-14-143951-8",
      "category": "History",
      "description": "A comprehensive history of the Roman Empire.",
      "imageUrl": "https://example.com/rome.jpg",
      "quantity": 5,
      "available": 4,
      "publishedYear": 1991,
      "publisher": "Penguin"
    },
    "book_business_001": {
      "id": "book_business_001",
      "title": "Good to Great",
      "author": "Jim Collins",
      "isbn": "978-0-06-662099-2",
      "category": "Business",
      "description": "Why some companies make the leap and others don't.",
      "imageUrl": "https://example.com/great.jpg",
      "quantity": 12,
      "available": 10,
      "publishedYear": 2001,
      "publisher": "HarperBusiness"
    }
  }
}
```

## Using the Database Service in Components

### Fetch all books:
```javascript
import { getAllBooks } from "../lib/databaseService";

const [books, setBooks] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getAllBooks()
    .then(data => {
      setBooks(data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Failed to load books:", error);
      setLoading(false);
    });
}, []);
```

### Fetch books by category:
```javascript
import { getBooksByCategory } from "../lib/databaseService";

useEffect(() => {
  getBooksByCategory("Fiction")
    .then(books => setBooks(books))
    .catch(error => console.error(error));
}, []);
```

### Real-time listening for updates:
```javascript
import { watchBooks } from "../lib/databaseService";

useEffect(() => {
  const unsubscribe = watchBooks((books, error) => {
    if (error) {
      console.error("Error:", error);
    } else {
      setBooks(books);
    }
  });

  return () => unsubscribe(); // Cleanup listener
}, []);
```

### Search books:
```javascript
import { searchBooks } from "../lib/databaseService";

const handleSearch = async (term) => {
  const results = await searchBooks(term);
  setBooks(results);
};
```

## Firebase Database Rules (Security)

For development/testing, use these rules:

```json
{
  "rules": {
    "books": {
      ".read": true,
      ".write": false
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child($uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

**IMPORTANT**: Before deploying to production, update these rules to be more restrictive!

## Categories Available

Update your pages to use these exact category names:
- "Fiction"
- "Science/Tech"
- "History"
- "Business"

The `getBooksByCategory()` function performs case-insensitive matching.

## File Structure

```
src/lib/
  ├── firebaseClient.js       (Firebase initialization)
  ├── authService.js          (Authentication)
  └── databaseService.js      (Database operations) ← NEW
```

## Next Steps

1. Create your books data in Firebase Console
2. Update your pages to import and use `databaseService.js` functions
3. Replace static book arrays with `getAllBooks()` or `watchBooks()`
4. Test each category page (Business, Fiction, History, Science/Tech)
