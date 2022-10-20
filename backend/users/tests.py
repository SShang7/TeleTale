from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient

from profiles.models import Profile

# Create your tests here.


class ProfileTestCase(TestCase):
    def setUp(self):
        User.objects.create(username='joebruin', email='jbruin@ucla.edu',
                            first_name='Joe', last_name='Bruin')

    def test_profile_dne(self):
        """Profile should not exist yet for a new user and should raise a DoesNotExist exception"""
        user = User.objects.get(username='joebruin')
        self.assertRaises(Profile.DoesNotExist, Profile.objects.get, user=user)

    def test_profile_creation(self):
        """Profile gets created and is returned on GET request"""
        client = APIClient()
        user = User.objects.get(username='joebruin')
        client.force_authenticate(user=user)

        response = client.get(reverse('api:v1:users:profile'))
        self.assertEqual(response.json(), {
            'name': 'Joe',
            'email': 'jbruin@ucla.edu',
            'bio': ''
        })
