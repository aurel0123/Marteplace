# Generated by Django 5.1.4 on 2025-03-04 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_customuser_nom_alter_customuser_prenom'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailverification',
            name='code',
            field=models.CharField(max_length=6, null=True),
        ),
    ]
