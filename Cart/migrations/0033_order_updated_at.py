# Generated by Django 5.1.1 on 2024-11-29 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0032_alter_order_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
