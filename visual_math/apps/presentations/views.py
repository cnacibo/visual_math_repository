from django.shortcuts import render, get_object_or_404, redirect
from .models import Presentation, Slide
from .forms import PresentationForm, SlideForm, CreatePresentationForm
from rest_framework import viewsets
from .models import Presentation, Slide
from .serializers import PresentationSerializer, SlideSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Просмотр всех презентаций

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
def create_presentation(request):
    # presentation = Presentation.objects.get(id=presentation_id)
    # subject = presentation.subject
    # title = presentation.title
    # creation_date = presentation.created_at.strftime("%Y-%m-%d %H:%M:%S")
    return render(request, 'presentations/create_presentation.html')

class PresentationViewSet(viewsets.ModelViewSet):
    queryset = Presentation.objects.all()
    serializer_class = PresentationSerializer

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

@csrf_exempt  # Временно отключаем CSRF для тестов
def save_presentation(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            subject = data.get('subject')
            slides = data.get('slides', [])

            if not title or not subject:
                return JsonResponse({'error': 'Название и предмет обязательны'}, status=400)

            # Создаем новую презентацию
            presentation = Presentation.objects.create(title=title, subject=subject, creator_id=request.user.id)

            # Добавляем слайды с правильной нумерацией
            for index, slide in enumerate(slides, start=1):  # start=1 чтобы номера шли от 1
                Slide.objects.create(
                    presentation=presentation,
                    slide_number=index,  # Присваиваем правильный номер
                    slide_type=slide.get('slide_type', 'text'),
                    content=slide.get('content', ''),
                    questions=slide.get('questions'),
                    answers=slide.get('answers'),
                    image=slide.get('image', None)
                )

            return JsonResponse({'message': 'Презентация сохранена'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Метод не разрешен'}, status=405)
@csrf_exempt
def delete_presentation(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            presentation_id = data.get("id")

            if not presentation_id:
                return JsonResponse({"success": False, "error": "Не указан ID презентации."}, status=400)

            # Ищем презентацию, но только ту, что принадлежит пользователю
            presentation = get_object_or_404(Presentation, id=presentation_id, creator=request.user)

            # Удаляем презентацию
            presentation.delete()

            return JsonResponse({"success": True, "message": "Презентация успешно удалена."})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Ошибка в данных JSON."}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Неверный метод запроса."}, status=405)


class PresentationView(APIView):
    def post(self, request):
        serializer = PresentationSerializer(data=request.data)
        if serializer.is_valid():
            presentation = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)