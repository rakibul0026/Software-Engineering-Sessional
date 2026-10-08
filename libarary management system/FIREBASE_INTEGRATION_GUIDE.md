# Firebase Integration Guide

## Firebase Structure Overview

Your Firebase Realtime Database has the following structure:

```
cstu-lms-default-rtdb/
├── books/                    # Fallback book storage (legacy)
├── catalog/
│   ├── books/               # Primary book catalog (NEW)
│   └── categories/          # Book categories (28 categories)
├── circulation/             # Book circulation records
├── members/                 # Member profiles
├── system_administration/   # Admin & staff credentials
├── transactions/            # Transaction records
└── users/                   # User profiles
```

---

## Updates Made to Your Application

### 1. **Database Service Updates** ✅
The web application has been updated to properly read from your Firebase structure:

- **Books Reading**: Now checks `/catalog/books` first, then fallbacks to `/books`
- **Book Operations**: All book CRUD operations now use `/catalog/books`
- **Circulation Tracking**: Issue/Return operations now log to `/circulation` path
- **Transactions**: All transactions recorded in `/transactions` path
- **User Data**: User profiles and borrowed books stored in `/users` and `/members`

### 2. **Functions Updated**

| Function | Path Used | Description |
|----------|-----------|-------------|
| `getAllBooks()` | `/catalog/books` | Fetch all books |
| `getBooksByCategory()` | `/catalog/books` | Filter books by category |
| `getBookById()` | `/catalog/books/{id}` | Get single book |
| `addBook()` | `/catalog/books` | Add new book |
| `searchBooks()` | `/catalog/books` | Search by title/author |
| `watchBooks()` | `/catalog/books` | Real-time book updates |
| `issueBook()` | `/catalog/books`, `/circulation`, `/transactions` | Issue book to user |
| `returnBook()` | `/catalog/books`, `/circulation`, `/transactions` | Return book from user |

---

## How Your Web App Now Works

### Reading Books
```javascript
import { getAllBooks } from "./lib/databaseService";

// This now reads from /catalog/books
const books = await getAllBooks();
```

### Issuing a Book
```javascript
import { issueBook } from "./lib/databaseService";

await issueBook(bookId, userId, userEmail);

// Updates:
// - /catalog/books/{bookId}/available (decreases)
// - /circulation/{transactionId} (new record)
// - /transactions/{transactionId} (new record)
// - /users/{userId}/borrowedBooks/{bookId}
```

### Real-time Updates
```javascript
import { watchBooks } from "./lib/databaseService";

// Real-time listener on /catalog/books
watchBooks((books, error) => {
  if (error) console.error(error);
  console.log("Books updated:", books);
});
```

---

## Firebase Data Structure Details

### `/catalog/books` Structure
```json
{
  "img_book_001": {
    "id": "img_book_001",
    "title": "Machine Learning Algorithm",
    "author": "CSTU Library",
    "category": "GENERAL",
    "isbn": "Pending (img_ML_001)",
    "total_quantity": 15,
    "available_quantity": 14,
    "description": "Introduction to fundamental ML concepts.",
    "imageUrl": "/images/machine-learning-algorithm.jpg",
    "createdAt": "2026-05-04T..."
  }
}
```

### `/circulation` Structure
```json
{
  "txn_001": {
    "id": "txn_001",
    "bookId": "img_book_001",
    "userId": "user_123",
    "userEmail": "student@cstu.edu",
    "action": "ISSUED",
    "timestamp": "2026-05-04T...",
    "bookTitle": "Machine Learning Algorithm"
  }
}
```

### `/transactions` Structure
```json
{
  "txn_001": {
    "id": "txn_001",
    "bookId": "img_book_001",
    "userId": "user_123",
    "userEmail": "student@cstu.edu",
    "action": "ISSUED",
    "timestamp": "2026-05-04T..."
  }
}
```

### `/users` & `/members` Structure
```json
{
  "user_123": {
    "id": "user_123",
    "name": "Student Name",
    "email": "student@cstu.edu",
    "studentId": "CSTU001",
    "role": "member",
    "borrowedBooks": {
      "img_book_001": {
        "bookId": "img_book_001",
        "bookTitle": "Machine Learning Algorithm",
        "author": "CSTU Library",
        "issuedAt": "2026-05-04T...",
        "dueDate": "2026-05-18T..."
      }
    },
    "transactionHistory": {
      "txn_001": {
        "action": "ISSUED",
        "timestamp": "2026-05-04T..."
      }
    }
  }
}
```

---

## Troubleshooting

### Books Not Appearing?
1. Check Firebase rules allow read access to `/catalog/books`
2. Ensure `/catalog/books` contains data (not empty)
3. Check browser console for Firebase errors
4. Verify Firebase configuration in `.env`

### Issue/Return Not Working?
1. Verify user exists in `/users` or `/members`
2. Check Firebase rules allow write access to `/catalog/books`
3. Ensure `copies_available` field exists in book data

### Real-time Updates Not Triggering?
1. Verify Firebase rules allow listen access
2. Check network tab for Firebase connections
3. Ensure callback functions are properly defined

---

## Required Firebase Rules

For your web app to work properly, configure these Firebase Realtime Database rules:

```json
{
  "rules": {
    "catalog": {
      "books": {
        ".read": true,
        ".write": "auth != null"
      },
      "categories": {
        ".read": true,
        ".write": "auth != null && root.child('system_administration').child('admin_credentials').child('admin_user').child('email').val() === auth.token.email"
      }
    },
    "books": {
      ".read": true,
      ".write": "auth != null"
    },
    "circulation": {
      ".read": true,
      ".write": "auth != null"
    },
    "members": {
      "$uid": {
        ".read": "$uid === auth.uid || auth.token.email === admin@123",
        ".write": "$uid === auth.uid"
      }
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "transactions": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "system_administration": {
      ".read": "auth != null",
      ".write": false
    }
  }
}
```

---

## Next Steps

1. ✅ **Verify Firebase Configuration** - Check `.env` has all Firebase keys
2. ✅ **Test Book Fetching** - Open BooksPage and verify books load
3. ✅ **Test Issue/Return** - Try issuing and returning a book
4. ✅ **Monitor Circulation** - Check `/circulation` path in Firebase Console
5. ✅ **Real-time Sync** - Open app in multiple tabs, verify updates sync

---

## API Reference

### Core Functions

#### `getAllBooks()`
```javascript
const books = await getAllBooks();
// Returns: Array of book objects
```

#### `getBooksByCategory(category)`
```javascript
const engineeringBooks = await getBooksByCategory("ENGINEERING");
// Returns: Array of books in that category
```

#### `getBookById(bookId)`
```javascript
const book = await getBookById("img_book_001");
// Returns: Single book object or null
```

#### `issueBook(bookId, userId, userEmail)`
```javascript
await issueBook("img_book_001", "user_123", "student@cstu.edu");
// Returns: { success: true, message: "...", dueDate: "..." }
```

#### `returnBook(bookId, userId, userEmail)`
```javascript
await returnBook("img_book_001", "user_123", "student@cstu.edu");
// Returns: { success: true, message: "..." }
```

---

## File Changes Summary

✅ **Updated**: `/react-frontend/src/lib/databaseService.js`
- Changed book path from `/books` to `/catalog/books`
- Added fallback support for `/books` path
- Updated all book operations to use new path
- Added `/circulation` path tracking
- Improved real-time listeners

---

## Support

For issues or questions about Firebase integration:
1. Check browser console for error messages
2. Verify Firebase project URL matches configuration
3. Confirm Firebase rules allow necessary operations
4. Review transaction logs in `/circulation` path
