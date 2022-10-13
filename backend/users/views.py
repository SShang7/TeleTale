from rest_framework.views import APIView
from rest_framework.response import Response

from profiles.models import Profile

# Create your views here.
class ProfileView(APIView):
    def get(self, request):
        # TODO: this is a stub
        # TODO: parse user info from request
        user = request.user
        
        profile = Profile.objects.get_or_create(user=user)[0]
        return Response({
            "name": profile.display_name,
            "email": user.email,
            "bio": profile.bio,
        })
