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
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, default='Calculus')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='presentations', default=37)
    created_at = models.DateTimeField(default=datetime.datetime.now)
    updated_at = models.DateTimeField(default=datetime.datetime.now)
    data = JSONField(default=dict)  # Сохраняет структуру JSON в базе данных
    #current_slide = models.PositiveIntegerField(default=0) #??
    is_active = models.BooleanField(default=False)
    def __str__(self):
        return self.title

class Slide(models.Model):
    presentation = models.ForeignKey(Presentation, on_delete=models.CASCADE, related_name='slides')
    slide_number = models.PositiveIntegerField(editable=False, default=0)
    slide_type = models.CharField(max_length=50,
                                  choices=[('text', 'Текстовый'), ('test', 'Проверочный'), ('questionnaire', 'Вопросник')],
                                  default='text')
    content = models.TextField(blank=True)
    questions = models.JSONField(default=list, blank=True)  # List of questions (text)
    image = models.ImageField(upload_to='slides/', null=True, blank=True)

    def __str__(self):
        return f"Слайд {self.slide_number} из '{self.presentation.title}'"