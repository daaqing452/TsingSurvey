# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import Q 
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from SUser.models import SUser
from Survey.models import Questionaire
from Utils.views import Utils
import codecs
import json
import time

def index(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	rdata = {}
	rdata['user'] = user = request.user

	# 问卷列表
	suser = SUser.objects.get(uid=request.user.id)
	qid_dict = json.loads(suser.qid_list)

	if user.is_staff:
		questionaire_list = Questionaire.objects.all()
		rq_list = [Utils.remake_questionaire(questionaire, qid_dict) for questionaire in questionaire_list]
	else:
		rq_list = []
		for qid in qid_dict:
			questionaires = Questionaire.objects.filter(id=int(qid))
			if len(questionaires) > 0:
				rq_list.append(Utils.remake_questionaire(questionaires[0], qid_dict))

	rdata['rq_list'] = rq_list
	return render(request, 'index.html', rdata)

def login(request):
	# 如果已登录直接跳转
	if request.user.is_authenticated():
		return HttpResponseRedirect('/index/')
	rdata = {}
	login = False

	# 获取用户名密码
	username = request.POST.get('username')
	password = request.POST.get('password')

	if username is not None and password is not None:
		users = User.objects.filter(username=username)
		if len(users) == 0:
			rdata['info'] = 'Username not exist'
		else:
			# 如果不是root进行清华验证
			if username != 'root':
				if username == password:
					password = Utils.username_to_password(username)
					# 是否首次登陆
				else:
					password = ''
			
			# 验证
			user = auth.authenticate(username=username, password=password)
			if user is not None:
				auth.login(request, user)
				login = True
			else:
				rdata['info'] = 'Wrong password'

	if login:
		return HttpResponseRedirect('/index/')
	else:
		return render(request, 'login.html', rdata)

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect('/login/')

def user_list(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if not request.user.is_staff:
		return HttpResponseRedirect('/index/')
	rdata = {}
	rdata['user'] = user = request.user
	op = request.POST.get('op')

	def get_suser_list():
		return [{'uid': suser_raw.uid, 'username': suser_raw.username, 'name': suser_raw.name, 'is_sample': suser_raw.is_sample} for suser_raw in SUser.objects.all()]

	# 加载
	if op == 'load':
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 设置为样本
	if op == 'sample_yes':
		username_list = eval(request.POST.get('username_list'))
		for username in username_list:
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				suser.is_sample = 1
				suser.save()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 设置为非样本
	if op == 'sample_no':
		username_list = eval(request.POST.get('username_list'))
		for username in username_list:
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				suser.is_sample = 0
				suser.save()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 删除用户
	if op == 'delete':
		username_list = eval(request.POST.get('username_list'))
		for username in username_list:
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				uid = suser.uid
				users = User.objects.filter(id=uid)
				if len(users) > 0:
					user = users[0]
					suser.delete()
					user.delete()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 添加用户
	if op == 'add':
		username = request.POST.get('username')
		# 检查username
		susers = SUser.objects.filter(username=username)
		if len(susers) > 0:
			result = 'Username already exist'
		else:
			password = Utils.username_to_password(username)
			user = User.objects.create_user(username=username, password=password)
			suser = SUser.objects.create(uid=user.id, username=username)
			result = 'yes'
		return HttpResponse(json.dumps({'result': result, 'user_list': get_suser_list()}))

	# 导入用户名单
	upload = request.FILES.get('upload', None)
	if not upload is None:
		# 导入文件到本地
		f_path = 'temp/' + time.strftime('%Y%m%d%H%M%S') + '-' + upload.name
		f = open(f_path, 'wb')
		for chunk in upload.chunks():
			f.write(chunk)
		f.close()
		# 读入每一行
		f = codecs.open(f_path, 'r', 'gbk')
		line_no = -1
		while True:
			line_no += 1
			line = f.readline()
			if len(line) == 0: break
			if line_no == 0: continue
			a = line.split(',')
			username = a[0]
			users = User.objects.filter(username=username)
			if len(users) > 0:
				# 修改用户信息
				suser = SUser.objects.filter(username=username).update(name=a[1], name_english=a[2], student_type_code=a[3], student_type=a[4], gender_code=a[5], gender=a[6], birthday=a[7], ethnic_code=a[8], ethnic=a[9], nationality_code=a[10], nationality=a[11], political_status_code=a[12], political_status=a[13], certificate_type_code=a[14], certificate_type=a[15], certificate_number=a[16], marital_status_code=a[17], marital_status=a[18], original_education_code=a[19], original_education=a[20], bachelor_school=a[21], bachelor_school_code=a[22], bachelor_major=a[23], bachelor_major_code=a[24], bachelor_graduate_time=a[25], master_school=a[26], master_school_code=a[27], master_major=a[28], master_major_code=a[29], master_graduate_time=a[30], master_degree_date=a[31], department_number=a[32], department=a[33], secondary_subject_code=a[34], secondary_subject=a[35], advisor_certificate_number=a[36], enrollment_time=a[37], scheme_time=a[38], enrollment_mode_code=a[39], enrollment_mode=a[40], admission_type_code=a[41], admission_type=a[42], targeted_area_type_code=a[43], targeted_area_type=a[44], student_source_code=a[45], student_source=a[46], examination_ticket_number=a[47], bachelor_student_number=a[48], master_student_number=a[49], origin_place_code=a[50], origin_place=a[51], dormitory_address=a[52], dormitory_telephone=a[53], original_unit=a[54], client_unit=a[55], email=a[56], if_bed=a[57], if_socialized_madicine=a[58], if_resident_migration=a[59], if_internal_school_roll=a[60], if_national_school_roll=a[61], if_school_roll_abnormity=a[62], if_international_student=a[63], estimated_graduate_date=a[64], defense_date=a[65], completion_date=a[66], if_graduate=a[67], completion_mode_code=a[68], completion_mode=a[69], graduate_certificate_number=a[70], degree_confer_date=a[71], degree_confer_mode_code=a[72], degree_confer_mode=a[73], training_type_code=a[74], training_type=a[75], training_direction_code=a[76], training_direction=a[77], disciplines_field_code=a[78], disciplines_field=a[79], major_code=a[80], major=a[81], diploma_number=a[82], school_roll_status_code=a[83], campus_code=a[84], campus=a[85], remark=a[86], advisor_name=a[87], special_condition_code=a[88], special_condition=a[89], if_primary_subject=a[90], origin_province_code=a[91], origin_province=a[92], origin_city_code=a[93], origin_city=a[94], address_province_code=a[95], address_province=a[96], client_unit_city_code=a[97], client_unit_city=a[98], original_student_number=a[99], abnormity_type_code=a[100], abnormity_type=a[101], alteration_date=a[102])
			else:
				# 新建用户信息
				password = Utils.username_to_password(username)
				user = User.objects.create_user(username=username, password=password)
				suser = SUser.objects.create(uid=user.id, username=a[0], name=a[1], name_english=a[2], student_type_code=a[3], student_type=a[4], gender_code=a[5], gender=a[6], birthday=a[7], ethnic_code=a[8], ethnic=a[9], nationality_code=a[10], nationality=a[11], political_status_code=a[12], political_status=a[13], certificate_type_code=a[14], certificate_type=a[15], certificate_number=a[16], marital_status_code=a[17], marital_status=a[18], original_education_code=a[19], original_education=a[20], bachelor_school=a[21], bachelor_school_code=a[22], bachelor_major=a[23], bachelor_major_code=a[24], bachelor_graduate_time=a[25], master_school=a[26], master_school_code=a[27], master_major=a[28], master_major_code=a[29], master_graduate_time=a[30], master_degree_date=a[31], department_number=a[32], department=a[33], secondary_subject_code=a[34], secondary_subject=a[35], advisor_certificate_number=a[36], enrollment_time=a[37], scheme_time=a[38], enrollment_mode_code=a[39], enrollment_mode=a[40], admission_type_code=a[41], admission_type=a[42], targeted_area_type_code=a[43], targeted_area_type=a[44], student_source_code=a[45], student_source=a[46], examination_ticket_number=a[47], bachelor_student_number=a[48], master_student_number=a[49], origin_place_code=a[50], origin_place=a[51], dormitory_address=a[52], dormitory_telephone=a[53], original_unit=a[54], client_unit=a[55], email=a[56], if_bed=a[57], if_socialized_madicine=a[58], if_resident_migration=a[59], if_internal_school_roll=a[60], if_national_school_roll=a[61], if_school_roll_abnormity=a[62], if_international_student=a[63], estimated_graduate_date=a[64], defense_date=a[65], completion_date=a[66], if_graduate=a[67], completion_mode_code=a[68], completion_mode=a[69], graduate_certificate_number=a[70], degree_confer_date=a[71], degree_confer_mode_code=a[72], degree_confer_mode=a[73], training_type_code=a[74], training_type=a[75], training_direction_code=a[76], training_direction=a[77], disciplines_field_code=a[78], disciplines_field=a[79], major_code=a[80], major=a[81], diploma_number=a[82], school_roll_status_code=a[83], campus_code=a[84], campus=a[85], remark=a[86], advisor_name=a[87], special_condition_code=a[88], special_condition=a[89], if_primary_subject=a[90], origin_province_code=a[91], origin_province=a[92], origin_city_code=a[93], origin_city=a[94], address_province_code=a[95], address_province=a[96], client_unit_city_code=a[97], client_unit_city=a[98], original_student_number=a[99], abnormity_type_code=a[100], abnormity_type=a[101], alteration_date=a[102])
		f.close()
	
	rdata['user_list'] = get_suser_list()
	return render(request, 'user_list.html', rdata)

def admin_list(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if not request.user.is_superuser:
		return HttpResponseRedirect('/index/')
	rdata = {}
	rdata['user'] = user = request.user
	op = request.POST.get('op')

	def get_admin_list():
		return [{'uid': admin_raw.id, 'username': admin_raw.username, 'name': SUser.objects.get(uid=admin_raw.id).name} for admin_raw in User.objects.filter(is_staff=1).filter(~Q(username='root'))]

	# 加载
	if op == 'load':
		return HttpResponse(json.dumps({'admin_list': get_admin_list()}));

	# 删除管理员
	if op == 'delete':
		username_list = eval(request.POST.get('username_list'))
		for username in username_list:
			users = User.objects.filter(username=username)
			if len(users) > 0:
				user = users[0]
				user.is_staff = 0
				user.save()
		return HttpResponse(json.dumps({'admin_list': get_admin_list()}))

	# 添加管理员
	if op == 'add':
		username = request.POST.get('username')
		users = User.objects.filter(username=username)
		if len(users) > 0:
			user = users[0]
			user.is_staff = 1
			user.save()
			result = 'yes'
		else:
			result = 'no'
		return HttpResponse(json.dumps({'result': result, 'admin_list': get_admin_list()}))
	
	rdata['admin_list'] = get_admin_list()
	return render(request, 'admin_list.html', rdata)

def profile(request, uid):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if (not request.user.is_staff) and (str(request.user.id) != uid):
		return HttpResponseRedirect('/index/')
	rdata = {}
	rdata['user'] = user = request.user
	rdata['puser'] = puser = User.objects.get(id=uid)
	rdata['psuser'] = psuser = SUser.objects.get(uid=puser.id)
	op = request.POST.get('op')

	qid_dict = json.loads(psuser.qid_list)
	rq_list = []
	for qid in qid_dict:
		questionaires = Questionaire.objects.filter(id=qid)
		if len(questionaires) > 0:
			questionaire = questionaires[0]
			rq_list.append(Utils.remake_questionaire(questionaire, qid_dict))
	rdata['rq_list'] = rq_list

	return render(request, 'profile.html', rdata)