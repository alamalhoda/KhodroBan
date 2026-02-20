# khodroban_prj/settings.py
"""
Django settings for KhodroBan project.
"""

from pathlib import Path
import os
import sys
from datetime import timedelta

# Build paths: parent of this file is khodroban_prj, parent.parent = backend/django
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-تغییر-این-مقدار-در-محیط-واقعی-ضروری-است")
DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    'reminders.apps.RemindersConfig',
    'notifications.apps.NotificationsConfig',
    'ai_assistant.apps.AiAssistantConfig',
    'khodroban.apps.KhodrobanConfig',  # قبل از auth تا override قالب read_only_password_hash لود شود
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'huey.contrib.djhuey',
    'rest_framework_simplejwt',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'khodroban_prj.urls'
WSGI_APPLICATION = 'khodroban_prj.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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
DB_ENGINE = os.environ.get("DB_ENGINE", "sqlite").lower()
if DB_ENGINE == "postgresql":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_DB', 'khodroban_db'),
            'USER': os.environ.get('POSTGRES_USER', 'postgres'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'postgres'),
            'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
            'PORT': os.environ.get('POSTGRES_PORT', '5432'),
        }
    }
else:
    DB_DIR = BASE_DIR / 'database'
    DB_DIR.mkdir(parents=True, exist_ok=True)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': DB_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'fa-ir'
TIME_ZONE = 'Asia/Tehran'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─── Django REST Framework ─────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'TOKEN_OBTAIN_SERIALIZER': 'khodroban.serializers.MyTokenObtainPairSerializer',
}

# ─── Huey ───────────────────────────────────────────────────────────────────
HUEY = {
    'huey_class': 'huey.RedisHuey',
    'name': 'khodroban-tasks',
    'results': True,
    'store_none': False,
    'immediate': DEBUG,
    'utc': True,
    'connection': {
        'host': os.environ.get('REDIS_HOST', 'localhost'),
        'port': int(os.environ.get('REDIS_PORT', 6379)),
        'db': int(os.environ.get('REDIS_DB', 0)),
        'connection_pool': None,
    },
    'consumer': {
        'workers': 4,
        'worker_type': 'thread',
        'initial_delay': 0.1,
        'backoff': 0.2,
        'max_delay': 10.0,
        'scheduler_interval': 1,
        'periodic': True,
        'check_worker_health': True,
        'health_check_interval': 1,
    },
}

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')

# ─── Logging ───────────────────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        '': {'handlers': ['console'], 'level': 'INFO'},
        'khodroban': {'handlers': ['console'], 'level': 'DEBUG', 'propagate': False},
        'ai_assistant': {'handlers': ['console'], 'level': 'INFO', 'propagate': False},
        'huey': {'handlers': ['console'], 'level': 'INFO', 'propagate': False},
    },
}
# در تست‌ها درخواست‌های 4xx (Bad Request, Forbidden, Not Found) عمداً توسط تست‌ها ایجاد می‌شوند؛
# لاگ WARNING آن‌ها خروجی را شلوغ می‌کند، پس در حین test فقط ERROR و بالاتر نمایش داده می‌شود.
if 'test' in sys.argv:
    LOGGING['loggers']['django.request'] = {
        'handlers': ['console'],
        'level': 'ERROR',
        'propagate': False,
    }

# ─── CORS ───────────────────────────────────────────────────────────────────
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
else:
    CORS_ALLOWED_ORIGINS = [
        "https://khodroban.ir",
        "https://www.khodroban.ir",
        "https://app.khodroban.ir",
    ]
    CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "accept", "accept-encoding", "authorization", "content-type",
    "dnt", "origin", "user-agent", "x-csrftoken", "x-requested-with",
]
CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]

# ─── AI Assistant ───────────────────────────────────────────────────────────
AI_DEFAULT_PROVIDER = os.environ.get('AI_DEFAULT_PROVIDER', 'openai')
AI_ALLOWED_PROVIDERS = ['openai', 'openrouter', 'zai']
AI_BASE_URL = os.environ.get('AI_BASE_URL')
AI_API_KEY = os.environ.get('AI_API_KEY')
AI_MODEL = os.environ.get('AI_MODEL', 'gpt-3.5-turbo')
AI_OPENAI_BASE_URL = os.environ.get('AI_OPENAI_BASE_URL', AI_BASE_URL)
AI_OPENAI_API_KEY = os.environ.get('AI_OPENAI_API_KEY', AI_API_KEY)
AI_OPENROUTER_BASE_URL = os.environ.get('AI_OPENROUTER_BASE_URL')
AI_OPENROUTER_API_KEY = os.environ.get('AI_OPENROUTER_API_KEY')
AI_ZAI_BASE_URL = os.environ.get('AI_ZAI_BASE_URL')
AI_ZAI_API_KEY = os.environ.get('AI_ZAI_API_KEY')

# ─── امنیت (تولید) ─────────────────────────────────────────────────────────
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
