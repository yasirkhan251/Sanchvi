# Generated by Django 5.1.1 on 2024-10-31 10:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Admin', '0009_delete_shippingrate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='city',
            name='state',
        ),
        migrations.DeleteModel(
            name='Area',
        ),
        migrations.DeleteModel(
            name='City',
        ),
    ]
