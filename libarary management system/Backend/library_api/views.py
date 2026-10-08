from __future__ import annotations

import json

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import models, transaction
from django.http import HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .firebase_auth import verify_firebase_id_token
from .models import Book, ContactMessage
from .seed_data import DEFAULT_BOOKS


def _json_error(message: str, status: int = 400) -> JsonResponse:
    return JsonResponse({"detail": message}, status=status)


def _parse_body(request):
    if not request.body:
        return {}

    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return None


def _book_list_payload(queryset) -> list[dict[str, object]]:
    return [book.to_payload() for book in queryset]


def _book_from_payload(payload, existing_book=None):
    title = str(payload.get("title", "")).strip()
    if not title:
        raise ValueError("title is required")

    status = payload.get("status")
    if status not in {Book.STATUS_AVAILABLE, Book.STATUS_ISSUED}:
        status = Book.STATUS_AVAILABLE

    issued_by = payload.get("issuedBy")
    if status != Book.STATUS_ISSUED:
        issued_by = ""
    elif issued_by not in {"self", "other"}:
        issued_by = "other"

    book = existing_book or Book()
    book.title = title
    book.author = str(payload.get("author", "Unknown Author")).strip() or "Unknown Author"
    book.category = str(payload.get("category", "General")).strip() or "General"
    book.status = status
    book.image = str(payload.get("image", "/images/front_img_cover.jpg")).strip() or "/images/front_img_cover.jpg"
    book.issued_by = issued_by or ""
    return book


