# Generated by Django 4.1.2 on 2022-10-19 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='display_name',
            field=models.CharField(default='', max_length=45),
        ),
    ]
