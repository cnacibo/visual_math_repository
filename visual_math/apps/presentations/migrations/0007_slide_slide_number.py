# Generated by Django 5.1.4 on 2025-02-11 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('presentations', '0006_remove_slide_created_at_remove_slide_order_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='slide',
            name='slide_number',
            field=models.PositiveIntegerField(default=0, editable=False),
        ),
    ]
