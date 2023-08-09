# Generated by Django 3.2.18 on 2023-07-22 05:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Store',
            fields=[
                ('storeid', models.AutoField(primary_key=True, serialize=False)),
                ('storename', models.CharField(max_length=50)),
                ('storeno', models.CharField(default='', max_length=50, unique=True)),
                ('status', models.IntegerField(default=0)),
                ('address', models.CharField(default='', max_length=200)),
                ('dateadded', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'db_table': 'tblStore',
            },
        ),
        migrations.CreateModel(
            name='StoreType',
            fields=[
                ('typeid', models.AutoField(primary_key=True, serialize=False)),
                ('typename', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'tblStoreType',
            },
        ),
        migrations.CreateModel(
            name='StoreHistory',
            fields=[
                ('historyid', models.AutoField(primary_key=True, serialize=False)),
                ('oldvalue', models.CharField(default='', max_length=50)),
                ('newvalue', models.CharField(default='', max_length=50)),
                ('remarks', models.CharField(default='', max_length=200)),
                ('date', models.DateTimeField(default=django.utils.timezone.now)),
                ('store', models.ForeignKey(default=0, on_delete=django.db.models.deletion.SET_DEFAULT, to='store.store')),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.SET_DEFAULT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'tblStoreHistory',
            },
        ),
        migrations.AddField(
            model_name='store',
            name='storetype',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.SET_DEFAULT, to='store.storetype'),
        ),
    ]
