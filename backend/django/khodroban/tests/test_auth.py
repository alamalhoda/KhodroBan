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

    def test_me_get_unauthorized(self):
        response = self.client.get('/api/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_get_authenticated(self):
        user = User.objects.create_user(
            username="meuser",
            email="me@example.com",
            password="MePass123!"
        )
        UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'email': user.email,
                'first_name': user.first_name or '',
                'last_name': user.last_name or '',
            },
        )
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('id', response.data)
        self.assertIn('email', response.data)
        self.assertIn('name', response.data)
        self.assertIn('tier', response.data)

    def test_me_patch_authenticated(self):
        user = User.objects.create_user(
            username="patchuser",
            email="patch@example.com",
            password="PatchPass123!"
        )
        profile = UserProfile.objects.create(
            user=user,
            email=user.email,
            first_name="Old",
            last_name="Name",
        )
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            '/api/me/',
            {'firstName': 'New', 'lastName': 'Last'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        profile.refresh_from_db()
        self.assertEqual(profile.first_name, 'New')
        self.assertEqual(profile.last_name, 'Last')
