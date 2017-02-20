# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-02-20 08:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Survey', '0007_auto_20170220_0622'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Answer',
        ),
        migrations.DeleteModel(
            name='Question',
        ),
        migrations.RenameField(
            model_name='questionaire',
            old_name='question_list',
            new_name='questions',
        ),
        migrations.RemoveField(
            model_name='answeraire',
            name='answer_list',
        ),
        migrations.AddField(
            model_name='answeraire',
            name='answers',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='answeraire',
            name='create_time',
            field=models.DateTimeField(default='1970-01-01 00:00:00.000000'),
        ),
        migrations.AddField(
            model_name='answeraire',
            name='submit_time',
            field=models.DateTimeField(default='1970-01-01 00:00:00.000000'),
        ),
    ]
