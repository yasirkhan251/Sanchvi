# Generated by Django 5.1.1 on 2024-11-02 12:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0024_alter_shippingrate_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='box_size',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
