# Generated by Django 5.0.7 on 2024-09-19 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0037_alter_category_c_id_alter_product_pcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='w8', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='Ld35', max_length=10, unique=True),
        ),
    ]