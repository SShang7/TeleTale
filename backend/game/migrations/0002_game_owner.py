# Generated by Django 4.1.2 on 2022-11-04 02:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_alter_profile_profile_pic'),
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='owner',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='profiles.profile'),
        ),
    ]