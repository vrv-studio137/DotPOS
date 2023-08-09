# Generated by Django 3.2.18 on 2023-07-25 05:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
        ('account', '0002_account_shop'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='shop',
        ),
        migrations.AddField(
            model_name='account',
            name='store',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.SET_DEFAULT, to='store.store'),
        ),
    ]
