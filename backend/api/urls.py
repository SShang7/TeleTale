from django.urls import path, include

v1_patterns = [
    path('auth/', include(('auth.urls', 'auth'))),
    path('users/', include(('users.urls', 'users'))),
    path('game/', include(('game.urls', 'game'))),
]


urlpatterns = [
    path('v1/', include((v1_patterns, 'v1'))),
]
