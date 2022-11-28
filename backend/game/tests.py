from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient

from profiles.models import Profile

# Create your tests here.


class GameTestCase(TestCase):
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

    def test_create_game(self):
        """Create game endpoint should return JSON with gameId"""
        client = APIClient()
        client.force_authenticate(user=self.user)

        response = client.post(reverse('api:v1:game:create-game'))
        self.assertTrue('gameId' in response.json())

    def test_get_same_game(self):
        """Create game endpoint should return the already created game"""
        client = APIClient()
        client.force_authenticate(user=self.user)

        response = client.post(reverse('api:v1:game:create-game'))
        self.assertTrue('gameId' in response.json())

        game_id = response.json()['gameId']
        response = client.post(reverse('api:v1:game:create-game'))
        self.assertTrue('gameId' in response.json())
        self.assertEqual(game_id, response.json()['gameId'])
