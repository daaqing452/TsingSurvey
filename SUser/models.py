# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class SUser(models.Model):
	uid = models.IntegerField()
	level = models.IntegerField(default=0)
	qid_list = models.TextField(default='{}')
	is_sample = models.BooleanField(default=1)
	is_store = models.BooleanField(default=0)
	credit = models.IntegerField(default=0)
	nickname = models.CharField(max_length=64, default='')

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
	bachelor_major_code         = models.CharField(max_length=15, default='0')
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
	remark                      = models.CharField(max_length=256, default='')
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

	__var_name__ = ['username', 'name', 'name_english', 'student_type_code', 'student_type', 'gender_code', 'gender', 'birthday', 'ethnic_code', 'ethnic', 'nationality_code', 'nationality', 'political_status_code', 'political_status', 'certificate_type_code', 'certificate_type', 'certificate_number', 'marital_status_code', 'marital_status', 'original_education_code', 'original_education', 'bachelor_school', 'bachelor_school_code', 'bachelor_major', 'bachelor_major_code', 'bachelor_graduate_time', 'master_school', 'master_school_code', 'master_major', 'master_major_code', 'master_graduate_time', 'master_degree_date', 'department_number', 'department', 'secondary_subject_code', 'secondary_subject', 'advisor_certificate_number', 'enrollment_time', 'scheme_time', 'enrollment_mode_code', 'enrollment_mode', 'admission_type_code', 'admission_type', 'targeted_area_type_code', 'targeted_area_type', 'student_source_code', 'student_source', 'examination_ticket_number', 'bachelor_student_number', 'master_student_number', 'origin_place_code', 'origin_place', 'dormitory_address', 'dormitory_telephone', 'original_unit', 'client_unit', 'email', 'if_bed', 'if_socialized_madicine', 'if_resident_migration', 'if_internal_school_roll', 'if_national_school_roll', 'if_school_roll_abnormity', 'if_international_student', 'estimated_graduate_date', 'defense_date', 'completion_date', 'if_graduate', 'completion_mode_code', 'completion_mode', 'graduate_certificate_number', 'degree_confer_date', 'degree_confer_mode_code', 'degree_confer_mode', 'training_type_code', 'training_type', 'training_direction_code', 'training_direction', 'disciplines_field_code', 'disciplines_field', 'major_code', 'major', 'diploma_number', 'school_roll_status_code', 'campus_code', 'campus', 'remark', 'advisor_name', 'special_condition_code', 'special_condition', 'if_primary_subject', 'origin_province_code', 'origin_province', 'origin_city_code', 'origin_city', 'address_province_code', 'address_province', 'client_unit_city_code', 'client_unit_city', 'original_student_number', 'abnormity_type_code', 'abnormity_type', 'alteration_date']

	__var_chinese__ = ['学号', '姓名', '英文姓名', '学生类别代码', '学生类别', '性别代码', '性别', '出生日期', '民族代码', '民族', '国别代码', '国别、地区', '政治面貌代码', '政治面貌', '证件类型代码', '证件类型', '证件号', '婚姻状况代码', '婚姻状况', '原学历代码', '原学历', '大学毕校', '大学毕校码', '大学专业', '大学专业码', '大学毕业年月', '硕士毕校', '硕士毕校码', '硕士专业', '硕士专业码', '硕士毕业年月', '获硕日期', '系号', '院系所', '二级学科代码', '二级学科', '导师证号', '入学年月', '方案年月', '入学方式代码', '入学方式', '录取类别代码', '录取类别', '定向类别代码', '定向类别', '考生来源代码', '考生来源', '准考证号', '本科学号', '硕士学号', '生源地代码', '生源地', '宿舍地址', '宿舍电话', '原单位', '委定单位', '电子邮件', '是否有床位', '是否公费医疗', '是否户口迁入', '是否校内学籍', '是否国家学籍', '是否学籍异动', '是否留学生', '预计毕业日期', '答辩日期', '结业日期', '是否毕业', '结业方式代码', '结业方式', '毕业证书编号', '学位授予日期', '学位授予方式代码', '学位授予方式', '培养类别代码', '培养类别', '培养方向代码', '培养方向', '学科门类代码', '学科门类', '专业代码', '专业', '学位证书编号', '学籍状态码', '校区代码', '校区', '备注', '导师姓名', '学生特殊情况代码', '学生特殊情况', '是否一级学科', '籍贯省市代码', '籍贯省市', '籍贯市县代码', '籍贯市县', '家庭地省市代码', '家庭地省市', '委定单位地市县代码', '委定单位地市县', '原学号', '异动类别码', '异动类别', '变动日期']

class SampleList(models.Model):
	name = models.CharField(max_length=128)
	sample_list = models.TextField(default='{}')
