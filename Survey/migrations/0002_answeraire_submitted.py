# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-17 06:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Survey', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answeraire',
            name='submitted',
            field=models.BooleanField(default=0),
        ),
    ]