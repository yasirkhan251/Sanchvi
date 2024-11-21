# Generated by Django 5.1.1 on 2024-11-19 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0088_remove_product_is_active_alter_category_c_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='aS', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='t9Ss', max_length=10, unique=True),
        ),
    ]
