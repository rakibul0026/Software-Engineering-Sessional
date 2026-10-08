from __future__ import annotations

from django.db import migrations, models


def seed_books(apps, schema_editor):
    Book = apps.get_model("library_api", "Book")

    default_books = [
        {
            "id": 1,
            "title": "Machine Learning Algorithm",
            "author": "CSTU Library",
            "category": "General",
            "status": "Available",
            "image": "/images/front_img_cover.jpg",
            "issued_by": "",
        },
        {
            "id": 2,
            "title": "Engineering II",
            "author": "Academic Press",
            "category": "Engineering",
            "status": "Available",
            "image": "/images/Engineering_II_Cover_WEB.jpg",
            "issued_by": "",
        },
        {
            "id": 3,
            "title": "C++ Programming",
            "author": "Brian Kernighan",
            "category": "Programming",
            "status": "Available",
            "image": "/images/c-programming.jpg",
            "issued_by": "",
        },
        {
            "id": 4,
            "title": "Fundamentals of Mathematics",
            "author": "CSTU Research Unit",
            "category": "Mathematics",
            "status": "Issued",
            "image": "/images/fundamentals-of-math.jpg",
            "issued_by": "self",
        },
        {
            "id": 5,
            "title": "Bots and Automation",
            "author": "Tech Future Team",
            "category": "Robotics",
            "status": "Available",
            "image": "/images/bots-cover.jpg",
            "issued_by": "",
        },
        {
            "id": 6,
            "title": "Big Data Essentials",
            "author": "Data Lab",
            "category": "Data Science",
            "status": "Issued",
            "image": "/images/bigdata-cover.jpg",
            "issued_by": "other",
        },
        {
            "id": 7,
            "title": "Operating Systems",
            "author": "Silberschatz",
            "category": "Computer Science",
            "status": "Available",
            "image": "/images/os-cover.jpg",
            "issued_by": "",
        },
        {
            "id": 8,
            "title": "Machine Learning",
            "author": "CSE Final Question",
            "category": "Computer Science",
            "status": "Available",
            "image": "/images/cover_fmt.jpg",
            "issued_by": "",
        },
        {
            "id": 9,
            "title": "Robotics Fundamentals",
            "author": "STEM Library",
            "category": "Robotics",
            "status": "Issued",
            "image": "/images/robotics-cover.jpg",
            "issued_by": "self",
        },
    ]

    for book in default_books:
        Book.objects.create(**book)


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Book",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255, unique=True)),
                ("author", models.CharField(max_length=255)),
                ("category", models.CharField(default="General", max_length=120)),
                ("status", models.CharField(choices=[("Available", "Available"), ("Issued", "Issued")], default="Available", max_length=20)),
                ("image", models.CharField(default="/images/front_img_cover.jpg", max_length=500)),
                ("issued_by", models.CharField(blank=True, default="", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["id"]},
        ),
        migrations.RunPython(seed_books, migrations.RunPython.noop),
    ]
