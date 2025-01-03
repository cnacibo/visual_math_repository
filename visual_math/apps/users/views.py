from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, update_session_auth_hash, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import CustomUserCreationForm
from .forms import LoginForm
from django.contrib.auth.decorators import login_required
from .forms import UpdateProfileForm, UpdatePasswordForm, PasswordResetForm
from django.contrib import messages
import random
import string
from django.core.mail import send_mail
from .models import User

def register(request):
    reg_form = CustomUserCreationForm()
    log_form = LoginForm()
    if request.method == 'POST':
        if 'register' in request.POST:
            reg_form = CustomUserCreationForm(request.POST)
            if reg_form.is_valid():
                user = reg_form.save()
                login(request, user)  # Авторизуем пользователя сразу после регистрации
                return redirect('home')  # Перенаправляем на главную страницу
            else:
                reg_form.add_error(None, 'Неверные данные при регистрации')
        elif 'login' in request.POST:
            log_form = LoginForm(request.POST)
            if log_form.is_valid():
                username = log_form.cleaned_data['username']
                password = log_form.cleaned_data['password']
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    login(request, user)
                    return redirect('home')
                else:
                    log_form.add_error(None, 'Неправильное имя пользователя или пароль')
            else:
                log_form.add_error(None, 'Неверные данные при входе')

    return render(request, 'users/register.html', {
        'reg_form': reg_form,
        'log_form': log_form
    })

@login_required
def home(request):
    return render(request, 'users/home.html', {'user': request.user})


@login_required
def delete_user(request):
    return render(request, 'users/delete_user.html')

@login_required
def delete_user_confirmed(request):
    if request.method == 'POST':
        user = request.user
        user.delete()
        logout(request)
        return redirect('register')  # Перенаправляем на главную страницу после удаления пользователя

    return render(request, 'users/delete_user.html')

@login_required
def logout_view(request):
    return render(request, 'users/logout_user.html')

@login_required
def logout_confirmed(request):
    logout(request)  # Выход из аккаунта
    return redirect('register')  # Перенаправляем на страницу регистрации

# def login_view(request):
#     if request.method == 'POST':
#         form = LoginForm(request.POST)
#         if form.is_valid():
#             username = form.cleaned_data['username']
#             password = form.cleaned_data['password']
#             user = authenticate(request, username=username, password=password)
#             if user is not None:
#                 login(request, user)
#                 return redirect('home')
#             else:
#                 form.add_error(None, 'Неправильное имя пользователя или пароль')
#     else:
#         form = LoginForm()
#
#     return render(request, 'users/register.html', {'form': form})

@login_required
def update_profile(request):
    if request.method == 'POST':
        form = UpdateProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Ваш профиль успешно обновлен!')
            return redirect('home')
    else:
        form = UpdateProfileForm(instance=request.user)

    return render(request, 'users/update_profile.html', {'form': form})

@login_required
def update_password(request):
    if request.method == 'POST':
        form = UpdatePasswordForm(user=request.user, data=request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Чтобы пользователь не был разлогинен
            messages.success(request, 'Пароль успешно изменен!')
            return redirect('home')
        else:
            messages.error(request, 'Пожалуйста, исправьте ошибки ниже.')
    else:
        form = UpdatePasswordForm(user=request.user)

    return render(request, 'users/update_password.html', {'form': form})


def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

# Представление для сброса пароля
def reset_password(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            user = User.objects.filter(email=email).first()

            if user:
                new_password = generate_random_password()  # Генерируем новый случайный пароль
                user.set_password(new_password)  # Устанавливаем новый пароль
                user.save()

                # Отправляем email с новым паролем
                send_mail(
                    'Ваш новый пароль',
                    f'Ваш новый пароль: {new_password}',
                    'from@example.com',  # Укажите ваш реальный email отправителя
                    [email],
                    fail_silently=False,
                )

                return redirect('register')
            else:
                # Если пользователь не найден, можно отобразить ошибку
                return render(request, 'users/password_reset_form.html', {'form': form, 'error': 'Пользователь с таким email не найден.'})

    else:
        form = PasswordResetForm()

    return render(request, 'users/password_reset_form.html', {'form': form})