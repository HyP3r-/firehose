# Generated by Django 2.2.1 on 2019-05-21 00:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hose', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hose',
            name='length',
            field=models.FloatField(),
        ),
    ]
