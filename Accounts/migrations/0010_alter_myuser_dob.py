# Generated by Django 5.0.4 on 2024-05-12 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Accounts', '0009_alter_myuser_server_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='dob',
            field=models.CharField(default=None, max_length=100),
        ),
    ]
