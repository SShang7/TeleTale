import logging
import random
import string

from django.core.exceptions import ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework.response import Response

from api.mixins import ApiErrorsMixin, ApiAuthMixin

from .models import Game
from profiles.models import Profile


def generate_game_id():
    return ''.join(random.sample(string.ascii_lowercase, 10))


class CreateGameApi(ApiAuthMixin, ApiErrorsMixin, APIView):
    _logger = logging.getLogger(__name__)

    def post(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except ObjectDoesNotExist:
            self._logger.error(f"Profile for user {user} does not exist.")
            return Response(status=404)

        try:
            game = Game.objects.get(owner=profile)
            game_id = game.game_id
        except ObjectDoesNotExist:
            self._logger.debug(
                f"User {user} is already the owner of another game.")
            game_id = generate_game_id()
            while Game.objects.filter(game_id=game_id).count() != 0:
                game_id = generate_game_id()
            Game.objects.create(game_id=game_id, owner=profile)

        print(game_id)
        return Response({
            "gameId": game_id,
        })
