# Generated by Django 5.1.4 on 2025-03-03 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='derniere_connexion',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
