# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-21 12:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SUser', '0005_auto_20170520_0223'),
    ]

    operations = [
        migrations.AlterField(
            model_name='suser',
            name='abnormity_type_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='address_province_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='admission_type_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='bachelor_school_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='campus_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='certificate_type_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='client_unit_city_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='completion_mode_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='degree_confer_mode_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='department_number',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='disciplines_field_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='enrollment_mode_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='ethnic_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='gender_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='major_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='marital_status_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='master_major_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='master_school_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='nationality_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='origin_place_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='origin_province_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='original_education_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='political_status_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='school_roll_status_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='secondary_subject_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='special_condition_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='student_source_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='student_type_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='targeted_area_type_code',
            field=models.CharField(default='0', max_length=16),
        ),
        migrations.AlterField(
            model_name='suser',
            name='training_type_code',
            field=models.CharField(default='0', max_length=16),
        ),
    ]
