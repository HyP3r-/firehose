# Generated by Django 2.2.1 on 2019-05-21 23:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hose', '0003_auto_20190521_2120'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hose',
            old_name='manufacturer',
            new_name='hose_manufacturer',
        ),
        migrations.RenameField(
            model_name='hosehistory',
            old_name='event',
            new_name='hose_event',
        ),
        migrations.AlterUniqueTogether(
            name='hosehistory',
            unique_together={('date', 'hose', 'hose_event')},
        ),
    ]
