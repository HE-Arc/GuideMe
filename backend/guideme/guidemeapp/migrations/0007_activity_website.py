# Generated by Django 3.2 on 2021-04-12 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guidemeapp', '0006_alter_activity_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='website',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
