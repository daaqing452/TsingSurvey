# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2016-11-29 07:39
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SUser', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='suser',
            old_name='u_id',
            new_name='uid',
        ),
    ]