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
def create_presentation(request, presentation_id):
    presentation = Presentation.objects.get(id=presentation_id)
    subject = presentation.subject
    title = presentation.title
    creation_date = presentation.created_at.strftime("%Y-%m-%d %H:%M:%S")
    return render(request, 'presentations/create_presentation.html', {
        'presentation_id': presentation_id,
        'subject': subject,
        'title': title,
        'creation_date': creation_date,
    })

class PresentationViewSet(viewsets.ModelViewSet):
    queryset = Presentation.objects.all()
    serializer_class = PresentationSerializer

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

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