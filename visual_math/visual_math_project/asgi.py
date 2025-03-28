"""
ASGI config for visual_math_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import apps.presentations.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visual_math_project.settings')

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
         "websocket": AuthMiddlewareStack(
            URLRouter(
                apps.presentations.routing.websocket_urlpatterns
            )
         ),
        # "websocket": URLRouter(apps.presentations.routing.websocket_urlpatterns),
    }
)
