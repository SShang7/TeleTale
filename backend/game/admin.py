from django.contrib import admin

from .models import Game, GamePlayer, GamePhrase

# Register your models here.
admin.site.register(Game)
admin.site.register(GamePlayer)
admin.site.register(GamePhrase)
