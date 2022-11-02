from django.contrib.auth.models import User


def user_get_me(*, user: User):
    return {
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email
    }


def jwt_response_payload_handler(token, user=None, request=None, *args, **kwargs):
    return {
        'token': token,
        'me': user_get_me(user=user),
    }
