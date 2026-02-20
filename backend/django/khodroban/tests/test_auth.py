from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from khodroban.models import UserProfile, UserSubscription


class AuthTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.token_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')

    def test_register_success(self):
        pwd = get_random_string(12)
        data = {
            "username": "testuser999",
            "email": "test999@example.com",
            "password": pwd,
            "password2": pwd,
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
            "password": get_random_string(8),
            "password2": get_random_string(8),
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_success(self):
        pwd = get_random_string(12)
        User.objects.create_user(
            username="loginuser",
            email="login@example.com",
            password=pwd,
        )
        data = {"username": "loginuser", "password": pwd}
        response = self.client.post(self.token_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password(self):
        right_pwd = get_random_string(12)
        wrong_pwd = get_random_string(12)
        User.objects.create_user(username="wrong", password=right_pwd)
        data = {"username": "wrong", "password": wrong_pwd}
        response = self.client.post(self.token_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        pwd = get_random_string(12)
        User.objects.create_user(username="refresh", password=pwd)
        refresh = self.client.post(
            self.token_url,
            {"username": "refresh", "password": pwd},
            format='json'
        ).data['refresh']

        response = self.client.post(self.refresh_url, {"refresh": refresh}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_me_get_unauthorized(self):
        response = self.client.get('/api/me/')
        # DRF IsAuthenticated returns 403 for anonymous (no credentials)
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_me_get_authenticated(self):
        pwd = get_random_string(12)
        user = User.objects.create_user(
            username="meuser",
            email="me@example.com",
            password=pwd,
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
        pwd = get_random_string(12)
        user = User.objects.create_user(
            username="patchuser",
            email="patch@example.com",
            password=pwd,
        )
        profile = UserProfile.objects.get(user=user)
        profile.first_name = "Old"
        profile.last_name = "Name"
        profile.save()
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

    def test_me_get_succeeds_when_profile_missing_creates_it(self):
        """کاربر بدون UserProfile با GET /api/me/ باید ۲۰۰ و داده معتبر بگیرد (MeView در صورت فقدان، profile را می‌سازد)."""
        pwd = get_random_string(12)
        user = User.objects.create_user(
            username="noprofile",
            email="noprofile@example.com",
            password=pwd,
        )
        profile = UserProfile.objects.get(user=user)
        UserSubscription.objects.filter(user_profile=profile).delete()
        profile.delete()
        self.assertFalse(UserProfile.objects.filter(user=user).exists())
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'], 'noprofile@example.com')
