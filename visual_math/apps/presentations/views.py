import os

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
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import base64
from django.core.cache import cache
from apps.users.models import User
from django.contrib.auth.decorators import login_required



@login_required(login_url='/')
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
@login_required(login_url='/')
def create_presentation(request):
    return render(request, 'presentations/create_presentation.html')

class PresentationViewSet(viewsets.ModelViewSet):
    queryset = Presentation.objects.all()
    serializer_class = PresentationSerializer

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

@login_required(login_url='/')
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
                questions_data = slide.get('questions', [])

                if questions_data:
                    questions_data = questions_data
                else:
                    questions_data = []

                Slide.objects.create(
                    presentation=presentation,
                    slide_number=index,  # Присваиваем правильный номер
                    slide_type=slide.get('type', 'text'),
                    content=slide.get('content', ''),
                    questions=questions_data,  # Сохраняем вопросы
                    image=slide.get('image', None)
                )

            return JsonResponse({'message': 'Презентация сохранена'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Метод не разрешен'}, status=405)

@login_required(login_url='/')
def delete_presentation(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            presentation_id = data.get("id")

            if not presentation_id:
                return JsonResponse({"success": False, "error": "Не указан ID презентации."}, status=400)

            # Получаем презентацию, принадлежащую текущему пользователю
            presentation = get_object_or_404(Presentation, id=presentation_id, creator=request.user)

            # Функция для обработки URL изображения
            def process_image_url(image_url):
                if image_url and isinstance(image_url, str):
                    # Удаляем префикс /media/
                    clean_path = image_url.replace('/media/', '').replace('media/', '')
                    from visual_math.visual_math_project import settings
                    full_path = os.path.join(settings.MEDIA_ROOT, clean_path)
                    if os.path.exists(full_path):
                        try:
                            os.remove(full_path)
                        except Exception as e:
                            print(f"Ошибка удаления изображения: {e}")

            # Обрабатываем все слайды презентации
            for slide in presentation.slides.all():
                if slide.slide_type == 'text' and slide.image:
                    # Удаляем основное изображение слайда
                    try:
                        slide.image.delete(save=False)
                    except Exception as e:
                        print(f"Ошибка удаления изображения слайда: {e}")

                elif slide.slide_type == 'questionnaire' and slide.questions:
                    # Обрабатываем анкетные слайды
                    if isinstance(slide.questions, dict):
                        if 'questionImageUrl' in slide.questions:
                            process_image_url(slide.questions['questionImageUrl'])
                            slide.questions['questionImageUrl'] = ""
                            slide.save()

                elif slide.slide_type == 'test' and slide.questions:
                    # Обрабатываем тестовые слайды
                    if isinstance(slide.questions, list):
                        for question in slide.questions:
                            if isinstance(question, dict):
                                # Обрабатываем изображение в основном вопросе
                                if 'questionImageUrl' in question:
                                    process_image_url(question['questionImageUrl'])
                                    question['questionImageUrl'] = ""

                                # Обрабатываем вложенный questionData
                                if 'questionData' in question and isinstance(question['questionData'], dict):
                                    if 'questionImageUrl' in question['questionData']:
                                        process_image_url(question['questionData']['questionImageUrl'])
                                        question['questionData']['questionImageUrl'] = ""

                        slide.save()

            # Удаляем саму презентацию (слайды удалятся каскадом)
            presentation.delete()

            return JsonResponse({"success": True, "message": "Презентация успешно удалена."})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Ошибка в данных JSON."}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Неверный метод запроса."}, status=405)

@login_required(login_url='/')
@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']

        # Сохраняем файл в папке media
        file_path = default_storage.save(f'slides/{image_file.name}', image_file)

        # Возвращаем путь к файлу в response
        image_url = f'/media/{file_path}'  # Путь к файлу на сервере
        return JsonResponse({'imageUrl': image_url})

    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required(login_url='/')
def presentation_api(request, presentation_id):
    presentation = get_object_or_404(Presentation, id=presentation_id)

    presentation = get_object_or_404(Presentation, id=presentation_id)
    slides = Slide.objects.filter(presentation=presentation).values(
        'slide_type',
        'content',
        'image',
        'questions'
    )
    result = {
        'title': presentation.title,
        'slides': list(slides)
    }

    return JsonResponse(result)


class PresentationView(APIView):
    def post(self, request):
        serializer = PresentationSerializer(data=request.data)
        if serializer.is_valid():
            presentation = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required(login_url='/')
def check_presentation(request, presentation_id):
    try:
        presentation = Presentation.objects.get(id=presentation_id)
        cache_key = f"presentation_{presentation_id}"
        presentation_state = cache.get(cache_key, {
            'is_active': False,
            'current_slide': 0,
            'slides': []
        })

        return JsonResponse({
            'exists': True,
            'is_active': presentation_state['is_active'],
            'slides': presentation_state['slides']
        })
    except Presentation.DoesNotExist:
        return JsonResponse({'exists': False})


@login_required(login_url='/')
def get_student_name(request, student_id):
    try:
        student = User.objects.get(id=student_id)
        return JsonResponse({
            'id': student.id,
            'name': f"{student.username}",
            'status': 'success'
        })
    except User.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Student not found'
        }, status=404)