# Generated by Django 4.2.9 on 2024-04-02 02:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("pdp", "0006_rename_category_post_category_name"),
    ]

    operations = [
        migrations.RenameField(
            model_name="post", old_name="category_name", new_name="category",
        ),
    ]
