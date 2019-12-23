# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import Q 
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from SUser.models import *
from SUser.auth_tsinghua import auth_tsinghua
from SUser.load_survey import load_survey
from Survey.models import *
import Analysis.views as Analysis
import SUser.utils as Utils
import codecs
import datetime
import json
import math
import random
import re
import time
import sys
import xlsxwriter
# reload(sys)
# sys.setdefaultencoding('utf-8')

def index(request):
	# 检查身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	
	rq_list = []
	if not suser.is_store:
		anweraire_queries = {answeraire.qid : answeraire.submitted for answeraire in Answeraire.objects.filter(username=suser.username)}
		for questionaire in Questionaire.objects.all():
			rq = None
			# 高级管理员
			if suser.admin_all:
				rq = Utils.remakeq(suser, questionaire, True, anweraire_queries)
				rq['filled_number'] = Answeraire.objects.filter(qid=questionaire.id).count()
				rq['submitted_number'] = Answeraire.objects.filter(qid=questionaire.id, submitted=True).count()
			# 问卷管理员：自己发的问卷
			elif suser.admin_survey and questionaire.founder == suser.username:
				rq = Utils.remakeq(suser, questionaire, True, anweraire_queries)
			# 普通用户：被允许填的问卷，正在开放填写已经填写
			elif Utils.check_allow(suser, questionaire):
				if (questionaire.status == 1) or (questionaire.status in [2,3] and Utils.check_fill2(anweraire_queries, questionaire.id) > 1):
					rq = Utils.remakeq(suser, questionaire, False, anweraire_queries)
			if rq == None: continue
			rq_list.append(rq)
	
	# 导入问卷
	f = request.FILES.get('upload', None)
	if not f is None:
		filepath = Utils.upload_file(f)
		qstring = load_survey(filepath)
		now = datetime.datetime.now()
		questionaire = Questionaire.objects.create(status=0, create_time=now, update_time=now, founder=suser.username, questions=qstring)
		return HttpResponseRedirect('/survey/' + str(questionaire.id) + '/')

	def cmp_by_time(x):
		return x['create_time']

	rq_list.sort(key=lambda x: x['create_time'], reverse=True)
	rdata['rq_list'] = rq_list
	rdata['editable'] = suser.admin_all or suser.admin_survey
	return render(request, 'index.html', rdata)

@csrf_exempt
def login(request):
	rdata, op, suser = Utils.get_request_basis(request)
	if request.user.is_authenticated and op == '':
		return HttpResponseRedirect('/index/')
	login = False

	username = request.POST.get('username')
	password = request.POST.get('password')

	if username is not None and password is not None:
		password = Utils.uglyDecrypt(password)

		# 判断是否存在
		susers = SUser.objects.filter(username=username)
		existed = (len(susers) > 0)

		# 判断是否是清华账号
		if username.isdigit() and len(username) == 10:
			if not existed:
				existed = True
				if username == password:
					user = User.objects.create_user(username=username, password=password)
					suser = SUser.objects.create(uid=user.id, username=username, nickname=username)

		if existed:
			# 验证
			user = auth.authenticate(username=username, password=password)
			if user is not None:
				auth.login(request, user)
				login = True
			else:
				rdata['info'] = '密码错误'
		else:
			rdata['info'] = '用户名不存在'

	if op == 'get_magic_number':
		return HttpResponse(json.dumps({'magic_number': Utils.MAGIC_NUMBER}))

	if login:
		url = '/index/'
		if 'last_url' in request.session:
			url = request.session['last_url']
		return HttpResponseRedirect(url)
	else:
		return render(request, 'login.html', rdata)

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect('/login/')

