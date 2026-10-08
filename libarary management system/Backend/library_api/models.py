from __future__ import annotations

from django.db import models


class Book(models.Model):
    STATUS_AVAILABLE = "Available"
    STATUS_ISSUED = "Issued"
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, "Available"),
        (STATUS_ISSUED, "Issued"),
    ]

    title = models.CharField(max_length=255, unique=True)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=120, default="General")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    image = models.CharField(max_length=500, default="/images/front_img_cover.jpg")
    issued_by = models.CharField(max_length=20, blank=True, default="")
    copies_available = models.IntegerField(default=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def save(self, *args, **kwargs):
        if self.status != self.STATUS_ISSUED:
            self.issued_by = ""
        elif not self.issued_by:
            self.issued_by = "other"

        super().save(*args, **kwargs)

    def to_payload(self) -> dict[str, object]:
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "category": self.category,
            "status": self.status,
            "image": self.image,
            "issuedBy": self.issued_by or None,
            "copiesAvailable": self.copies_available,
        }


class ContactMessage(models.Model):
    INQUIRY_GENERAL = "General Query"
    INQUIRY_BORROW_RETURN = "Borrow / Return Issue"
    INQUIRY_DIGITAL_ACCESS = "Digital Library Access"
    INQUIRY_RFID = "RFID System Help"
    INQUIRY_CHOICES = [
        (INQUIRY_GENERAL, "General Query"),
        (INQUIRY_BORROW_RETURN, "Borrow / Return Issue"),
        (INQUIRY_DIGITAL_ACCESS, "Digital Library Access"),
        (INQUIRY_RFID, "RFID System Help"),
    ]

    full_name = models.CharField(max_length=150)
    student_id = models.CharField(max_length=64)
    email = models.EmailField(max_length=254)
    inquiry_type = models.CharField(max_length=64, choices=INQUIRY_CHOICES, default=INQUIRY_GENERAL)
    message = models.TextField(max_length=4000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def to_payload(self) -> dict[str, object]:
        return {
            "id": self.id,
            "fullName": self.full_name,
            "studentId": self.student_id,
            "email": self.email,
            "inquiryType": self.inquiry_type,
            "message": self.message,
            "createdAt": self.created_at.isoformat(),
        }
