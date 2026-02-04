# khodroban_prj/urls.py
"""Root URL configuration: همهٔ مسیرها از اپ khodroban می‌آیند."""
from django.urls import path, include

urlpatterns = [
    path('', include('khodroban.urls')),
]
