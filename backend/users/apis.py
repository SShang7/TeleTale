from django.core.exceptions import ObjectDoesNotExist

from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response

from api.mixins import ApiErrorsMixin, ApiAuthMixin, PublicApiMixin

from auth.services import jwt_login, google_validate_id_token

from profiles.models import Profile

from .services import user_get_or_create
from .selectors import user_get_me


class UserProfileApi(ApiAuthMixin, ApiErrorsMixin, APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except ObjectDoesNotExist:
            profile = Profile(user=user, display_name=user.first_name, bio="")
            profile.save()

        return Response({
            "name": profile.display_name,
            "email": user.email,
            "bio": profile.bio,
        })


class UserInitApi(PublicApiMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()
        first_name = serializers.CharField(required=False, default='')
        last_name = serializers.CharField(required=False, default='')

    def post(self, request, *args, **kwargs):
        id_token = request.headers.get('Authorization')
        google_validate_id_token(id_token=id_token)

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # We use get-or-create logic here for the sake of the example.
        # We don't have a sign-up flow.
        user, _ = user_get_or_create(**serializer.validated_data)

        response = Response(data=user_get_me(user=user))
        response = jwt_login(response=response, user=user)

        return response
