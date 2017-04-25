# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-21 11:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SampleList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('sample_list', models.TextField(default='{}')),
            ],
        ),
        migrations.CreateModel(
            name='SUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.IntegerField()),
                ('qid_list', models.TextField(default='{}')),
                ('is_sample', models.BooleanField(default=1)),
                ('credit', models.IntegerField(default=0)),
                ('username', models.CharField(max_length=64)),
                ('name', models.CharField(default='', max_length=64)),
                ('name_english', models.CharField(default='', max_length=64)),
                ('student_type_code', models.CharField(default='0', max_length=16)),
                ('student_type', models.CharField(default='', max_length=64)),
                ('gender_code', models.CharField(default='0', max_length=16)),
                ('gender', models.CharField(default='', max_length=64)),
                ('birthday', models.CharField(default='', max_length=64)),
                ('ethnic_code', models.CharField(default='0', max_length=16)),
                ('ethnic', models.CharField(default='', max_length=64)),
                ('nationality_code', models.CharField(default='0', max_length=16)),
                ('nationality', models.CharField(default='', max_length=64)),
                ('political_status_code', models.CharField(default='0', max_length=16)),
                ('political_status', models.CharField(default='', max_length=64)),
                ('certificate_type_code', models.CharField(default='0', max_length=16)),
                ('certificate_type', models.CharField(default='', max_length=64)),
                ('certificate_number', models.CharField(default='', max_length=64)),
                ('marital_status_code', models.CharField(default='0', max_length=16)),
                ('marital_status', models.CharField(default='', max_length=64)),
                ('original_education_code', models.CharField(default='0', max_length=16)),
                ('original_education', models.CharField(default='', max_length=64)),
                ('bachelor_school', models.CharField(default='', max_length=64)),
                ('bachelor_school_code', models.CharField(default='0', max_length=16)),
                ('bachelor_major', models.CharField(default='', max_length=64)),
                ('bachelor_major_code', models.CharField(default='0', max_length=16)),
                ('bachelor_graduate_time', models.CharField(default='', max_length=64)),
                ('master_school', models.CharField(default='', max_length=64)),
                ('master_school_code', models.CharField(default='0', max_length=16)),
                ('master_major', models.CharField(default='', max_length=64)),
                ('master_major_code', models.CharField(default='0', max_length=16)),
                ('master_graduate_time', models.CharField(default='', max_length=64)),
                ('master_degree_date', models.CharField(default='', max_length=64)),
                ('department_number', models.CharField(default='0', max_length=16)),
                ('department', models.CharField(default='', max_length=64)),
                ('secondary_subject_code', models.CharField(default='0', max_length=16)),
                ('secondary_subject', models.CharField(default='', max_length=64)),
                ('advisor_certificate_number', models.CharField(default='', max_length=64)),
                ('enrollment_time', models.CharField(default='', max_length=64)),
                ('scheme_time', models.CharField(default='', max_length=64)),
                ('enrollment_mode_code', models.CharField(default='0', max_length=16)),
                ('enrollment_mode', models.CharField(default='', max_length=64)),
                ('admission_type_code', models.CharField(default='0', max_length=16)),
                ('admission_type', models.CharField(default='', max_length=64)),
                ('targeted_area_type_code', models.CharField(default='0', max_length=16)),
                ('targeted_area_type', models.CharField(default='', max_length=64)),
                ('student_source_code', models.CharField(default='0', max_length=16)),
                ('student_source', models.CharField(default='', max_length=64)),
                ('examination_ticket_number', models.CharField(default='', max_length=64)),
                ('bachelor_student_number', models.CharField(default='', max_length=64)),
                ('master_student_number', models.CharField(default='', max_length=64)),
                ('origin_place_code', models.CharField(default='0', max_length=16)),
                ('origin_place', models.CharField(default='', max_length=64)),
                ('dormitory_address', models.CharField(default='', max_length=64)),
                ('dormitory_telephone', models.CharField(default='', max_length=64)),
                ('original_unit', models.CharField(default='', max_length=64)),
                ('client_unit', models.CharField(default='', max_length=64)),
                ('email', models.CharField(default='', max_length=64)),
                ('if_bed', models.CharField(default='', max_length=64)),
                ('if_socialized_madicine', models.CharField(default='', max_length=64)),
                ('if_resident_migration', models.CharField(default='', max_length=64)),
                ('if_internal_school_roll', models.CharField(default='', max_length=64)),
                ('if_national_school_roll', models.CharField(default='', max_length=64)),
                ('if_school_roll_abnormity', models.CharField(default='', max_length=64)),
                ('if_international_student', models.CharField(default='', max_length=64)),
                ('estimated_graduate_date', models.CharField(default='', max_length=64)),
                ('defense_date', models.CharField(default='', max_length=64)),
                ('completion_date', models.CharField(default='', max_length=64)),
                ('if_graduate', models.CharField(default='', max_length=64)),
                ('completion_mode_code', models.CharField(default='0', max_length=16)),
                ('completion_mode', models.CharField(default='', max_length=64)),
                ('graduate_certificate_number', models.CharField(default='', max_length=64)),
                ('degree_confer_date', models.CharField(default='', max_length=64)),
                ('degree_confer_mode_code', models.CharField(default='0', max_length=16)),
                ('degree_confer_mode', models.CharField(default='', max_length=64)),
                ('training_type_code', models.CharField(default='0', max_length=16)),
                ('training_type', models.CharField(default='', max_length=64)),
                ('training_direction_code', models.CharField(default='0', max_length=16)),
                ('training_direction', models.CharField(default='', max_length=64)),
                ('disciplines_field_code', models.CharField(default='0', max_length=16)),
                ('disciplines_field', models.CharField(default='', max_length=64)),
                ('major_code', models.CharField(default='0', max_length=16)),
                ('major', models.CharField(default='', max_length=64)),
                ('diploma_number', models.CharField(default='', max_length=64)),
                ('school_roll_status_code', models.CharField(default='0', max_length=16)),
                ('campus_code', models.CharField(default='0', max_length=16)),
                ('campus', models.CharField(default='', max_length=64)),
                ('remark', models.CharField(default='', max_length=64)),
                ('advisor_name', models.CharField(default='', max_length=64)),
                ('special_condition_code', models.CharField(default='0', max_length=16)),
                ('special_condition', models.CharField(default='', max_length=64)),
                ('if_primary_subject', models.CharField(default='', max_length=64)),
                ('origin_province_code', models.CharField(default='0', max_length=16)),
                ('origin_province', models.CharField(default='', max_length=64)),
                ('origin_city_code', models.CharField(default='0', max_length=16)),
                ('origin_city', models.CharField(default='', max_length=64)),
                ('address_province_code', models.CharField(default='0', max_length=16)),
                ('address_province', models.CharField(default='', max_length=64)),
                ('client_unit_city_code', models.CharField(default='0', max_length=16)),
                ('client_unit_city', models.CharField(default='', max_length=64)),
                ('original_student_number', models.CharField(default='', max_length=64)),
                ('abnormity_type_code', models.CharField(default='0', max_length=16)),
                ('abnormity_type', models.CharField(default='', max_length=64)),
                ('alteration_date', models.CharField(default='', max_length=64)),
            ],
        ),
    ]
