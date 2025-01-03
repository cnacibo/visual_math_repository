from django.urls import path
from . import views

urlpatterns = [
    path('', views.register, name='register'),  # Страница регистрации
    path('home/', views.home, name='home'),
    path('delete/', views.delete_user, name='delete_user'),
    path('logout/', views.logout_view, name='logout'),  # Путь для выхода
    path('delete-user/', views.delete_user_confirmed, name='delete_user_confirmed'),
    path('logout-user/', views.logout_confirmed, name='logout_confirmed'),
    # path('login/', views.login_view, name='login'),
    path('update-profile/', views.update_profile, name='update_profile'),
    path('update-password/', views.update_password, name='update_password'),
]
