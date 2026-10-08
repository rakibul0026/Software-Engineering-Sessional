from __future__ import annotations

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("library_api", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=150)),
                ("student_id", models.CharField(max_length=64)),
                ("email", models.EmailField(max_length=254)),
                (
                    "inquiry_type",
                    models.CharField(
                        choices=[
                            ("General Query", "General Query"),
                            ("Borrow / Return Issue", "Borrow / Return Issue"),
                            ("Digital Library Access", "Digital Library Access"),
                            ("RFID System Help", "RFID System Help"),
                        ],
                        default="General Query",
                        max_length=64,
                    ),
                ),
                ("message", models.TextField(max_length=4000)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-created_at", "-id"]},
        ),
    ]
