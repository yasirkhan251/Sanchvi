# Generated by Django 5.1.1 on 2024-10-06 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0041_contactme_created_at_alter_category_c_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='im', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='NqhK', max_length=10, unique=True),
        ),
    ]
