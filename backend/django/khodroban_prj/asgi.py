# khodroban_prj/asgi.py
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'khodroban_prj.settings')
application = get_asgi_application()
