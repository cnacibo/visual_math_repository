from django.db import models
from django.contrib.auth.models import User  # Импортируем модель User, если используется авторизация
from django.conf import settings

class Presentation(models.Model):
    title = models.CharField(max_length=255)  # Название презентации
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='presentations', null=True, blank=True)  # Если нужно привязать к пользователю
    created_at = models.DateTimeField(auto_now_add=True)  # Дата создания
    updated_at = models.DateTimeField(auto_now=True)  # Дата последнего обновления

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
    type = models.CharField(max_length=20, choices=TYPES)  # Тип слайда (текст, изображение и т. д.)
    content = models.JSONField()  # Содержимое слайда, например, текст или путь к изображению. Для гибкости используем JSON.
    position = models.JSONField(default=dict)  # Позиция и размер элементов на слайде (например, {'x': 100, 'y': 200, 'width': 400, 'height': 300})
    created_at = models.DateTimeField(auto_now_add=True)  # Дата создания слайда
    updated_at = models.DateTimeField(auto_now=True)  # Дата последнего обновления слайда
    order = models.IntegerField(default=0)  # Порядок слайдов в презентации
    # image = models.ImageField(upload_to='slides/images/', null=True, blank=True)

    def __str__(self):
        return f"Slide {self.id} of {self.presentation.title}"