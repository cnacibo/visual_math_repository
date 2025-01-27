from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import PresentationViewSet, SlideViewSet

router = DefaultRouter()
router.register('presentations', PresentationViewSet)
router.register('slides', SlideViewSet)

urlpatterns = [
    path('', views.presentation_list, name='presentation_list'),
    path('create/<int:presentation_id>/', views.create_presentation, name='create_presentation'),
    path('new/', views.create_new, name='create_new'),
    path('editor/<int:presentation_id>/', views.editor_view, name='editor'),
    path('presentation/<int:presentation_id>/', views.presentation_detail, name='presentation_detail'),  # Просмотр презентации
    path('presentation/<int:presentation_id>/slides/', views.add_slide, name='add_slide'),  # Добавление слайда
    path('api/slides/', views.slides_view, name='slides'),
    path("save-presentation/", views.save_presentation, name="save_presentation"),
    # path('presentation/<int:presentation_id>/slide/<int:slide_id>/edit/', views.edit_slide, name='edit_slide'),  # Редактирование слайда
    # path('presentation/<int:presentation_id>/edit/', views.edit_presentation, name='edit_presentation'),  # Редактирование презентации
]
