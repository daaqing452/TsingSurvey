# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2016-12-25 05:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Survey', '0004_auto_20161225_0508'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='qid',
            field=models.IntegerField(default=-1),
            preserve_default=False,
        ),
    ]