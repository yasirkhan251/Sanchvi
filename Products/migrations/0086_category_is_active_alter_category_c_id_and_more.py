# Generated by Django 5.1.1 on 2024-11-19 07:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0085_product_is_active_alter_category_c_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='Iy', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='1Mam', max_length=10, unique=True),
        ),
    ]
