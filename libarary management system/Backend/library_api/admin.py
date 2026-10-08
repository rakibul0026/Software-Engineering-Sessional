from django.contrib import admin

from .models import Book, ContactMessage


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "category", "status", "issued_by")
    list_filter = ("status", "category")
    search_fields = ("title", "author", "category")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "student_id", "email", "inquiry_type", "created_at")
    list_filter = ("inquiry_type", "created_at")
    search_fields = ("full_name", "student_id", "email", "message")
    readonly_fields = ("created_at",)
