# Generated migration for adding copies_available field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("library_api", "0002_contactmessage"),
    ]

    operations = [
        migrations.AddField(
            model_name="book",
            name="copies_available",
            field=models.IntegerField(default=15),
        ),
    ]