def user_list(request):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if not suser.admin_all:
		return render(request, 'permission_denied.html', {})

	ITEM_PER_PAGE = 50
	lis = request.GET.get('list', 'all')
	page_n = int(request.GET.get('page', 1))

	def get_suser_list():
		susers = []
		if lis == 'all':
			susers = SUser.objects.order_by('id')
		elif lis == 'sample':
			susers = SUser.objects.filter(is_sample=True).order_by('id')
		elif lis[0] == 'q':
			susers = SUser.objects.filter(username=lis[1:])
		else:
			pass
		n_susers = len(susers)
		rdata['page_current'] = page_n
		rdata['page_max'] = (n_susers - 1) / ITEM_PER_PAGE + 1
		page_s = (page_n - 1) * ITEM_PER_PAGE
		page_t = min(page_s + ITEM_PER_PAGE, n_susers)
		return [{'uid': suser.uid, 'username': suser.username, 'name': suser.name, 'is_sample': suser.is_sample, 'credit': suser.credit} for suser in susers[page_s:page_t] ]

	# 导入
	if op == 'load':
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 删除用户
	if op == 'delete':
		username_list = json.loads(request.POST.get('username_list'))
		for username in username_list:
			if username == 'root': continue
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				uid = suser.uid
				users = User.objects.filter(id=uid)
				if len(users) > 0:
					user = users[0]
					user.delete()
				suser.delete()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 删除所有用户
	if op == 'delete_all':
		susers = SUser.objects.filter(~Q(username='root'))
		for suser in susers:
			uid = suser.uid
			users = User.objects.filter(id=uid)
			if len(users) > 0:
				user = users[0]
				user.delete()
			suser.delete()
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 添加用户
	if op == 'add_new_user':
		username = request.POST.get('username')
		# 检查username
		susers = SUser.objects.filter(username=username)
		if len(susers) > 0:
			result = '用户名已存在'
		else:
			password = Utils.hash_md5(username)
			user = User.objects.create_user(username=username, password=password)
			suser = SUser.objects.create(uid=user.id, username=username, nickname=username)
			result = 'yes'
		return HttpResponse(json.dumps({'result': result, 'user_list': get_suser_list()}))

	# 修改积分
	if op == 'change_credit':
		username = request.POST.get('username')
		credit = request.POST.get('credit')
		suser = SUser.objects.get(username=username)
		suser.credit = credit
		suser.save()
		return HttpResponse(json.dumps({}))

	# 导入用户名单
	f = request.FILES.get('upload', None)
	if not f is None:
		f_path = Utils.upload_file(f)
		# 读入每一行
		f = codecs.open(f_path, 'r', 'gbk')
		# f = open(f_path, 'r', encoding='gbk')
		line_no = -1
		while True:
			line_no += 1
			try:
				line = f.readline()
			except:
				print(line_no, 'ignore')
				continue
			if len(line) == 0: break
			if line_no == 0: continue
			if line[-2:] == '\r\n': line = line[:-2]
			# a = line.split(',')
			a = []
			s = ''
			inquote = False
			for i in range(len(line)):
				c = line[i]
				if c == '\"':
					if i > 0 and line[i - 1] == '\"': s += '\"'
					inquote = not inquote
				elif c == ',' and not inquote:
					a.append(s)
					s = ''
				else:
					s += c
			a.append(s)
			print(line_no)
			username = a[0]
			users = User.objects.filter(username=username)
			if len(users) > 0:
				# 修改用户信息
				suser = SUser.objects.filter(username=username).update(name=a[1], name_english=a[2], student_type_code=a[3], student_type=a[4], gender_code=a[5], gender=a[6], birthday=a[7], ethnic_code=a[8], ethnic=a[9], nationality_code=a[10], nationality=a[11], political_status_code=a[12], political_status=a[13], certificate_type_code=a[14], certificate_type=a[15], certificate_number=a[16], marital_status_code=a[17], marital_status=a[18], original_education_code=a[19], original_education=a[20], bachelor_school=a[21], bachelor_school_code=a[22], bachelor_major=a[23], bachelor_major_code=a[24], bachelor_graduate_time=a[25], master_school=a[26], master_school_code=a[27], master_major=a[28], master_major_code=a[29], master_graduate_time=a[30], master_degree_date=a[31], department_number=a[32], department=a[33], secondary_subject_code=a[34], secondary_subject=a[35], advisor_certificate_number=a[36], enrollment_time=a[37], scheme_time=a[38], enrollment_mode_code=a[39], enrollment_mode=a[40], admission_type_code=a[41], admission_type=a[42], targeted_area_type_code=a[43], targeted_area_type=a[44], student_source_code=a[45], student_source=a[46], examination_ticket_number=a[47], bachelor_student_number=a[48], master_student_number=a[49], origin_place_code=a[50], origin_place=a[51], dormitory_address=a[52], dormitory_telephone=a[53], original_unit=a[54], client_unit=a[55], email=a[56], if_bed=a[57], if_socialized_madicine=a[58], if_resident_migration=a[59], if_internal_school_roll=a[60], if_national_school_roll=a[61], if_school_roll_abnormity=a[62], if_international_student=a[63], estimated_graduate_date=a[64], defense_date=a[65], completion_date=a[66], if_graduate=a[67], completion_mode_code=a[68], completion_mode=a[69], graduate_certificate_number=a[70], degree_confer_date=a[71], degree_confer_mode_code=a[72], degree_confer_mode=a[73], training_type_code=a[74], training_type=a[75], training_direction_code=a[76], training_direction=a[77], disciplines_field_code=a[78], disciplines_field=a[79], major_code=a[80], major=a[81], diploma_number=a[82], school_roll_status_code=a[83], campus_code=a[84], campus=a[85], remark=a[86], advisor_name=a[87], special_condition_code=a[88], special_condition=a[89], if_primary_subject=a[90], origin_province_code=a[91], origin_province=a[92], origin_city_code=a[93], origin_city=a[94], address_province_code=a[95], address_province=a[96], client_unit_city_code=a[97], client_unit_city=a[98], original_student_number=a[99], abnormity_type_code=a[100], abnormity_type=a[101], alteration_date=a[102])
			else:
				# 新建用户信息
				password = username
				user = User.objects.create_user(username=username, password=password)
				suser = SUser.objects.create(uid=user.id, username=a[0], nickname=a[0], name=a[1], name_english=a[2], student_type_code=a[3], student_type=a[4], gender_code=a[5], gender=a[6], birthday=a[7], ethnic_code=a[8], ethnic=a[9], nationality_code=a[10], nationality=a[11], political_status_code=a[12], political_status=a[13], certificate_type_code=a[14], certificate_type=a[15], certificate_number=a[16], marital_status_code=a[17], marital_status=a[18], original_education_code=a[19], original_education=a[20], bachelor_school=a[21], bachelor_school_code=a[22], bachelor_major=a[23], bachelor_major_code=a[24], bachelor_graduate_time=a[25], master_school=a[26], master_school_code=a[27], master_major=a[28], master_major_code=a[29], master_graduate_time=a[30], master_degree_date=a[31], department_number=a[32], department=a[33], secondary_subject_code=a[34], secondary_subject=a[35], advisor_certificate_number=a[36], enrollment_time=a[37], scheme_time=a[38], enrollment_mode_code=a[39], enrollment_mode=a[40], admission_type_code=a[41], admission_type=a[42], targeted_area_type_code=a[43], targeted_area_type=a[44], student_source_code=a[45], student_source=a[46], examination_ticket_number=a[47], bachelor_student_number=a[48], master_student_number=a[49], origin_place_code=a[50], origin_place=a[51], dormitory_address=a[52], dormitory_telephone=a[53], original_unit=a[54], client_unit=a[55], email=a[56], if_bed=a[57], if_socialized_madicine=a[58], if_resident_migration=a[59], if_internal_school_roll=a[60], if_national_school_roll=a[61], if_school_roll_abnormity=a[62], if_international_student=a[63], estimated_graduate_date=a[64], defense_date=a[65], completion_date=a[66], if_graduate=a[67], completion_mode_code=a[68], completion_mode=a[69], graduate_certificate_number=a[70], degree_confer_date=a[71], degree_confer_mode_code=a[72], degree_confer_mode=a[73], training_type_code=a[74], training_type=a[75], training_direction_code=a[76], training_direction=a[77], disciplines_field_code=a[78], disciplines_field=a[79], major_code=a[80], major=a[81], diploma_number=a[82], school_roll_status_code=a[83], campus_code=a[84], campus=a[85], remark=a[86], advisor_name=a[87], special_condition_code=a[88], special_condition=a[89], if_primary_subject=a[90], origin_province_code=a[91], origin_province=a[92], origin_city_code=a[93], origin_city=a[94], address_province_code=a[95], address_province=a[96], client_unit_city_code=a[97], client_unit_city=a[98], original_student_number=a[99], abnormity_type_code=a[100], abnormity_type=a[101], alteration_date=a[102])
		f.close()
	
	# 导出用户名单
	if op == 'export':
		size = request.POST.get('size')
		if size == 'all':
			susers = SUser.objects.all()
		elif size == 'sample':
			susers = SUser.objects.filter(is_sample=True)
		else:
			susers = []
		excel_name = Utils.export_user_list(susers)
		return HttpResponse(json.dumps({'export_path': excel_name}))

	get_suser_list()
	return render(request, 'user_list.html', rdata)


