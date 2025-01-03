from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, update_session_auth_hash, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import CustomUserCreationForm
from .forms import LoginForm
from django.contrib.auth.decorators import login_required
from .forms import UpdateProfileForm, UpdatePasswordForm
from django.contrib import messages

def register(request):
    if request.method == 'POST':
        if 'register' in request.POST:
            reg_form = CustomUserCreationForm(request.POST)
            if reg_form.is_valid():
                user = reg_form.save()
                login(request, user)  # Авторизуем пользователя сразу после регистрации
                return redirect('home')  # Перенаправляем на главную страницу
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
        reg_form = CustomUserCreationForm()
        log_form = LoginForm()
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