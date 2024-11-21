# Generated by Django 5.1.1 on 2024-11-21 08:56

import Products.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0090_alter_category_c_id_alter_product_is_active_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default=Products.models.generate_unique_alphanumeric, max_length=2, unique=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default=Products.models.generate_unique_alphanumeric, max_length=10, unique=True),
        ),
    ]
