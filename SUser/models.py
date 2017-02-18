# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class SUser(models.Model):
	uid = models.IntegerField()
	qid_list = models.TextField(default='{}')
	is_sample = models.BooleanField(default=1)
	credit = models.IntegerField(default=0)

	username                    = models.CharField(max_length=64)
	name                        = models.CharField(max_length=64, default='')
	name_english                = models.CharField(max_length=64, default='')
	student_type_code           = models.CharField(max_length=16, default='0')
	student_type                = models.CharField(max_length=64, default='')
	gender_code                 = models.CharField(max_length=16, default='0')
	gender                      = models.CharField(max_length=64, default='')
	birthday                    = models.CharField(max_length=64, default='')
	ethnic_code                 = models.CharField(max_length=16, default='0')
	ethnic                      = models.CharField(max_length=64, default='')
	nationality_code            = models.CharField(max_length=16, default='0')
	nationality                 = models.CharField(max_length=64, default='')
	political_status_code       = models.CharField(max_length=16, default='0')
	political_status            = models.CharField(max_length=64, default='')
	certificate_type_code       = models.CharField(max_length=16, default='0')
	certificate_type            = models.CharField(max_length=64, default='')
	certificate_number          = models.CharField(max_length=64, default='')
	marital_status_code         = models.CharField(max_length=16, default='0')
	marital_status              = models.CharField(max_length=64, default='')
	original_education_code     = models.CharField(max_length=16, default='0')
	original_education          = models.CharField(max_length=64, default='')
	bachelor_school             = models.CharField(max_length=64, default='')
	bachelor_school_code        = models.CharField(max_length=16, default='0')
	bachelor_major              = models.CharField(max_length=64, default='')
	bachelor_major_code         = models.CharField(max_length=16, default='0')
	bachelor_graduate_time      = models.CharField(max_length=64, default='')
	master_school               = models.CharField(max_length=64, default='')
	master_school_code          = models.CharField(max_length=16, default='0')
	master_major                = models.CharField(max_length=64, default='')
	master_major_code           = models.CharField(max_length=16, default='0')
	master_graduate_time        = models.CharField(max_length=64, default='')
	master_degree_date          = models.CharField(max_length=64, default='')
	department_number           = models.CharField(max_length=16, default='0')
	department                  = models.CharField(max_length=64, default='')
	secondary_subject_code      = models.CharField(max_length=16, default='0')
	secondary_subject           = models.CharField(max_length=64, default='')
	advisor_certificate_number  = models.CharField(max_length=64, default='')
	enrollment_time             = models.CharField(max_length=64, default='')
	scheme_time                 = models.CharField(max_length=64, default='')
	enrollment_mode_code        = models.CharField(max_length=16, default='0')
	enrollment_mode             = models.CharField(max_length=64, default='')
	admission_type_code         = models.CharField(max_length=16, default='0')
	admission_type              = models.CharField(max_length=64, default='')
	targeted_area_type_code     = models.CharField(max_length=16, default='0')
	targeted_area_type          = models.CharField(max_length=64, default='')
	student_source_code         = models.CharField(max_length=16, default='0')
	student_source              = models.CharField(max_length=64, default='')
	examination_ticket_number   = models.CharField(max_length=64, default='')
	bachelor_student_number     = models.CharField(max_length=64, default='')
	master_student_number       = models.CharField(max_length=64, default='')
	origin_place_code           = models.CharField(max_length=16, default='0')
	origin_place                = models.CharField(max_length=64, default='')
	dormitory_address           = models.CharField(max_length=64, default='')
	dormitory_telephone         = models.CharField(max_length=64, default='')
	original_unit               = models.CharField(max_length=64, default='')
	client_unit                 = models.CharField(max_length=64, default='')
	email                       = models.CharField(max_length=64, default='')
	if_bed                      = models.CharField(max_length=64, default='')
	if_socialized_madicine      = models.CharField(max_length=64, default='')
	if_resident_migration       = models.CharField(max_length=64, default='')
	if_internal_school_roll     = models.CharField(max_length=64, default='')
	if_national_school_roll     = models.CharField(max_length=64, default='')
	if_school_roll_abnormity    = models.CharField(max_length=64, default='')
	if_international_student    = models.CharField(max_length=64, default='')
	estimated_graduate_date     = models.CharField(max_length=64, default='')
	defense_date                = models.CharField(max_length=64, default='')
	completion_date             = models.CharField(max_length=64, default='')
	if_graduate                 = models.CharField(max_length=64, default='')
	completion_mode_code        = models.CharField(max_length=16, default='0')
	completion_mode             = models.CharField(max_length=64, default='')
	graduate_certificate_number = models.CharField(max_length=64, default='')
	degree_confer_date          = models.CharField(max_length=64, default='')
	degree_confer_mode_code     = models.CharField(max_length=16, default='0')
	degree_confer_mode          = models.CharField(max_length=64, default='')
	training_type_code          = models.CharField(max_length=16, default='0')
	training_type               = models.CharField(max_length=64, default='')
	training_direction_code     = models.CharField(max_length=16, default='0')
	training_direction          = models.CharField(max_length=64, default='')
	disciplines_field_code      = models.CharField(max_length=16, default='0')
	disciplines_field           = models.CharField(max_length=64, default='')
	major_code                  = models.CharField(max_length=16, default='0')
	major                       = models.CharField(max_length=64, default='')
	diploma_number              = models.CharField(max_length=64, default='')
	school_roll_status_code     = models.CharField(max_length=16, default='0')
	campus_code                 = models.CharField(max_length=16, default='0')
	campus                      = models.CharField(max_length=64, default='')
	remark                      = models.CharField(max_length=64, default='')
	advisor_name                = models.CharField(max_length=64, default='')
	special_condition_code      = models.CharField(max_length=16, default='0')
	special_condition           = models.CharField(max_length=64, default='')
	if_primary_subject          = models.CharField(max_length=64, default='')
	origin_province_code        = models.CharField(max_length=16, default='0')
	origin_province             = models.CharField(max_length=64, default='')
	origin_city_code            = models.CharField(max_length=16, default='0')
	origin_city                 = models.CharField(max_length=64, default='')
	address_province_code       = models.CharField(max_length=16, default='0')
	address_province            = models.CharField(max_length=64, default='')
	client_unit_city_code       = models.CharField(max_length=16, default='0')
	client_unit_city            = models.CharField(max_length=64, default='')
	original_student_number     = models.CharField(max_length=64, default='')
	abnormity_type_code         = models.CharField(max_length=16, default='0')
	abnormity_type              = models.CharField(max_length=64, default='')
	alteration_date             = models.CharField(max_length=64, default='')