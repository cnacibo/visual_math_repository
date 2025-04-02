import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.getenv('DEBUG') == 'True' if os.getenv('DEBUG') is not None else False

SECRET_KEY = os.getenv('SECRET_KEY')

ALLOWED_HOSTS=['172.20.10.11', '127.0.0.1', 'localhost', '192.168.1.39', '192.168.1.30', '79.137.206.17',
               '192.168.1.138', '172.20.10.1', '172.20.10.1', '192.168.1.1', '188.170.82.245', '192.168.1.137']

INSTALLED_APPS = [
    "daphne",
    'apps.presentations',
    'apps.users',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'corsheaders',
    'rest_framework',
    'channels',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'visual_math_project.urls'

CORS_ALLOW_ALL_ORIGINS = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'visual_math_project.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # Для PostgreSQL, например
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'visual_math_project/static'] #- твоя строка была


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

# Настройки для отправки почты
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND')
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Разрешаем React-фронтенд
    "http://127.0.0.1:8000",
    "http://192.168.1.39:8000",
    "http://172.20.10.11:8000",
    "http://79.137.206.17:8000",
    "http://172.20.10.8:8000",
    "http://172.20.10.1:8000",
    "http://192.168.1.138:8000",
    "http://192.168.1.1:8000",
    "http://188.170.82.245:8000",
    "http://192.168.1.137:8000",
]
CORS_ALLOW_CREDENTIALS = True  # Разрешаем cookies


MEDIA_URL = '/media/'
# MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

ASGI_APPLICATION = "visual_math_project.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',  # В продакшене лучше использовать Redis
        'CONFIG': {
                    "hosts": [('127.0.0.1', 6379)],
                    # Для Docker Compose используйте имя сервиса "redis"
                    # "hosts": [("redis", 6379)],
                },
    },
}



