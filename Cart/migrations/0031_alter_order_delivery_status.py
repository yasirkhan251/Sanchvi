# Generated by Django 5.1.1 on 2024-11-29 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0030_order_delivery_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='delivery_status',
            field=models.CharField(choices=[('placed', 'Order Placed'), ('packed', 'Order Packed'), ('shipped', 'Order Shipped'), ('received_city', 'Received in City'), ('out_for_delivery', 'Out for Delivery'), ('delivered', 'Delivered')], default='placed', max_length=20),
        ),
    ]
