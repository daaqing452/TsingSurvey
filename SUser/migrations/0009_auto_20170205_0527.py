# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-02-05 05:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SUser', '0008_auto_20161226_1331'),
    ]

    operations = [
        migrations.AddField(
            model_name='suser',
            name='abnormity_type',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='abnormity_type_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='address_province',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='address_province_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='admission_type',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='admission_type_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='advisor_certificate_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='advisor_name',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='alteration_date',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='bachelor_school',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='bechelor_graduate_time',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='bechelor_major',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='bechelor_major_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='bechelor_school_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='bechelor_student_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='birthday',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='campus',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='campus_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='certificate_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='certificate_type',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='certificate_type_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='client_unit',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='client_unit_city',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='client_unit_city_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='completion_date',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='completion_mode',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='completion_mode_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='defense_date',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='degree_confer_date',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='degree_confer_mode',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='degree_confer_mode_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='department',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='department_number',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='diploma_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='disciplines_field',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='disciplines_field_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='domitory_telephone',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='dormitory_address',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='email',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='enrollment_mode',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='enrollment_mode_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='enrollment_time',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='estimated_graduate_date',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='ethnic',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='ethnic_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='examination_ticket_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='gender',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='gender_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='graduate_certificate_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_bed',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_graduate',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_internal_school_roll',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_international_student',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_national_school_roll',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_primary_subject',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_resident_migration',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_school_roll_abnormity',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='if_socialized_madicine',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='major',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='major_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='marital_status',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='marital_status_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='master_degree_date',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='master_graduate_time',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='master_major',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='master_major_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='master_school',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='master_school_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='master_student_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='name_eng',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='nationality',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='nationality_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='origin_city',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='origin_city_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='origin_place',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='origin_place_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='origin_province',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='origin_province_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='original_education',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='original_education_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='original_student_number',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='original_unit',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='political_status',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='political_status_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='remark',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='scheme_time',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='school_roll_status_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='secondary_subject',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='secondary_subject_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='special_condition',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='special_condition_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='student_source',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='student_source_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='student_type',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='student_type_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='targeted_area_type',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='targeted_area_type_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='training_direction',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='training_direction_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='suser',
            name='training_type',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='suser',
            name='training_type_code',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='suser',
            name='name',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AlterField(
            model_name='suser',
            name='username',
            field=models.CharField(max_length=64),
        ),
    ]
