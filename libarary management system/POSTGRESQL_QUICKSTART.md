# PostgreSQL Quick Start (Windows)

## 1) Install PostgreSQL
Install PostgreSQL Server and keep the default port 5432.

## 2) Create database and user
Open pgAdmin Query Tool (or psql) and run:

```sql
CREATE DATABASE library_db;
CREATE USER library_user WITH PASSWORD 'StrongPassword123';
GRANT ALL PRIVILEGES ON DATABASE library_db TO library_user;
```

## 3) Activate virtual environment
Run in project root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
```

## 4) Install dependencies
```powershell
python -m pip install -r requirements.txt
```

## 5) Set PostgreSQL environment variables
```powershell
$env:DB_ENGINE="postgresql"
$env:DB_NAME="library_db"
$env:DB_USER="library_user"
$env:DB_PASSWORD="StrongPassword123"
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="5432"
```

## 6) Run migrations and start app
```powershell
cd "e:\react_library_manegement_system\libarary management system\Backend"
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Open: http://127.0.0.1:8000

## Notes
- To return to SQLite, remove DB_* environment variables.
- Keep credentials out of source control in production.