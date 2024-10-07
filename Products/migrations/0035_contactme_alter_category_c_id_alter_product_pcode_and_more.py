# Generated by Django 5.0.7 on 2024-09-18 08:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0034_alter_category_c_id_alter_product_pcode'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactMe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('mobile', models.BigIntegerField()),
                ('message', models.TextField()),
            ],
        ),
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='sc', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='kyGe', max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='productcolorpalet',
            name='Product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Products.product'),
        ),
    ]
