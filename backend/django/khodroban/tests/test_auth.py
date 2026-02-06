from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User

from khodroban.models import UserProfile


class AuthTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.token_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')

    def test_register_success(self):
        data = {
            "username": "testuser999",
            "email": "test999@example.com",
            "password": "TestPass123!",
            "password2": "TestPass123!",
            "first_name": "Test",
            "last_name": "User"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertTrue(User.objects.filter(username="testuser999").exists())

    def test_register_password_mismatch(self):
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "pass1",
            "password2": "pass2"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_success(self):
        user = User.objects.create_user(
            username="loginuser",
            email="login@example.com",
            password="LoginPass123!"
        )
        data = {"username": "loginuser", "password": "LoginPass123!"}
        response = self.client.post(self.token_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password(self):
        User.objects.create_user(username="wrong", password="correct")
        data = {"username": "wrong", "password": "incorrect"}
        response = self.client.post(self.token_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        User.objects.create_user(username="refresh", password="pass")
        refresh = self.client.post(
            self.token_url,
            {"username": "refresh", "password": "pass"},
            format='json'
        ).data['refresh']

        response = self.client.post(self.refresh_url, {"refresh": refresh}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
