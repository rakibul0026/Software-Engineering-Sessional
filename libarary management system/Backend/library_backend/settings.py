from __future__ import annotations

import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent


def _env(name: str, default: str = "") -> str:
    value = os.getenv(name, default)
    return value.strip() if isinstance(value, str) else default


def _database_config() -> dict[str, object]:
    engine = _env("DB_ENGINE", "django.db.backends.sqlite3")
    engine = {
        "sqlite3": "django.db.backends.sqlite3",
        "postgresql": "django.db.backends.postgresql",
        "postgres": "django.db.backends.postgresql",
    }.get(engine, engine)

    if engine == "django.db.backends.sqlite3":
        db_name = _env("DB_NAME", str(BASE_DIR / "db.sqlite3"))
        return {
            "ENGINE": engine,
            "NAME": db_name,
        }

    return {
        "ENGINE": engine,
        "NAME": _env("DB_NAME", "library_db"),
        "USER": _env("DB_USER", "library_user"),
        "PASSWORD": _env("DB_PASSWORD", ""),
        "HOST": _env("DB_HOST", "127.0.0.1"),
        "PORT": _env("DB_PORT", "5432"),
    }


SECRET_KEY = _env("DJANGO_SECRET_KEY", "django-insecure-library-backend-dev-key")
DEBUG = _env("DJANGO_DEBUG", "1") == "1"

ALLOWED_HOSTS = [
    host
    for host in _env("DJANGO_ALLOWED_HOSTS", "*").split(",")
    if host.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "library_api.apps.LibraryApiConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "library_backend.middleware.CORSMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "library_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "library_backend.wsgi.application"
ASGI_APPLICATION = "library_backend.asgi.application"

DATABASES = {
    "default": _database_config(),
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = _env("DJANGO_TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

FRONTEND_ORIGIN = _env("FRONTEND_ORIGIN", "http://localhost:5173")
