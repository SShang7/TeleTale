import logging
from urllib.parse import urlencode

from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework_jwt.views import ObtainJSONWebTokenView

from django.urls import reverse
from django.conf import settings
from django.shortcuts import redirect

from api.mixins import ApiErrorsMixin, PublicApiMixin, ApiAuthMixin

from users.services import user_change_secret_key, user_get_or_create

from auth.services import jwt_login, google_get_access_token, google_get_user_info

from profiles.models import Profile


class LoginApi(ApiErrorsMixin, ObtainJSONWebTokenView):
    _logger = logging.getLogger(__name__)

    def post(self, request, *args, **kwargs):
        # Reference: https://github.com/Styria-Digital/django-rest-framework-jwt/blob/master/src/rest_framework_jwt/views.py#L44
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        return super().post(request, *args, **kwargs)


class GoogleLoginApi(PublicApiMixin, ApiErrorsMixin, APIView):
    _logger = logging.getLogger(__name__)

    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def get(self, request, *args, **kwargs):
        input_serializer = self.InputSerializer(data=request.GET)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get('code')
        error = validated_data.get('error')

        login_url = f'{settings.BASE_FRONTEND_URL}/login'

        if error or not code:
            self._logger.error(f"Error occurred while logging in user through OAuth: {error}")
            params = urlencode({'error': error})
            return redirect(f'{login_url}?{params}')

        domain = settings.BASE_BACKEND_URL
        api_uri = reverse('api:v1:auth:login-with-google')
        redirect_uri = f'{domain}{api_uri}'

        access_token = google_get_access_token(
            code=code, redirect_uri=redirect_uri)

        user_data = google_get_user_info(access_token=access_token)

        profile_data = {
            'email': user_data['email'],
            'username': user_data['email'],
            'first_name': user_data.get('given_name', ''),
            'last_name': user_data.get('family_name', ''),
        }

        # We use get-or-create logic here for the sake of the example.
        # We don't have a sign-up flow.
        user, _ = user_get_or_create(**profile_data)

        if not Profile.objects.filter(user=user).exists():
            self._logger.debug(f"Creating new profile for user {profile_data}.")
            profile = Profile(
                user=user,
                display_name=user.first_name,
                bio="Hello, there!",
                profile_pic=user_data['picture'])
            profile.save()

        response = redirect(settings.BASE_FRONTEND_URL)
        response = jwt_login(response=response, user=user)

        return response


class LogoutApi(ApiAuthMixin, ApiErrorsMixin, APIView):
    _logger = logging.getLogger(__name__)

    def get(self, request):
        """
        Logs out user by removing JWT cookie header.
        """
        user_change_secret_key(user=request.user)

        response = redirect(settings.BASE_FRONTEND_URL)
        response.delete_cookie(settings.JWT_AUTH['JWT_AUTH_COOKIE'])

        return response
