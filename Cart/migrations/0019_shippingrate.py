# Generated by Django 5.1.1 on 2024-10-29 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0018_delete_shippingrate'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShippingRate',
            fields=[
                ('country', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('small', models.DecimalField(decimal_places=2, max_digits=10)),
                ('medium', models.DecimalField(decimal_places=2, max_digits=10)),
                ('large', models.DecimalField(decimal_places=2, max_digits=10)),
                ('extra_large', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transit_time', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'Shipping Rate',
                'verbose_name_plural': 'Shipping Rates',
                'db_table': 'shipping_rates',
            },
        ),
    ]
