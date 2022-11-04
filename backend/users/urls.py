from django.urls import path

from .apis import UserProfileApi, UserQueryProfileApi, UserInitApi


urlpatterns = [
    path('profile/', UserProfileApi.as_view(), name='profile'),
    path('profile/<int:id>', UserQueryProfileApi.as_view(), name='query_profile'),
    path('init/', UserInitApi.as_view(), name='init'),
]
