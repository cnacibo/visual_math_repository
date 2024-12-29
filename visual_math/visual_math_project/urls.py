from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.users.urls')),  # Подключаем URL-ы для пользователей
    #path('home/', views.home, name='home'),
]
