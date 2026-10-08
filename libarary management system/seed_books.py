import os
import sys
import django

# Setup Django
sys.path.insert(0, 'Backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_backend.settings')
django.setup()

from library_api.models import Book
from library_api.seed_data import DEFAULT_BOOKS
from django.db import transaction

with transaction.atomic():
    Book.objects.all().delete()
    Book.objects.bulk_create([
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
    ])

print(f"Successfully seeded {Book.objects.count()} books with 15 copies each")
