# Generated by Django 5.0.7 on 2024-09-13 11:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0004_alter_cart_product_alter_cart_productid'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Cart',
        ),
    ]