temp = False
l = {}

def sample_list(request):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if not suser.admin_all and not suser.admin_survey:
		return render(request, 'permission_denied.html', {})

	sample_list_id = int(request.GET.get('samplelist', -1))
	page_n = int(request.GET.get('page', 1))

	global temp
	global l
	if not temp:
		if sample_list_id == -1:
			l = {}
		else:
			sample_list = SampleList.objects.get(id=sample_list_id)
			l = set(json.loads(sample_list.sample_list))

	print(temp, l)

	def get_suser_list():
		ITEM_PER_PAGE = 50
		susers = SUser.objects.order_by('id')
		n_susers = len(susers)
		page_s = (page_n - 1) * ITEM_PER_PAGE
		page_t = min(page_s + ITEM_PER_PAGE, n_susers)
		rdata['page_current'] = page_n
		rdata['page_max'] = (n_susers - 1) / ITEM_PER_PAGE + 1
		return [{'uid': suser.id, 'username': suser.username, 'name': suser.name, 'is_sample': suser.username in l, 'credit': suser.credit} for suser in susers[page_s:page_t] ]

	# 加载
	if op == 'load':
		jdata = {}
		jdata['user_list'] = get_suser_list()
		jdata['sample_lists'] = sample_lists = [{'id': sample_list.id, 'name': sample_list.name} for sample_list in SampleList.objects.all()]
		jdata['sample_list_id'] = sample_list_id
		jdata['sample_list_size'] = len(l)
		# gender, student_type, department, policical_status, enrollment_mode
		show_statistic_option_ids = [6, 4, 33, 13, 40]
		jdata['show_statistic_options'] = [[SUser.__var_name__[i], SUser.__var_chinese__[i]] for i in show_statistic_option_ids]
		return HttpResponse(json.dumps(jdata))

	# 更改样本列表
	if op == 'change_sample_list':
		temp = False
		return HttpResponse({})

	# 新建用户列表
	if op == 'new_sample_list':
		name = request.POST.get('sample_list_name', '')
		if name == '': name = time.strftime('%Y%m%d%H%M%S')
		sample_list = SampleList.objects.create(name=name, sample_list='[]')
		return HttpResponse(json.dumps({'id': sample_list.id, 'name': sample_list.name}))

	# 保存样本列表
	if op == 'save_sample_list':
		jdata = {}
		sample_lists = SampleList.objects.filter(id=sample_list_id)
		if len(sample_lists) == 0:
			jdata['info'] = '没有找到此样本列表'
		else:
			sample_list = sample_lists[0]
			sample_list.sample_list = json.dumps(list(l))
			sample_list.save()
			jdata['info'] = '保存成功'
		return HttpResponse(json.dumps(jdata))

	# 导出样本列表
	if op == 'export_sample_list':
		jdata = {}
		try:
			sample_list = SampleList.objects.get(id=sample_list_id)
			suser_usernames = json.loads(sample_list.sample_list)
			print(suser_usernames)
			susers = [SUser.objects.get(username=suser_username) for suser_username in suser_usernames]
			excel_name = Utils.export_user_list(susers)
			jdata['info'] = '导出成功'
			jdata['export_path'] = excel_name
		except Exception as e:
			print(e)
			jdata['info'] = '导出错误'
		return HttpResponse(json.dumps(jdata))

	# 删除样本列表
	if op == 'delete_sample_list':
		SampleList.objects.filter(id=sample_list_id).delete()
		return HttpResponse(json.dumps({'info': '删除成功'}))

	# 设置为样本
	if op == 'sample_yes':
		temp = True
		usernames = json.loads(request.POST.get('usernames'))
		for username in usernames:
			l.add(username)
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 设置为非样本
	if op == 'sample_no':
		temp = True
		usernames = json.loads(request.POST.get('usernames'))
		for username in usernames:
			if username in l:
				l.remove(username)
		return HttpResponse(json.dumps({'user_list': get_suser_list()}))

	# 显示样本统计
	if op == 'show_statistic':
		jdata = {}
		try:
			field = request.POST.get('field')
			susers = [SUser.objects.get(username=username) for username in l]
			cnt = {}
			for suser in susers:
				key = eval('suser.' + field)
				if not key in cnt: cnt[key] = 0
				cnt[key] += 1
			s = ''
			length = max(sum([cnt[key] for key in cnt]), 1)
			for key in cnt:
				value = cnt[key]
				s += key + ': ' + str(value) + ' (' + str(int(value/length*100)) + '%)\n'
			jdata['res'] = s
		except Exception as e:
			print(e)
			jdata['res'] = '错误'
		return HttpResponse(json.dumps(jdata))

	'''# 自动样本生成
	if op == 'auto_sample':
		# 构造命令
		constraints = json.loads(request.POST.get('constraints'))
		upperbound = request.POST.get('upperbound')
		if upperbound == '': upperbound = 100
		upperbound = float(upperbound) / 100.0
		susers = SUser.objects.filter(~Q(username='root'))
		cnt = {}
		for i in range(len(susers)):
			suser = susers[i]
			suser.is_sample = False
			suser.save()
			tag = ''
			for constraint in constraints:
				tag += eval('suser.' + SUser.__var_name__[int(constraint)]) + '&'
			if not tag in cnt: cnt[tag] = []
			cnt[tag].append(i)
		# 采样
		sampled_susers = []
		for tag in cnt:
			arr = cnt[tag]
			nn = int(math.ceil(len(arr) * upperbound))
			sampled = random.sample(arr, nn)
			for sampled_idx in sampled:
				suser = susers[sampled_idx]
				suser.is_sample = True
				suser.save()
		return HttpResponse(json.dumps({}))'''
	
	return render(request, 'sample_list.html', rdata)

