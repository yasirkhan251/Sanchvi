# Generated by Django 5.0.4 on 2024-07-23 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0008_category_detail_alter_category_c_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='image',
            new_name='images',
        ),
        migrations.AddField(
            model_name='product',
            name='img',
            field=models.ImageField(blank=True, null=True, upload_to='static/Image/product'),
        ),
        migrations.AlterField(
            model_name='category',
            name='c_id',
            field=models.CharField(default='EO', max_length=2),
        ),
        migrations.AlterField(
            model_name='product',
            name='pcode',
            field=models.CharField(default='UMKa', max_length=5, unique=True),
        ),
    ]
