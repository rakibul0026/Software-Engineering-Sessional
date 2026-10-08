# Library Management System

A full-stack digital library portal for browsing books, managing circulation, and administering library operations.

The project combines a React/Vite single-page frontend with a Django REST-style backend. SQLite is used by default for local development, with PostgreSQL and Firebase integration supported through configuration.

## Features

- Public library pages and category-based book browsing
- User registration, login, sessions, and profile access
- Book issue and return workflows
- Book inventory and availability tracking
- Contact message submission
- Admin pages for books, members, staff, publications, e-books, question banks, RFID utilities, settings, and audit logs
- Optional Firebase Authentication and Realtime Database integration
- Optional PostgreSQL database configuration

## Project Structure

```text
libarary management system/
├── Backend/                 # Django backend and API
│   ├── manage.py
│   ├── library_api/         # Models, views, auth, migrations
│   └── library_backend/     # Django project configuration
├── react-frontend/          # React/Vite frontend
│   ├── src/pages/           # Public and admin pages
│   ├── src/components/      # Shared React components
│   └── src/lib/             # Auth and database services
├── requirements.txt         # Python dependencies
└── run.txt                  # Local startup commands
```

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer and npm
- Git
- Optional: a Firebase project for Firebase authentication and realtime data
- Optional: PostgreSQL for a non-SQLite database

## Local Setup

The commands below are written for PowerShell on Windows. Run them from the repository root.

### 1. Set up the backend

```powershell
cd "libarary management system"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd Backend
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

The Django API will be available at `http://127.0.0.1:8000`.

To create an administrator account, run this from the `Backend` directory:

```powershell
python manage.py createsuperuser
```

### 2. Set up the frontend

Open a second terminal:

```powershell
cd "libarary management system\react-frontend"
npm install
$env:VITE_API_BASE_URL="http://127.0.0.1:8000"
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173` in a browser.

### Frontend commands

```powershell
npm run dev              # Start the Vite development server
npm run build            # Create a production build
npm run preview          # Preview the production build locally
npm run generate:pages   # Regenerate React pages from source templates
```

## Configuration

### Frontend environment variables

Set these values in the frontend terminal or in a local `.env` file inside `libarary management system/react-frontend`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firebase is initialized only when all Firebase variables are populated. Do not commit real credentials or private service-account files.

### Backend environment variables

The backend uses SQLite by default. Common configuration variables include:

```env
DJANGO_SECRET_KEY=replace-this-in-production
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
FRONTEND_ORIGIN=http://127.0.0.1:5173
```

For PostgreSQL, set `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT`. See the database guides in the project directory for complete instructions.

## API

The Django application mounts API routes under `/api/` and the Django admin under `/admin/`:

- `http://127.0.0.1:8000/api/`
- `http://127.0.0.1:8000/admin/`

The exact endpoints are defined in `libarary management system/Backend/library_api/urls.py`.

## Firebase Data

When configured, the frontend uses Firebase services for authentication and library data. The documented data areas include:

- `/catalog/books`
- `/catalog/categories`
- `/circulation`
- `/transactions`
- `/users`
- `/members`
- `/system_administration`

See [FIREBASE_INTEGRATION_GUIDE.md](libarary%20management%20system/FIREBASE_INTEGRATION_GUIDE.md) and [FIREBASE_DATABASE_SETUP.md](libarary%20management%20system/react-frontend/FIREBASE_DATABASE_SETUP.md) for setup details.

## Documentation

- [Software Requirements Specification](libarary%20management%20system/SOFTWARE_REQUIREMENTS_SPECIFICATION.md)
- [Use Cases](libarary%20management%20system/USE_CASES.md)
- [Admin Database Quick Start](libarary%20management%20system/ADMIN_DATABASE_QUICKSTART.md)
- [Admin Database API Reference](libarary%20management%20system/ADMIN_DATABASE_API_REFERENCE.md)
- [Firebase Integration Guide](libarary%20management%20system/FIREBASE_INTEGRATION_GUIDE.md)
- [PostgreSQL Quick Start](libarary%20management%20system/POSTGRESQL_QUICKSTART.md)
- [Frontend README](libarary%20management%20system/react-frontend/README.md)

## Development Notes

- Use the Django backend and Vite frontend together for local development.
- Keep secrets, Firebase service-account files, and local `.env` files out of version control.
- Run `npm run build` after frontend changes to catch production build errors.
- Run `python manage.py check` and the Django test suite after backend changes.
