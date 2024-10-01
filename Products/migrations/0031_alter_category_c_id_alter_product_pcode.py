# Generated by Django 5.0.7 on 2024-09-14 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0030_alter_category_c_id_alter_product_pcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='Dj', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='IpPA', max_length=10, unique=True),
        ),
    ]