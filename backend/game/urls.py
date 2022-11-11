from django.urls import path

from .apis import CreateGameApi

urlpatterns = [
    path('create/', CreateGameApi.as_view(), name='create-game'),
]
