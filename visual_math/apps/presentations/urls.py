from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import PresentationViewSet, SlideViewSet, PresentationView, presentation_api
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static

router = DefaultRouter()
router.register('presentations', PresentationViewSet)
router.register('slides', SlideViewSet)

urlpatterns = [
    path('create/', views.create_presentation, name='create_presentation'),
    path('new/', views.create_new, name='create_new'),
    # path("save-presentation/", views.save_presentation, name="save_presentation"),
    path("delete-presentation/", views.delete_presentation, name="delete-presentation"),
    path('api/', views.save_presentation, name="save_presentation"),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('api/<int:presentation_id>/', presentation_api, name='presentation_api')
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
