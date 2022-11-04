from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient

from config.settings import BASE_FRONTEND_URL


class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='joebruin',
            password='cs-130',
            first_name='Joe',
            last_name='Bruin',
            email='joebruin@ucla.edu')

    def test_login(self):
        """Login API should return JSON object with token and user data"""
        client = APIClient()
        response = client.post(
            reverse('api:v1:auth:login'),
            {
                'username': 'joebruin',
                'password': 'cs-130'
            })

        self.assertTrue(response.status_code == 201)
        self.assertTrue('token' in response.data)
        self.assertDictEqual(response.data['me'],
        {
            'id': 1,
            'first_name': 'Joe',
            'last_name': 'Bruin',
            'email': 'joebruin@ucla.edu',
        })

    def test_logout(self):
        """Logout API should redirect user to the frontend URL"""
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(reverse('api:v1:auth:logout'))

        self.assertTrue(response.status_code == 302)
        self.assertTrue(response.headers['Location'] == BASE_FRONTEND_URL)
