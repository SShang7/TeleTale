from django.core.exceptions import ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth.models import User
from profiles.models import Profile

# Create your views here.
class ProfileView(APIView):
    def get(self, request):
        # TODO: validate user credentials
        email = request.GET.get('email', None)
        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({ "error": "User does not exist" }, 400)

        try:
            profile = Profile.objects.get(user=user)
        except ObjectDoesNotExist:
            profile = Profile(user=user, display_name=user.first_name, bio="")
            profile.save()

        return Response({
            "name": profile.display_name,
            "email": user.email,
            "bio": profile.bio,
        }, 200)