def admin_list(request):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if not suser.admin_super:
		return render(request, 'permission_denied.html', {})

	def get_admin_list():
		admin_list = []
		for admin in SUser.objects.filter(Q(admin_all=1) | Q(admin_survey=1)).filter(~Q(username='root')):
			admin_list.append({'uid': admin.id, 'username': admin.username, 'name': admin.name, 'admin_all': admin.admin_all, 'admin_survey': admin.admin_survey})
		return admin_list

	# 加载
	if op == 'load':
		return HttpResponse(json.dumps({'admin_list': get_admin_list()}));

	# 修改管理员状态
	if op == 'add':
		username = request.POST.get('username')
		level = request.POST.get('level')
		value = int(request.POST.get('value'))
		if level == 'chief':
			susers = SUser.objects.filter(username=username)
			susers.update(admin_all=value)
			ulen = len(susers)
		elif level == 'survey':
			susers = SUser.objects.filter(username=username)
			susers.update(admin_survey=value)
			ulen = len(susers)
		return HttpResponse(json.dumps({'ulen': ulen, 'admin_list': get_admin_list()}))
	
	rdata['admin_list'] = get_admin_list()
	return render(request, 'admin_list.html', rdata)

def profile(request, uid):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if (not suser.admin_all) and (int(suser.id) != int(uid)):
		return render(request, 'permission_denied.html', {})
	rdata['psuser'] = psuser = SUser.objects.get(id=uid)
	puser = User.objects.get(id=psuser.uid)

	if op == 'change_nickname':
		psuser.nickname = request.POST.get('nickname')
		psuser.save()
		return HttpResponse(json.dumps({}))

	if op == 'change_password':
		old_password = Utils.uglyDecrypt(request.POST.get('old_password'))
		new_password = Utils.uglyDecrypt(request.POST.get('new_password'))
		puser2 = auth.authenticate(username=puser.username, password=old_password)
		jdata = {}
		if puser2 is not None and puser2 == puser and puser2.is_active:
			puser.set_password(new_password)
			puser.save()
			jdata['result'] = 'yes'
			return HttpResponse(json.dumps(jdata))
		else:
			jdata['result'] = 'no'
			return HttpResponse(json.dumps(jdata))

	rq_list = []
	anweraire_queries = {answeraire.qid : answeraire.submitted for answeraire in Answeraire.objects.filter(username=suser.username)}
	for questionaire in Questionaire.objects.all():
		if questionaire.status in [1,2,3] and Utils.check_fill2(anweraire_queries, questionaire.id) in [2,3]:
			rq_list.append(Utils.remakeq(suser, questionaire, False, anweraire_queries))
	
	rq_list.sort(key=lambda x: x['create_time'], reverse=True)
	rdata['rq_list'] = rq_list

	return render(request, 'profile.html', rdata)

