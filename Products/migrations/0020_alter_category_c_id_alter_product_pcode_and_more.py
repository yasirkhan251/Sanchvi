# Generated by Django 5.0.7 on 2024-09-10 10:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0019_alter_category_c_id_alter_product_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='Ow', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='h04p', max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='productprice',
            name='size',
            field=models.CharField(choices=[('0-6 months', '0-6 months'), ('6-12 months', '6-12 months'), ('1-2 years', '1-2 years'), ('2-3 years', '2-3 years'), ('3-4 years', '3-4 years'), ('4-5 years', '4-5 years'), ('5-6 years', '5-6 years'), ('6-7 years', '6-7 years'), ('7-8 years', '7-8 years'), ('8-9 years', '8-9 years'), ('9-10 years', '9-10 years'), ('10-11 years', '10-11 years'), ('11-12 years', '11-12 years'), ('12-13 years', '12-13 years'), ('13-14 years', '13-14 years'), ('14-15 years', '14-15 years'), ('15+ years', '15+ years')], max_length=50),
        ),
        migrations.CreateModel(
            name='Productcolorpalet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('color', models.CharField(blank=True, max_length=50, null=True)),
                ('Product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='colorpalet', to='Products.product')),
            ],
        ),
    ]
