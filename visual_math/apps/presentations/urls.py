from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import PresentationViewSet, SlideViewSet, PresentationView

router = DefaultRouter()
router.register('presentations', PresentationViewSet)
router.register('slides', SlideViewSet)

urlpatterns = [
    path('create/<int:presentation_id>/', views.create_presentation, name='create_presentation'),
    path('new/', views.create_new, name='create_new'),
    path("save-presentation/", views.save_presentation, name="save_presentation"),
    path("delete-presentation/", views.delete_presentation, name="delete-presentation"),
    path('api/presentations/', PresentationView.as_view(), name='presentation-list')
]