def backend_admin(request):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if suser.username != 'root':
		return render(request, 'permission_denied.html', {})

	if op == 'export_multi':
		qids = json.loads(request.POST.get('qids'))
		excel_name = Analysis.export_multi(qids)
		return HttpResponse(json.dumps({'result': 'yes', 'export_path': excel_name}))

	if op == 'del_ans':
		cnt_del_ans = 0
		for answeraire in Answeraire.objects.all():
			questionaires = Questionaire.objects.filter(id=answeraire.qid)
			if len(questionaires) == 0:
				answeraire.delete()
				cnt_del_ans += 1
		cnt_del_rep = 0
		for report in Report.objects.all():
			questionaires = Questionaire.objects.filter(id=report.qid)
			if len(questionaires) == 0:
				report.delete()
				cnt_del_rep += 1
		return HttpResponse(json.dumps({'cnt_del_ans': cnt_del_ans, 'cnt_del_rep': cnt_del_rep}))

	if op == 'del_tsinghua':
		cnt_del_tsinghua = 0
		for suser in SUser.objects.all():
			username = suser.username
			if username.isdigit() and len(username) == 10:
				User.objects.filter(username=username).delete()
				suser.delete()
				cnt_del_tsinghua += 1
		for user in User.objects.all():
			username = user.username
			if username.isdigit() and len(username) == 10:
				SUser.objects.filter(username=username).delete()
				user.delete()
				cnt_del_tsinghua += 1
		return HttpResponse(json.dumps({'cnt_del_tsinghua': cnt_del_tsinghua}))

	return render(request, 'backend_admin.html', {})
