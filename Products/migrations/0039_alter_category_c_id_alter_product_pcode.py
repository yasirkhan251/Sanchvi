# Generated by Django 5.0.7 on 2024-09-20 05:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0038_alter_category_c_id_alter_product_pcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='eQ', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='2kft', max_length=10, unique=True),
        ),
    ]
