# Generated by Django 5.1.1 on 2024-10-18 09:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0052_alter_category_c_id_alter_product_pcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='1V', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='lEgH', max_length=10, unique=True),
        ),
    ]
