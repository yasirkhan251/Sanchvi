# Generated by Django 5.0.7 on 2024-09-13 11:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0006_initial'),
        ('Products', '0029_alter_category_c_id_alter_product_pcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Products.product'),
        ),
        migrations.AlterField(
            model_name='cart',
            name='productid',
            field=models.CharField(max_length=100),
        ),
    ]
