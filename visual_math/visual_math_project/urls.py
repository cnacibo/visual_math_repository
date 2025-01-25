from pathlib import Path # i added
from django.contrib import admin
from django.urls import path, include

from django.conf import settings # i added
from django.conf.urls.static import static # i added

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.users.urls')),  # Подключаем URL-ы для пользователей
    path('presentations/', include('apps.presentations.urls')),
]

# Определяем путь к папке dist
BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "static" / "dist"  # Указываем путь к dist напрямую

# Обслуживание статических файлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
