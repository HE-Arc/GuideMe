# Generated by Django 3.1.7 on 2021-03-08 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guidemeapp', '0004_auto_20210306_2027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='image',
            field=models.FilePathField(path='C:\\Users\\ugo90\\Documents\\cours\\projet\\GuideMe\\backend\\guideme\\images'),
        ),
    ]
