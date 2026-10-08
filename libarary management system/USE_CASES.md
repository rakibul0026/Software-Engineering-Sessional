# Library Management System - Use Cases

## 1. Introduction
This document outlines the primary use cases for the Library Management System, a full-stack application built with React frontend and Django backend, integrated with Firebase for authentication.

---

## 2. Actors

### Primary Actors
1. **Student/Member** - Regular user who can browse and borrow books
2. **Librarian/Admin** - Staff member managing library operations
3. **System Administrator** - Technical staff managing system configurations

### Secondary Actors
- Firebase Authentication Service
- Database System (PostgreSQL/SQLite)
- Email Service (for notifications)

---

## 3. Core Use Cases

### 3.1 Member/Student Use Cases

#### UC-01: Browse Library Books
**Actor:** Student/Member  
**Description:** User searches and browses available books in the library  
**Preconditions:** User is logged in  
**Main Flow:**
1. User navigates to Books page
2. System displays list of available books
3. User can filter by category, author, or publication
4. User can view book details including title, author, ISBN, copies available
5. System shows book availability status

**Alternate Flow:**
- User can search by keywords
- User can sort results by title, author, or publication date

**Postconditions:** Book information is displayed

---

#### UC-02: Borrow a Book
**Actor:** Student/Member  
**Description:** Member borrows a book from the library  
**Preconditions:** 
- User is logged in
- Book is available for borrowing
- User has no outstanding overdue books

**Main Flow:**
1. User views book details
2. User clicks "Borrow Book" button
3. System validates user's borrowing eligibility
4. System records the borrowing transaction
5. System displays confirmation with due date
6. System updates book availability count

**Postconditions:** 
- Book is marked as borrowed
- Borrowing record is created in database
- Confirmation is sent to user

---

#### UC-03: Return a Book
**Actor:** Student/Member  
**Description:** Member returns a borrowed book  
**Preconditions:** User has borrowed the book  
**Main Flow:**
1. User submits return request
2. System verifies book and user
3. System checks for overdue status
4. System updates book status to available
5. System calculates any applicable late fees
6. System displays receipt/confirmation

**Postconditions:** Book is marked as returned, borrowing record is closed

---

#### UC-04: View Profile and Borrowing History
**Actor:** Student/Member  
**Description:** User views personal information and borrowing history  
**Preconditions:** User is logged in  
**Main Flow:**
1. User navigates to Profile page
2. System displays user information
3. System shows current borrowed books
4. System shows borrowing history
5. System shows any outstanding fees

**Postconditions:** User information is displayed

---

#### UC-05: Submit Contact/Support Request
**Actor:** Student/Member  
**Description:** User sends a query or complaint to the library  
**Preconditions:** User is logged in  
**Main Flow:**
1. User navigates to Contact page
2. User fills in support form (name, email, message)
3. User submits form
4. System validates input
5. System stores contact message
6. System sends confirmation to user

**Postconditions:** Contact message is recorded in database

---

#### UC-06: Access Question Bank
**Actor:** Student/Member  
**Description:** User accesses question bank resources  
**Preconditions:** User is logged in  
**Main Flow:**
1. User navigates to Question Bank page
2. System displays available question sets
3. User selects a question set
4. System displays questions
5. User can download or view questions

**Postconditions:** Questions are displayed/downloaded

---

### 3.2 Admin/Librarian Use Cases

#### UC-07: Login to Admin Panel
**Actor:** Librarian/Admin  
**Description:** Admin authenticates into the system  
**Preconditions:** Admin has valid credentials  
**Main Flow:**
1. Admin navigates to Admin Login page
2. Admin enters email and password
3. System validates credentials via Firebase
4. System grants access to admin panel
5. System logs authentication event

**Postconditions:** Admin is authenticated and can access admin features

---

#### UC-08: Add New Books to Inventory
**Actor:** Librarian/Admin  
**Description:** Admin adds new books to library inventory  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Add Books" page
2. Admin fills in book details (title, author, ISBN, copies, etc.)
3. Admin can bulk upload from JSON/CSV
4. System validates book information
5. System adds books to inventory
6. System updates book count

**Postconditions:** New books are added to system

---

#### UC-09: Manage Book Issues and Returns
**Actor:** Librarian/Admin  
**Description:** Admin processes book borrowing and returns  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Issue Books" page
2. Admin can search for member and book
3. Admin records book issue/return
4. System updates availability
5. System generates transaction receipt

**Postconditions:** Book transaction is recorded

---

#### UC-10: Manage Members
**Actor:** Librarian/Admin  
**Description:** Admin manages library member accounts  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Members" page
2. Admin can view all members
3. Admin can search for specific member
4. Admin can view member details and history
5. Admin can edit member information
6. Admin can suspend/activate accounts

**Postconditions:** Member information is updated

---

#### UC-11: View Audit Logs
**Actor:** Librarian/Admin  
**Description:** Admin views system activity and transaction logs  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Audit Logs" page
2. System displays transaction logs
3. Admin can filter by date, user, or action
4. Admin can export logs
5. System shows borrowing/return transactions

**Postconditions:** Audit logs are displayed

---

#### UC-12: Manage RFID Tags
**Actor:** Librarian/Admin  
**Description:** Admin configures RFID tags for books  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "RFID Tags" page
2. Admin can create/assign RFID tags to books
3. Admin can track tagged books
4. System synchronizes with RFID hardware
5. Admin can view tag assignments

**Postconditions:** RFID tags are managed

---