@csrf_exempt
def api_root(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    return JsonResponse(
        {
            "name": "Library backend",
            "endpoints": {
                "books": "/api/books/",
                "auth": "/api/auth/",
                "health": "/api/health/",
            },
        }
    )


@csrf_exempt
def health(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    return JsonResponse({"status": "ok"})


@csrf_exempt
def books_collection(request):
    if request.method == "GET":
        status_filter = request.GET.get("status")
        query = request.GET.get("q", "").strip()

        books = Book.objects.all()
        if status_filter in {Book.STATUS_AVAILABLE, Book.STATUS_ISSUED}:
            books = books.filter(status=status_filter)

        if query:
            books = books.filter(
                models.Q(title__icontains=query)
                | models.Q(author__icontains=query)
                | models.Q(category__icontains=query)
            )

        payload = _book_list_payload(books)
        return JsonResponse({"count": len(payload), "results": payload})

    if request.method == "POST":
        payload = _parse_body(request)
        if payload is None:
            return _json_error("Invalid JSON payload")

        try:
            with transaction.atomic():
                book = _book_from_payload(payload)
                book.save()
        except ValueError as exc:
            return _json_error(str(exc))

        return JsonResponse(book.to_payload(), status=201)

    if request.method == "PUT":
        payload = _parse_body(request)
        if payload is None:
            return _json_error("Invalid JSON payload")
        if not isinstance(payload, list):
            return _json_error("Expected a JSON array of books")

        with transaction.atomic():
            Book.objects.all().delete()
            books = []
            for index, item in enumerate(payload, start=1):
                try:
                    book = _book_from_payload(item)
                except ValueError as exc:
                    return _json_error(f"Book {index}: {exc}")
                books.append(book)

            Book.objects.bulk_create(books)

        return JsonResponse({"count": len(books)})

    return HttpResponseNotAllowed(["GET", "POST", "PUT"])


@csrf_exempt
def book_detail(request, book_id: int):
    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return _json_error("Book not found", status=404)

    if request.method == "GET":
        return JsonResponse(book.to_payload())

    if request.method in {"PATCH", "PUT"}:
        payload = _parse_body(request)
        if payload is None:
            return _json_error("Invalid JSON payload")

        try:
            updated_book = _book_from_payload(payload, existing_book=book)
            updated_book.save()
        except ValueError as exc:
            return _json_error(str(exc))

        return JsonResponse(updated_book.to_payload())

    return HttpResponseNotAllowed(["GET", "PATCH", "PUT"])


@csrf_exempt
def issue_book(request, book_id: int):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    if not request.user.is_authenticated:
        return _json_error("Authentication required to issue books", status=401)

    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return _json_error("Book not found", status=404)

    if book.status != Book.STATUS_AVAILABLE:
        return _json_error("Book is already issued", status=400)

    book.status = Book.STATUS_ISSUED
    book.issued_by = "self"
    book.save(update_fields=["status", "issued_by", "updated_at"])
    return JsonResponse(book.to_payload())


@csrf_exempt
def return_book(request, book_id: int):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    if not request.user.is_authenticated:
        return _json_error("Authentication required to return books", status=401)

    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return _json_error("Book not found", status=404)

    if book.status != Book.STATUS_ISSUED or book.issued_by != "self":
        return _json_error("Only books issued by the current user can be returned", status=400)

    book.status = Book.STATUS_AVAILABLE
    book.issued_by = ""
    book.save(update_fields=["status", "issued_by", "updated_at"])
    return JsonResponse(book.to_payload())


@csrf_exempt
def contact_messages_collection(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    payload = _parse_body(request)
    if payload is None:
        return _json_error("Invalid JSON payload")

    full_name = str(payload.get("fullName", "")).strip()
    student_id = str(payload.get("studentId", "")).strip()
    email = str(payload.get("email", "")).strip()
    inquiry_type = str(payload.get("inquiryType", "")).strip()
    message = str(payload.get("message", "")).strip()

    if not full_name:
        return _json_error("fullName is required")
    if not student_id:
        return _json_error("studentId is required")
    if not email:
        return _json_error("email is required")
    if not message:
        return _json_error("message is required")
    if len(message) > 4000:
        return _json_error("message must be at most 4000 characters")

    valid_inquiry_types = {choice[0] for choice in ContactMessage.INQUIRY_CHOICES}
    if inquiry_type not in valid_inquiry_types:
        inquiry_type = ContactMessage.INQUIRY_GENERAL

    contact_message = ContactMessage.objects.create(
        full_name=full_name,
        student_id=student_id,
        email=email,
        inquiry_type=inquiry_type,
        message=message,
    )

    return JsonResponse(
        {
            "detail": "Message submitted successfully",
            "message": contact_message.to_payload(),
        },
        status=201,
    )


@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    payload = _parse_body(request)
    if payload is None:
        return _json_error("Invalid JSON payload")

    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", "")).strip()
    email = str(payload.get("email", "")).strip()

    if not username or not password:
        return _json_error("username and password are required")

    user_model = get_user_model()
    if user_model.objects.filter(username=username).exists():
        return _json_error("Username already exists", status=409)

    user = user_model.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    return JsonResponse({"id": user.id, "username": user.username, "email": user.email})


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    payload = _parse_body(request)
    if payload is None:
        return _json_error("Invalid JSON payload")

    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", "")).strip()
    user = authenticate(request, username=username, password=password)
    if user is None:
        return _json_error("Invalid credentials", status=401)

    login(request, user)
    return JsonResponse({"id": user.id, "username": user.username, "email": user.email})


@csrf_exempt
def firebase_login_view(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    payload = _parse_body(request)
    if payload is None:
        return _json_error("Invalid JSON payload")

    id_token = str(payload.get("idToken", "")).strip()
    preferred_username = str(payload.get("username", "")).strip()

    try:
        decoded = verify_firebase_id_token(id_token)
    except ValueError as exc:
        return _json_error(str(exc), status=400)
    except RuntimeError as exc:
        return _json_error(str(exc), status=503)
    except Exception:
        return _json_error("Invalid Firebase token", status=401)

    uid = str(decoded.get("uid", "")).strip()
    email = str(decoded.get("email", "")).strip()

    user_model = get_user_model()
    user = None
    created = False

    if email:
        user = user_model.objects.filter(email__iexact=email).first()

    if user is None:
        base_username = preferred_username or (email.split("@")[0] if email else "") or f"firebase_{uid[:12]}"
        candidate = base_username[:150]
        suffix = 1
        while user_model.objects.filter(username=candidate).exists():
            suffix_part = f"_{suffix}"
            candidate = f"{base_username[: max(1, 150 - len(suffix_part))]}{suffix_part}"
            suffix += 1

        user = user_model.objects.create_user(username=candidate, email=email or "")
        created = True
    elif email and user.email != email:
        user.email = email
        user.save(update_fields=["email"])

    login(request, user)
    return JsonResponse(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "firebaseUid": uid,
            "created": created,
        }
    )


@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    logout(request)
    return JsonResponse({"detail": "Logged out"})


@csrf_exempt
def me_view(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False})

    return JsonResponse(
        {
            "authenticated": True,
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
        }
    )


@csrf_exempt
def seed_view(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    with transaction.atomic():
        Book.objects.all().delete()
        Book.objects.bulk_create(
            [
                Book(
                    id=book["id"],
                    title=book["title"],
                    author=book["author"],
                    category=book["category"],
                    status=book["status"],
                    image=book["image"],
                    issued_by=book["issuedBy"] or "",
                    copies_available=book.get("copiesAvailable", 15),
                )
                for book in DEFAULT_BOOKS
            ]
        )

    return JsonResponse({"count": len(DEFAULT_BOOKS)})
