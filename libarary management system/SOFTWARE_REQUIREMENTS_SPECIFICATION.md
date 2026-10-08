# Software Requirements Specification

for

Library Management System

Version 1.0 approved

Prepared by GitHub Copilot

Library Management System Project

2026-07-06

## Revision History

| Name | Date | Reason For Changes | Version |
| --- | --- | --- | --- |
| GitHub Copilot | 2026-07-06 | Initial IEEE-format SRS draft for the current library management system | 1.0 |

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Library Management System project. It describes the functions, interfaces, data, and quality constraints needed for a web-based library portal used by students, staff, and administrators.

### 1.2 Document Conventions
This SRS uses the IEEE-style section structure from the provided template. Requirement statements use the word shall. Requirement identifiers are written as REQ-x within system feature subsections.

### 1.3 Intended Audience and Reading Suggestions
This document is intended for developers, testers, project supervisors, and maintainers. Readers should begin with Sections 1 and 2 for context, review Section 4 for functional requirements, and then review Sections 5 and 6 for quality and business constraints.

### 1.4 Product Scope
The system is a digital library portal that supports public browsing, authenticated user access, book circulation, contact submission, and administrative management. It combines a React/Vite frontend with a Django backend and is designed to organize and present library resources in a structured way.

### 1.5 References
- `srs_template-ieee.pdf`, IEEE-style SRS template used to structure this document.
- `react-frontend/README.md`, notes about the generated React frontend.
- `Backend/library_api/models.py`, backend data models for books and contact messages.
- `Backend/library_api/views.py`, backend API and authentication views.

## 2. Overall Description

### 2.1 Product Perspective
This product is a web-based library management system built as a client-server application.
- Frontend: React/Vite single-page application
- Backend: Django application exposing JSON endpoints
- Database: SQLite in development, with support documentation for alternate database setups
- Authentication: Django session auth and optional Firebase token login

### 2.2 Product Functions
The major functions of the product are to:
- Present public library pages and category-based browsing
- Allow user sign-up, login, and profile access
- Support issuing and returning books for authenticated users
- Allow administrators to manage books, members, staff, publications, e-books, question banks, RFID utilities, settings, and audit information
- Accept and store contact messages from visitors
- Expose API endpoints for health checks, books, authentication, and message submission

### 2.3 User Classes and Characteristics
- Guest User: Browses public pages and submits contact forms.
- Registered User: Signs in, views account-related pages, and uses permitted circulation functions.
- Admin User: Maintains inventory and library content through the administrative pages.
- Developer/Maintainer: Updates frontend pages, backend APIs, and supporting data models.

### 2.4 Operating Environment
The software shall operate in modern desktop and mobile browsers and run against a Django backend service. The frontend is expected to run through Vite during development and through a hosted web server in deployment. The backend currently uses SQLite for local development.

### 2.5 Design and Implementation Constraints
- The frontend is based on generated React pages and route mappings.
- Public and admin workflows must remain compatible with the existing project structure.
- Protected operations must respect authentication and permission checks.
- Data interchange must use JSON over HTTP.

### 2.6 User Documentation
The project should provide at minimum:
- A setup guide for running the backend and frontend
- Login and admin usage notes
- Database connection and integration guides
- A short user guide for browsing books, sending messages, and using admin pages

### 2.7 Assumptions and Dependencies
The system assumes that users have browser access and that administrators will maintain content and configuration data. The project depends on React, Django, SQLite or another configured database, and optional Firebase authentication support.

## 3. External Interface Requirements

### 3.1 User Interfaces
The user interface shall provide responsive pages for public visitors and administrators. The UI shall support navigation to books, categories, publications, login, profile, contact, question bank, QR system, RFID scanner, and admin sections. Forms shall provide visible validation feedback for missing or invalid entries.

### 3.2 Hardware Interfaces
No special hardware interface is required for the base system. If RFID or scanner hardware is integrated later, it shall be exposed through the existing RFID-related pages and supporting backend services.

### 3.3 Software Interfaces
The frontend shall communicate with the backend using HTTP requests and JSON payloads. The backend shall integrate with Firebase token verification when configured. The backend shall persist library data through its configured database layer.

### 3.4 Communications Interfaces
The system shall use HTTP/HTTPS for communication between the frontend and backend. API responses shall use JSON. Authentication-related communication shall preserve session state and support token-based exchange where configured.

## 4. System Features

### 4.1 Public Library Browsing
#### 4.1.1 Description and Priority
This feature provides public access to the library home page, category pages, and resource listings. Priority: High.

#### 4.1.2 Stimulus/Response Sequences
- A visitor opens the home page, and the system displays featured content and category navigation.
- A visitor selects a category, and the system shows the related collection.

#### 4.1.3 Functional Requirements
- REQ-1: The system shall display a home page with featured library information and category navigation.
- REQ-2: The system shall allow visitors to browse books by category.
- REQ-3: The system shall display book title, author, category, status, image, and availability information.
- REQ-4: The system shall provide public pages for About, Contact, Rules, Business, Fiction, History, Publication, E-book, Question Bank, and similar content.

### 4.2 Authentication and Account Access
#### 4.2.1 Description and Priority
This feature provides account creation, login, session handling, and profile access. Priority: High.

#### 4.2.2 Stimulus/Response Sequences
- A visitor submits login credentials, and the system authenticates the user.
- A configured client submits a Firebase token, and the backend validates the identity.

#### 4.2.3 Functional Requirements
- REQ-5: The system shall allow users to sign up and log in with username and password.
- REQ-6: The system shall support authenticated login via Firebase ID token when configured.
- REQ-7: The system shall maintain session state for authenticated users.
- REQ-8: The system shall allow logged-in users to access profile-related information.