#### UC-13: Manage QR System
**Actor:** Librarian/Admin  
**Description:** Admin manages QR codes for quick book access  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "QR System" page
2. Admin can generate QR codes for books
3. Admin can print QR code labels
4. Admin can track QR assignments
5. Users can scan QR to access book details

**Postconditions:** QR codes are generated and assigned

---

#### UC-14: Manage Publications and Subjects
**Actor:** Librarian/Admin  
**Description:** Admin manages publication records and subject categories  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Publications" or "Categories" page
2. Admin can add/edit/delete publications
3. Admin can add/edit/delete subject categories
4. System updates book categorization
5. Changes reflect in user-facing pages

**Postconditions:** Publications and categories are updated

---

#### UC-15: Manage Staff Accounts
**Actor:** Librarian/Admin  
**Description:** Admin manages other staff members and their permissions  
**Preconditions:** Admin is logged in (with appropriate permissions)  
**Main Flow:**
1. Admin navigates to "Staff" page
2. Admin can add new staff members
3. Admin can assign roles and permissions
4. Admin can view staff activity
5. Admin can deactivate staff accounts

**Postconditions:** Staff accounts are managed

---

#### UC-16: System Settings and Configuration
**Actor:** Librarian/Admin  
**Description:** Admin configures system-wide settings  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Settings" page
2. Admin can modify library configurations
3. Admin can set borrowing limits and due dates
4. Admin can manage late fees
5. Admin can configure notification settings

**Postconditions:** System settings are updated

---

#### UC-17: Manage E-books Section
**Actor:** Librarian/Admin  
**Description:** Admin manages digital/e-book collection  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "E-books" page
2. Admin can upload e-books
3. Admin can set access controls
4. Admin can track e-book downloads
5. Admin can manage e-book metadata

**Postconditions:** E-books are managed

---

#### UC-18: Manage Question Bank
**Actor:** Librarian/Admin  
**Description:** Admin manages educational question bank resources  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Question Bank" page
2. Admin can add/edit question sets
3. Admin can organize by subject/category
4. Admin can set visibility and access levels
5. Admin can bulk upload questions

**Postconditions:** Question bank is updated

---

#### UC-19: View Reports and Analytics
**Actor:** Librarian/Admin  
**Description:** Admin generates and views library statistics  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to Reports section
2. Admin selects report type
3. System generates statistics:
   - Most borrowed books
   - Member activity
   - Overdue books
   - Collection statistics
4. Admin can export reports

**Postconditions:** Reports are generated and displayed

---

### 3.3 System-Level Use Cases

#### UC-20: Authentication via Firebase
**Actor:** System  
**Description:** System authenticates users via Firebase  
**Preconditions:** Firebase is configured  
**Main Flow:**
1. User submits credentials
2. System sends request to Firebase
3. Firebase validates credentials
4. Firebase returns auth token
5. System stores token in session
6. System grants access

**Postconditions:** User is authenticated

---

#### UC-21: Backup and Data Management
**Actor:** System Administrator  
**Description:** System performs automated backups and data maintenance  
**Preconditions:** Admin access available  
**Main Flow:**
1. System scheduler triggers backup
2. Database is backed up
3. Backup is stored securely
4. System logs backup completion
5. Admin can manually initiate backups

**Postconditions:** Data is backed up

---

---

## 4. Use Case Relationships

### Association Matrix

| UC # | Title | Primary Actor | Related UCs |
|------|-------|---------------|-----------|
| UC-01 | Browse Books | Member | UC-02, UC-06 |
| UC-02 | Borrow Book | Member | UC-01, UC-03, UC-09 |
| UC-03 | Return Book | Member | UC-02, UC-09 |
| UC-04 | View Profile | Member | UC-02, UC-03 |
| UC-05 | Contact Support | Member | - |
| UC-06 | Access Question Bank | Member | UC-01 |
| UC-07 | Admin Login | Admin | All Admin UCs |
| UC-08 | Add Books | Admin | UC-10, UC-19 |
| UC-09 | Manage Issues | Admin | UC-02, UC-03 |
| UC-10 | Manage Members | Admin | UC-07, UC-09 |
| UC-11 | Audit Logs | Admin | All UCs |
| UC-12 | RFID Management | Admin | UC-08, UC-09 |
| UC-13 | QR Management | Admin | UC-01, UC-08 |
| UC-14 | Manage Categories | Admin | UC-01, UC-08 |
| UC-15 | Staff Management | Admin | UC-07, UC-11 |
| UC-16 | System Settings | Admin | All UCs |
| UC-17 | E-books Management | Admin | UC-01, UC-19 |
| UC-18 | Question Bank | Admin | UC-06 |
| UC-19 | Reports & Analytics | Admin | All UCs |
| UC-20 | Firebase Auth | System | UC-01, UC-07 |
| UC-21 | Backup & Maintenance | System Admin | - |

---

## 5. Non-Functional Requirements

- **Performance:** System should respond within 2 seconds
- **Security:** All passwords encrypted, Firebase security rules enforced
- **Availability:** System available 99% of the time
- **Scalability:** Support 1000+ concurrent users
- **Data Integrity:** Transaction logs maintained for all operations
- **Usability:** Intuitive UI for both members and admins

---

## 6. Technology Stack

- **Frontend:** React with Vite
- **Backend:** Django REST Framework
- **Database:** PostgreSQL / SQLite
- **Authentication:** Firebase Auth
- **Additional:** RFID support, QR code integration

---

## 7. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-13 | System | Initial use case documentation |

