# Generated by Django 5.1.1 on 2024-10-29 06:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Admin', '0009_delete_shippingrate'),
        ('Cart', '0015_delete_shippingrate'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShippingRate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('small', models.DecimalField(decimal_places=2, max_digits=10)),
                ('medium', models.DecimalField(decimal_places=2, max_digits=10)),
                ('large', models.DecimalField(decimal_places=2, max_digits=10)),
                ('extra_large', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transit_time', models.CharField(max_length=50)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Admin.country')),
            ],
            options={
                'verbose_name': 'Shipping Rate',
                'verbose_name_plural': 'Shipping Rates',
                'db_table': 'shipping_rates',
            },
        ),
    ]
