from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    display_name = models.CharField(max_length=45, default="")
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField()
