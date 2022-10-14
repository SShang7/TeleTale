from django.urls import path

from .apis  import UserProfileApi, UserInitApi


urlpatterns = [
    path('profile/', UserProfileApi.as_view(), name='profile'),
    path('init/', UserInitApi.as_view(), name='init'),
]
