# Generated by Django 5.1.1 on 2024-10-29 06:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0016_shippingrate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shippingrate',
            name='id',
        ),
        migrations.AlterField(
            model_name='shippingrate',
            name='country',
            field=models.CharField(max_length=50, primary_key=True, serialize=False),
        ),
    ]
