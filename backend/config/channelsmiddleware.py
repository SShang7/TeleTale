from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser, User
from django.db import close_old_connections

from rest_framework_jwt.utils import jwt_decode_token

from channels.auth import AuthMiddlewareStack
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async

from http.cookies import SimpleCookie
from jwt.exceptions import InvalidSignatureError

@database_sync_to_async
def get_user(validated_token):
    try:
        user = get_user_model().objects.get(id=validated_token['user_id'])
        return user
    except User.DoesNotExist:
        return AnonymousUser()


@database_sync_to_async
def jwt_decode_token_async(token):
    return jwt_decode_token(token)


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
       # Close old database connections to prevent usage of timed out connections
        close_old_connections()

        # Get the token
        headers = { k.decode('utf8') : v.decode('utf8') for (k, v) in scope['headers'] }
        cookie = SimpleCookie()
        cookie.load(headers['cookie'])
        cookies = { k : v.value for k, v in cookie.items() }
        token = cookies['jwt_token']

        #  Then token is valid, decode it
        try:
            decoded_data = await jwt_decode_token_async(token)
            # Will return a dictionary like -
            # {
            #     'token_type': 'access',
            #     'exp': 1568770772,
            #     'jti': '5c15e80d65b04c20ad34d77b6703251b',
            #     'user_id': 6
            # }
        except InvalidSignatureError:
            return None

        # Get the user using ID
        scope['user'] = await get_user(validated_token=decoded_data)
        return await super().__call__(scope, receive, send)


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))
