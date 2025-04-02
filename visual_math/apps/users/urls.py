from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

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
    path('password_reset/', views.reset_password, name='password_reset'),

    # path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    # path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    # path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
