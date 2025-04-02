from django.urls import re_path
from apps.presentations.consumers import PresentationConsumer

websocket_urlpatterns = [
    re_path(r"ws/presentation/(?P<presentation_id>\w+)/$", PresentationConsumer.as_asgi()),
]
