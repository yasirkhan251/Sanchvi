# Generated by Django 5.0.4 on 2024-07-08 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Accounts', '0018_remove_myuser_bio_remove_myuser_dob_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='myuser',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
    ]
