from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, update_session_auth_hash, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Авторизуем пользователя сразу после регистрации
            return redirect('home')  # Перенаправляем на главную страницу
    else:
        form = CustomUserCreationForm()
    return render(request, 'users/register.html', {'form': form})

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
