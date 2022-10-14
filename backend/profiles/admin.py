from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    fields = ('user', 'display_name', 'bio')
    list_display = ('user', 'display_name')
