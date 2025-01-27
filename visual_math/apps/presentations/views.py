from django.shortcuts import render, get_object_or_404, redirect
from .models import Presentation, Slide
from .forms import PresentationForm, SlideForm, CreatePresentationForm
from rest_framework import viewsets
from .models import Presentation, Slide
from .serializers import PresentationSerializer, SlideSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


# Просмотр всех презентаций
def presentation_list(request):
    presentations = Presentation.objects.all()
    return render(request, 'presentations/list.html', {'presentations': presentations})

def create_new(request):
    if request.method == 'POST':
        form = CreatePresentationForm(request.POST)
        if form.is_valid():
            presentation = form.save(commit=False)
            presentation.creator = request.user
            presentation.save()
            return redirect('create_presentation',  presentation_id=presentation.id)
    else:
        form = CreatePresentationForm()
    return render(request, 'presentations/create_new.html', {'form': form})

# Создание новой презентации
def create_presentation(request, presentation_id):
    if request.method == 'POST':
        form = PresentationForm(request.POST)
        if form.is_valid():
            presentation = form.save(commit=False)
            presentation.user = request.user
            presentation.save()
            return redirect('presentation_detail')
    else:
        form = PresentationForm()
    return render(request, 'presentations/create_presentation.html', {'form': form})

# Детали презентации
def presentation_detail(request, presentation_id):
    presentation = get_object_or_404(Presentation, id=presentation_id)
    slides = presentation.slides.all().order_by('order')
    return render(request, 'presentations/presentation_detail.html', {'presentation': presentation, 'slides': slides})

# Добавление слайда
def add_slide(request, presentation_id):
    presentation = get_object_or_404(Presentation, id=presentation_id)
    if request.method == 'POST':
        form = SlideForm(request.POST)
        if form.is_valid():
            slide = form.save(commit=False)
            slide.presentation = presentation
            slide.save()
            return redirect('presentation_detail', presentation_id=presentation.id)
    else:
        form = SlideForm()
    return render(request, 'presentations/add_slide.html', {'form': form, 'presentation': presentation})

class PresentationViewSet(viewsets.ModelViewSet):
    queryset = Presentation.objects.all()
    serializer_class = PresentationSerializer

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

def editor_view(request, presentation_id):
    return render(request, 'presentations/editor.html', {'presentation_id': presentation_id})

@csrf_exempt  # Отключает проверку CSRF для примера, не используйте в продакшене без осторожности!
def slides_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            slide = Slide.objects.create(
                presentation_id=data['presentation'],
                order=data['order'],
                content=data['content']
            )
            return JsonResponse({"status": "success", "slide_id": slide.id})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    elif request.method == 'GET':
        # Пример загрузки слайда с ID 1
        try:
            slide = Slide.objects.get(id=1)  # Замените на реальный ID
            return JsonResponse({"content": slide.content})
        except Slide.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Slide not found"}, status=404)
    else:
        return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@csrf_exempt
def save_presentation(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Создаем новую или обновляем существующую презентацию
            presentation_id = data.get("id")
            if presentation_id:
                presentation = Presentation.objects.get(id=presentation_id)
            else:
                presentation = Presentation(creator=request.user)

            presentation.title = data["title"]
            presentation.subject = data.get("subject", presentation.subject)
            presentation.data = data.get("data", presentation.data)
            presentation.save()

            return JsonResponse({"success": True, "id": presentation.id})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    else:
        return JsonResponse({"success": False, "error": "Invalid request method."})