"""
Integrated Library System Setup Script for Django Backend

This script uploads the integrated_library_system.json configuration
to the Django backend database.

Usage:
1. Place integrated_library_system.json in the project root or Downloads folder
2. Run: python setup_integrated_system.py
"""

import os
import sys
import json
import django

# Setup Django
sys.path.insert(0, 'Backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_backend.settings')
django.setup()

from library_api.models import Book
from django.db import transaction

def load_config():
    """Load the integrated_library_system.json file"""
    possible_paths = [
        'integrated_library_system.json',
        '../integrated_library_system.json',
        'c:/Users/user/Downloads/integrated_library_system.json',
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f), path
    
    raise FileNotFoundError(
        "Could not find integrated_library_system.json. "
        "Please place it in the project root or Downloads folder."
    )

def upload_books_to_django(config):
    """Upload books from config to Django database"""
    if 'catalog' not in config or 'books' not in config['catalog']:
        print("⚠️  No books found in configuration")
        return 0
    
    books_data = config['catalog']['books']
    uploaded_count = 0
    
    with transaction.atomic():
        # Clear existing books
        Book.objects.all().delete()
        print(f"🗑️  Cleared {Book.objects.count()} existing books")
        
        # Create new books from config
        books_to_create = []
        for book_id, book_info in books_data.items():
            book = Book(
                title=book_info.get('title', 'Unknown'),
                author=book_info.get('author', 'Unknown'),
                category=book_info.get('category', 'General'),
                image=book_info.get('ui_asset_path', '/images/front_img_cover.jpg'),
                copies_available=book_info.get('available_quantity', 15),
                status='Available' if book_info.get('available_quantity', 0) > 0 else 'Issued',
            )
            books_to_create.append(book)
        
        Book.objects.bulk_create(books_to_create)
        uploaded_count = len(books_to_create)
    
    return uploaded_count

def main():
    try:
        print("🚀 Starting Integrated Library System Setup for Django...\n")
        
        # Load configuration
        config, config_path = load_config()
        print(f"✅ Configuration file loaded from: {config_path}\n")
        
        # Print configuration summary
        if 'system_administration' in config:
            print("📋 System Administration:")
            admin = config['system_administration'].get('admin_credentials', {}).get('admin_user', {})
            print(f"   - Admin Email: {admin.get('email', 'Not set')}")
            print(f"   - Admin Role: {admin.get('role', 'Not set')}\n")
        
        if 'catalog' in config:
            print("📚 Catalog:")
            categories = config['catalog'].get('categories', [])
            print(f"   - Categories: {len(categories)}")
            books = config['catalog'].get('books', {})
            print(f"   - Books: {len(books)}\n")
        
        # Upload books to Django
        print("📤 Uploading books to Django database...\n")
        uploaded_count = upload_books_to_django(config)
        
        print(f"✅ Uploaded {uploaded_count} books to database")
        
        # Verify
        from library_api.models import Book
        books = Book.objects.all()
        print(f"\n✨ Django setup completed successfully!")
        print(f"📊 Total books in database: {books.count()}")
        print("\n📖 Books added:")
        for book in books:
            print(f"   - {book.title} ({book.copies_available} copies)")
        
    except FileNotFoundError as e:
        print(f"❌ {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