### 4.3 Book Circulation
#### 4.3.1 Description and Priority
This feature manages book inventory status and user circulation actions. Priority: High.

#### 4.3.2 Stimulus/Response Sequences
- An authenticated user requests to issue a book, and the system marks it issued if available.
- An authenticated user returns a previously issued book, and the system marks it available.

#### 4.3.3 Functional Requirements
- REQ-9: The system shall store book records with title, author, category, status, image, issued-by indicator, and available copies.
- REQ-10: The system shall allow administrators to create, update, and replace book inventories.
- REQ-11: The system shall allow administrators to search books by title, author, or category.
- REQ-12: The system shall show whether a book is available or issued.
- REQ-13: The system shall support issuing a book to an authenticated user.
- REQ-14: The system shall support returning a book that was previously issued by the current user.

### 4.4 Administrative Management
#### 4.4.1 Description and Priority
This feature provides admin pages for managing the library system. Priority: High.

#### 4.4.2 Stimulus/Response Sequences
- An administrator opens the admin dashboard and manages library resources.
- An administrator navigates to books, members, staff, publications, or settings pages.

#### 4.4.3 Functional Requirements
- REQ-15: The system shall provide an admin dashboard for managing library operations.
- REQ-16: The system shall allow administrators to add and edit books.
- REQ-17: The system shall allow administrators to manage members.
- REQ-18: The system shall allow administrators to manage staff data.
- REQ-19: The system shall allow administrators to manage publications.
- REQ-20: The system shall allow administrators to manage e-book sections.
- REQ-21: The system shall allow administrators to manage question bank content.
- REQ-22: The system shall allow administrators to manage RFID tags and scanner-related utilities.
- REQ-23: The system shall provide admin settings and audit-log pages.

### 4.5 Contact and Feedback Submission
#### 4.5.1 Description and Priority
This feature allows visitors to submit library inquiries and feedback. Priority: Medium.

#### 4.5.2 Stimulus/Response Sequences
- A visitor opens the contact page and submits a message.
- The system validates the input and stores the message.

#### 4.5.3 Functional Requirements
- REQ-24: The system shall allow users to submit inquiry messages.
- REQ-25: The system shall validate required contact fields before submission.
- REQ-26: The system shall store submitted messages for administrative review.

### 4.6 API and Health Services
#### 4.6.1 Description and Priority
This feature provides machine-readable endpoints for integration and monitoring. Priority: High.

#### 4.6.2 Stimulus/Response Sequences
- A client requests the API root or health endpoint, and the system returns structured JSON.
- An application sends a book or authentication request, and the backend processes it.

#### 4.6.3 Functional Requirements
- REQ-27: The system shall expose a root API endpoint describing available services.
- REQ-28: The system shall expose a health endpoint for service monitoring.
- REQ-29: The system shall expose book collection and book detail endpoints.
- REQ-30: The system shall expose authentication endpoints for signup, login, logout, and Firebase login.
- REQ-31: The system shall expose a contact-message submission endpoint.

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements
The system shall respond to common browsing actions within acceptable web application times under normal load. Book search and page loading should remain responsive for everyday use.

### 5.2 Safety Requirements
The system does not control physical equipment or safety-critical operations. Any future hardware integration, such as RFID scanners, shall be implemented so that incorrect input does not cause unsafe library operations.

### 5.3 Security Requirements
Passwords shall be stored using secure hashing. Protected actions shall require authentication. Admin-only actions shall be restricted to authorized users. User input shall be validated before persistence or processing. Sensitive endpoints shall return appropriate error responses when authentication fails.

### 5.4 Software Quality Attributes
The system should emphasize correctness, maintainability, usability, and reliability. The codebase should remain modular across frontend components, backend views, models, and service utilities. The interface should remain easy to navigate for students and staff.

### 5.5 Business Rules
- A book can only be issued when it is marked as available.
- A book can only be returned by the user who issued it through the current session.
- Contact messages must include a full name, student ID, email, and message text.
- Invalid inquiry types shall default to the general inquiry category.
- Empty or malformed JSON payloads shall be rejected with clear error messages.

## 6. Other Requirements

### 6.1 Data Requirements
Core data entities shall include books, contact messages, user accounts, and admin-managed content such as members, staff, publications, and logs. Book data shall include ID, title, author, category, status, image path, issued-by flag, copies available, and timestamps. Contact message data shall include full name, student ID, email, inquiry type, message text, and created timestamp.

### 6.2 Out of Scope
The initial implementation does not include online payments, automated fine calculation, barcode printer integration, multi-branch synchronization, or AI-based recommendation features.

### 6.3 Acceptance Criteria
The system shall be considered acceptable when public users can browse and contact the library, users can authenticate and access permitted features, books can be managed and circulated according to permissions, administrators can manage library content through the admin pages, and API endpoints return valid JSON responses.

## Appendix A: Glossary
- API: Application Programming Interface
- CRUD: Create, Read, Update, Delete
- Firebase: External authentication and backend service platform
- RFID: Radio Frequency Identification
- SRS: Software Requirements Specification
- Vite: Frontend build tool used by the React application

## Appendix B: Analysis Models
The project may include the following analysis models in future documentation:
- Entity-relationship model for books, users, and contact messages
- Navigation flow for public and admin pages
- API interaction model for book and authentication endpoints

## Appendix C: To Be Determined List
1. Final deployment database choice.
2. Final administrative workflow for RFID and scanner hardware integration.
3. Final formatting requirements for any exported PDF or printed version of this SRS.