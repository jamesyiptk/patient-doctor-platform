# Generated by Django 4.2.9 on 2024-04-02 02:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pdp", "0004_alter_article_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="title",
            field=models.CharField(default="general question", max_length=255),
        ),
    ]
