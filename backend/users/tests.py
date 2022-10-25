from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient

from profiles.models import Profile

# Create your tests here.


class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='joebruin',
            email='jbruin@ucla.edu',
            first_name='Joe',
            last_name='Bruin')
        Profile.objects.create(
            user=self.user,
            display_name=self.user.first_name,
            bio='Hello, there!',
            profile_pic='')

    def test_get_profile(self):
        """Profile data should be returned from a GET request to the /api/v1/users/profile endpoint"""
        client = APIClient()
        client.force_authenticate(user=self.user)
        
        response = client.get(reverse('api:v1:users:profile'))
        self.assertEqual(response.json(), {
            'name': 'Joe',
            'email': 'jbruin@ucla.edu',
            'bio': 'Hello, there!',
            'profilePicture': ''
        })

    def test_profile_needs_authentication(self):
        """User must be authenticated to access the profile endpoint"""
        client = APIClient()

        response = client.get(reverse('api:v1:users:profile'))
        self.assertTrue(response.status_code == 401)

    def test_profile_deleted_on_user_delete(self):
        """Profile should be deleted when its user is deleted"""
        self.user.delete()
        self.assertRaises(Profile.DoesNotExist, Profile.objects.get, user=self.user)
