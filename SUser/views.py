# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import Q 
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from SUser.models import SUser
from Survey.models import Questionaire, Answeraire
import SUser.utils as Utils
import codecs
import json
import random
import time
import sys
reload(sys)
sys.setdefaultencoding( "utf-8" )

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
		for rq in rq_list:
			answeraires = Answeraire.objects.filter(qid=rq['id'])
			rq['filled_number'] = len(answeraires)
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

	ITEM_PER_PAGE = 20
	page_n = int(request.GET.get('page', 1))
	page_s = (page_n - 1) * ITEM_PER_PAGE
	page_t = min(page_s + ITEM_PER_PAGE, SUser.objects.count())
	rdata['page_current'] = page_n
	rdata['page_max'] = (SUser.objects.count() - 1) / ITEM_PER_PAGE + 1

	def get_suser_list():
		return [{'uid': suser_raw.uid, 'username': suser_raw.username, 'name': suser_raw.name, 'is_sample': suser_raw.is_sample} for suser_raw in SUser.objects.order_by('id')[page_s:page_t] ]

	# 加载
	if op == 'load':
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 设置为样本
	if op == 'sample_yes':
		username_list = json.loads(request.POST.get('username_list'))
		for username in username_list:
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				suser.is_sample = 1
				suser.save()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 设置为非样本
	if op == 'sample_no':
		username_list = json.loads(request.POST.get('username_list'))
		for username in username_list:
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				suser.is_sample = 0
				suser.save()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 删除用户
	if op == 'delete':
		username_list = json.loads(request.POST.get('username_list'))
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
	f = request.FILES.get('upload', None)
	if not f is None:
		f_path = Utils.upload_file(f)
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
	
	# 导出用户名单
	if op == 'export':
		excel_name = 'media/' + time.strftime('%Y%m%d%H%M%S') + '-export.csv'
		f = open(excel_name, 'w')
		f.write(u'用户ID,是否为样本,学号,姓名,英文姓名,学生类别代码,学生类别,性别代码,性别,出生日期,民族代码,民族,国别代码,国别、地区,政治面貌代码,政治面貌,证件类型代码,证件类型,证件号,婚姻状况代码,婚姻状况,原学历代码,原学历,大学毕校,大学毕校码,大学专业,大学专业码,大学毕业年月,硕士毕校,硕士毕校码,硕士专业,硕士专业码,硕士毕业年月,获硕日期,系号,院系所,二级学科代码,二级学科,导师证号,入学年月,方案年月,入学方式代码,入学方式,录取类别代码,录取类别,定向类别代码,定向类别,考生来源代码,考生来源,准考证号,本科学号,硕士学号,生源地代码,生源地,宿舍地址,宿舍电话,原单位,委定单位,电子邮件,是否有床位,是否公费医疗,是否户口迁入,是否校内学籍,是否国家学籍,是否学籍异动,是否留学生,预计毕业日期,答辩日期,结业日期,是否毕业,结业方式代码,结业方式,毕业证书编号,学位授予日期,学位授予方式代码,学位授予方式,培养类别代码,培养类别,培养方向代码,培养方向,学科门类代码,学科门类,专业代码,专业,学位证书编号,学籍状态码,校区代码,校区,备注,导师姓名,学生特殊情况代码,学生特殊情况,是否一级学科,籍贯省市代码,籍贯省市,籍贯市县代码,籍贯市县,家庭地省市代码,家庭地省市,委定单位地市县代码,委定单位地市县,原学号,异动类别码,异动类别,变动日期\n')
		susers = SUser.objects.all()
		for s in susers:
			if s.username == 'root': continue
			f.write(str(s.id) + ',' + str(s.is_sample) + ',' + str(s.username) + ',' + str(s.name) + ',' + str(s.name_english) + ',' + str(s.student_type_code) + ',' + str(s.student_type) + ',' + str(s.gender_code) + ',' + str(s.gender) + ',' + str(s.birthday) + ',' + str(s.ethnic_code) + ',' + str(s.ethnic) + ',' + str(s.nationality_code) + ',' + str(s.nationality) + ',' + str(s.political_status_code) + ',' + str(s.political_status) + ',' + str(s.certificate_type_code) + ',' + str(s.certificate_type) + ',' + str(s.certificate_number) + ',' + str(s.marital_status_code) + ',' + str(s.marital_status) + ',' + str(s.original_education_code) + ',' + str(s.original_education) + ',' + str(s.bachelor_school) + ',' + str(s.bachelor_school_code) + ',' + str(s.bachelor_major) + ',' + str(s.bachelor_major_code) + ',' + str(s.bachelor_graduate_time) + ',' + str(s.master_school) + ',' + str(s.master_school_code) + ',' + str(s.master_major) + ',' + str(s.master_major_code) + ',' + str(s.master_graduate_time) + ',' + str(s.master_degree_date) + ',' + str(s.department_number) + ',' + str(s.department) + ',' + str(s.secondary_subject_code) + ',' + str(s.secondary_subject) + ',' + str(s.advisor_certificate_number) + ',' + str(s.enrollment_time) + ',' + str(s.scheme_time) + ',' + str(s.enrollment_mode_code) + ',' + str(s.enrollment_mode) + ',' + str(s.admission_type_code) + ',' + str(s.admission_type) + ',' + str(s.targeted_area_type_code) + ',' + str(s.targeted_area_type) + ',' + str(s.student_source_code) + ',' + str(s.student_source) + ',' + str(s.examination_ticket_number) + ',' + str(s.bachelor_student_number) + ',' + str(s.master_student_number) + ',' + str(s.origin_place_code) + ',' + str(s.origin_place) + ',' + str(s.dormitory_address) + ',' + str(s.dormitory_telephone) + ',' + str(s.original_unit) + ',' + str(s.client_unit) + ',' + str(s.email) + ',' + str(s.if_bed) + ',' + str(s.if_socialized_madicine) + ',' + str(s.if_resident_migration) + ',' + str(s.if_internal_school_roll) + ',' + str(s.if_national_school_roll) + ',' + str(s.if_school_roll_abnormity) + ',' + str(s.if_international_student) + ',' + str(s.estimated_graduate_date) + ',' + str(s.defense_date) + ',' + str(s.completion_date) + ',' + str(s.if_graduate) + ',' + str(s.completion_mode_code) + ',' + str(s.completion_mode) + ',' + str(s.graduate_certificate_number) + ',' + str(s.degree_confer_date) + ',' + str(s.degree_confer_mode_code) + ',' + str(s.degree_confer_mode) + ',' + str(s.training_type_code) + ',' + str(s.training_type) + ',' + str(s.training_direction_code) + ',' + str(s.training_direction) + ',' + str(s.disciplines_field_code) + ',' + str(s.disciplines_field) + ',' + str(s.major_code) + ',' + str(s.major) + ',' + str(s.diploma_number) + ',' + str(s.school_roll_status_code) + ',' + str(s.campus_code) + ',' + str(s.campus) + ',' + str(s.remark) + ',' + str(s.advisor_name) + ',' + str(s.special_condition_code) + ',' + str(s.special_condition) + ',' + str(s.if_primary_subject) + ',' + str(s.origin_province_code) + ',' + str(s.origin_province) + ',' + str(s.origin_city_code) + ',' + str(s.origin_city) + ',' + str(s.address_province_code) + ',' + str(s.address_province) + ',' + str(s.client_unit_city_code) + ',' + str(s.client_unit_city) + ',' + str(s.original_student_number) + ',' + str(s.abnormity_type_code) + ',' + str(s.abnormity_type) + ',' + str(s.alteration_date) + '\n')
		f.close()
		return HttpResponse(json.dumps({'export_path': excel_name}))

	# 添加统计
	if op == 'add_statistic':
		return HttpResponse(json.dumps({'options': SUser.__var_chinese__}))

	# 显示统计
	if op == 'show_statistic':
		index = int(request.POST.get('index'))
		varname = SUser.__var_name__[index]
		susers = SUser.objects.filter(is_sample=1)
		values = [suser.__dict__[varname] for suser in susers]
		result = Utils.count(values)
		return HttpResponse(json.dumps({'result': result}))

	# 添加样本筛选条件
	if op == 'add_constraint':
		return HttpResponse(json.dumps({'options': SUser.__var_chinese__}))

	# 更改样本筛选条件
	if op == 'constraint_select_change':
		index = int(request.POST.get('index'))
		values = []
		if index != -1:
			varname = SUser.__var_name__[index]
			susers = SUser.objects.filter(~Q(username='root'))
			values = [suser.__dict__[varname] for suser in susers]
			values = Utils.count(values).keys()
		return HttpResponse(json.dumps({'index': index, 'values': values}))

	# 自动样本生成
	if op == 'auto_sample':
		# 构造命令
		constraints = json.loads(request.POST.get('constraints'));
		command = 'SUser.objects.filter(~Q(username="root"))'
		for index in constraints:
			var = SUser.__var_name__[int(index)]
			options = constraints[index]
			command += '.filter('
			for i in range(len(options)):
				command += 'Q(' + var + '="' + options[i] + '")'
				if i < len(options) - 1:
					command += '|'
			command += ')'
		# 获取符合要求的id
		susers = eval(command)
		ids = [suser.id for suser in susers]
		# 抽样
		upperbound = request.POST.get('upperbound')
		try:
			upperbound = min(int(upperbound), len(susers))
		except:
			upperbound = len(susers)
		sample_ids = set(random.sample(ids, upperbound))
		# 修改is_sample
		susers = SUser.objects.filter(~Q(username='root'))
		for suser in susers:
			suser.is_sample = int(suser.id in sample_ids)
			suser.save()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

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
		username_list = json.loads(request.POST.get('username_list'))
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

def install(request):
	html = ''
	username = 'root'
	password = '123'
	user = auth.authenticate(username=username, password=password)
	if user is None:
		user = User.objects.create_user(username=username, password=password, is_superuser=1, is_staff=1)
		suser = SUser.objects.create(username=username, uid=user.id, is_sample=0)
		html += 'add ' + username + ' successful <br/>'
	else:
		html += ' already exists <br/>'
	return HttpResponse(html)