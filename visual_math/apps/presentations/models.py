from django.db import models
from django.contrib.auth.models import User  # Импортируем модель User, если используется авторизация
from django.conf import settings
from django.db.models import JSONField
import datetime

class Presentation(models.Model):
    SUBJECT_CHOICES = (
        ('Calculus', 'Математический анализ'),
        ('Algebra', 'Алгебра'),
        ('Discrete', 'Дискретная математика'),
    )
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=50, choices= SUBJECT_CHOICES, default='Calculus')
    created_at = models.DateTimeField(default=datetime.datetime.now)
    updated_at = models.DateTimeField(default=datetime.datetime.now)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='presentations', default=37)
    data = JSONField(default=dict)  # Сохраняет структуру JSON в базе данных
    def __str__(self):
        return self.title

class Slide(models.Model):
    TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('graph', 'Graph'),
    ]

    presentation = models.ForeignKey(Presentation, on_delete=models.CASCADE, related_name='slides')  # Ссылка на презентацию
    type = models.CharField(max_length=20, choices=TYPES, default= "text")  # Тип слайда (текст, изображение и т. д.)
    content = models.JSONField(default=dict)  # Содержимое слайда, например, текст или путь к изображению. Для гибкости используем JSON.
    position = models.JSONField(default=dict)  # Позиция и размер элементов на слайде (например, {'x': 100, 'y': 200, 'width': 400, 'height': 300})
    created_at = models.DateTimeField(default=datetime.datetime.now)  # Дата создания слайда
    updated_at = models.DateTimeField(default=datetime.datetime.now)  # Дата последнего обновления слайда
    order = models.IntegerField(default=0)  # Порядок слайдов в презентации
    # image = models.ImageField(upload_to='slides/images/', null=True, blank=True)

    def __str__(self):
        return f"Slide {self.id} of {self.presentation.title}"