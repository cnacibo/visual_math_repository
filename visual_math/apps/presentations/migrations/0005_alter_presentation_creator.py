# Generated by Django 5.1.4 on 2025-01-31 14:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('presentations', '0004_remove_slide_background_color_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='presentation',
            name='creator',
            field=models.ForeignKey(default=37, on_delete=django.db.models.deletion.CASCADE, related_name='presentations', to=settings.AUTH_USER_MODEL),
        ),
    ]
