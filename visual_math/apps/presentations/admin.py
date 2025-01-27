from django.contrib import admin
from .models import Presentation, Slide

# Регистрация модели Presentation
class PresentationAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'created_at', 'updated_at')  # Какие поля отображать в списке
    search_fields = ('title',)  # Поле для поиска

# Регистрация модели Slide
class SlideAdmin(admin.ModelAdmin):
    list_display = ('presentation', 'type', 'created_at', 'updated_at')  # Какие поля отображать в списке
    search_fields = ('presentation__title', 'type')  # Поиск по презентации и типу слайда

admin.site.register(Presentation, PresentationAdmin)
admin.site.register(Slide, SlideAdmin)
