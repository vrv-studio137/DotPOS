# Generated by Django 3.2.18 on 2023-07-25 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='amounttendered',
            field=models.FloatField(default=0),
        ),
    ]
