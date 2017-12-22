# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import Q 
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from SUser.models import SUser, SampleList
from SUser.auth_tsinghua import auth_tsinghua
from Survey.models import Questionaire, Answeraire
import SUser.utils as Utils
import codecs
import json
import math
import random
import time
import sys
import xlsxwriter
# reload(sys)
# sys.setdefaultencoding('utf-8')

def index(request):
	rdata, op, suser = Utils.get_request_basis(request)

	# 检查身份
	if not rdata['login']:
		return Utils.redirect_login(request)

	user =request.user
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
		for questionaire in Questionaire.objects.filter(public=True):
			if str(questionaire.id) in qid_dict: continue
			rq_list.append(Utils.remake_questionaire(questionaire, qid_dict))

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
		'''users = User.objects.filter(username=username)
		if len(users) == 0:
			rdata['info'] = '用户名不存在'
		else:'''
		if True:
			# 如果是清华账号进行清华验证
			if username.isdigit() and len(username) == 10:
				yes = auth_tsinghua(request, username, password)
				if yes:
					password = Utils.username_to_password(username)
					users = User.objects.filter(username=username)
					# 新用户
					if len(users) == 0:
						user = User.objects.create_user(username=username, password=password)
						suser = SUser.objects.create(uid=user.id, username=username, nickname=username)
				else:
					password = ''
			
			# 验证
			user = auth.authenticate(username=username, password=password)
			if user is not None:
				auth.login(request, user)
				login = True
			else:
				rdata['info'] = '密码错误'

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
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	if not request.user.is_staff:
		return render(request, 'permission_denied.html', {})
	rdata = {}
	rdata['user'] = user = request.user
	op = request.POST.get('op')

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
		page_s = (page_n - 1) * ITEM_PER_PAGE
		page_t = min(page_s + ITEM_PER_PAGE, n_susers)
		rdata['page_current'] = page_n
		rdata['page_max'] = (n_susers - 1) / ITEM_PER_PAGE + 1
		return [{'uid': suser.uid, 'username': suser.username, 'name': suser.name, 'is_sample': suser.is_sample, 'credit': suser.credit} for suser in susers[page_s:page_t] ]

	def get_statistic(susers):
		fields = [6, 4, 33, 13]
		cnt = {}
		for suser in susers:
			for field in fields:
				key = SUser.__var_chinese__[field]
				if not key in cnt: cnt[key] = {}
				value = eval('suser.' + SUser.__var_name__[field])
				if not value in cnt[key]: cnt[key][value] = 0
				cnt[key][value] += 1
		return cnt

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
			password = Utils.username_to_password(username)
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
				password = Utils.username_to_password(username)
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
		n_susers = len(susers)
		excel_name = 'media/' + time.strftime('%Y%m%d%H%M%S') + '-用户名单.xlsx'
		excel = xlsxwriter.Workbook(excel_name)
		sheet1 = excel.add_worksheet('工作表1')
		sheet2 = excel.add_worksheet('工作表2')
		# 用户列表
		sheet1.write(0, 0, '是否为样本')
		for i in range(len(SUser.__var_chinese__)):
			sheet1.write(0, i + 1, SUser.__var_chinese__[i])
		row = 1
		for row in range(n_susers):
			suser = susers[row]
			if suser.username == 'root': continue
			sheet1.write(row, 0, suser.is_sample)
			for i in range(len(SUser.__var_name__)):
				s = 'sheet1.write(row, ' + str(i + 1) + ', suser.' + SUser.__var_name__[i] + ')'
				eval(s)
			row += 1
		# 统计用户列表
		cnt = get_statistic(susers)
		row = 0
		for key in cnt:
			sheet2.write(row, 0, key)
			col = 1
			for value in cnt[key]:
				sheet2.write(row + 1, col, value)
				sheet2.write(row + 2, col, cnt[key][value])
				sheet2.write(row + 3, col, str(round(100.0 * cnt[key][value] / n_susers, 1)) + '%')
				col += 1
			row += 5
		excel.close()
		return HttpResponse(json.dumps({'export_path': excel_name}))

	# 获得用户字段
	if op == 'get_field_chinese':
		return HttpResponse(json.dumps({'options': SUser.__var_chinese__}))

	# 自动样本生成
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
		return HttpResponse(json.dumps({}))
	
	# 显示样本统计
	if op == 'show_statistic':
		susers = SUser.objects.filter(~Q(username='root')).filter(is_sample=True)
		cnt = get_statistic(susers)
		return HttpResponse(json.dumps({'statistic': cnt, 'n_susers': len(susers)}))

	# 保存样本列表
	if op == 'save_sample_list':
		name = request.POST.get('sample_list_name', '')
		if name == '': name = time.strftime('%Y%m%d%H%M%S')
		suser_id_list = [suser.id for suser in SUser.objects.filter(is_sample=True)]
		SampleList.objects.create(name=name, sample_list=suser_id_list)
		return HttpResponse(json.dumps({}))

	rdata['user_list'] = get_suser_list()
	return render(request, 'user_list.html', rdata)

def admin_list(request):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	if not request.user.is_superuser:
		return render(request, 'permission_denied.html', {})
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
		return Utils.redirect_login(request)
	if (not request.user.is_staff) and (str(request.user.id) != uid):
		return render(request, 'permission_denied.html', {})
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
	for questionaire in Questionaire.objects.filter(public=True):
		if str(questionaire.id) in qid_dict: continue
		rq_list.append(Utils.remake_questionaire(questionaire, qid_dict))
	rdata['rq_list'] = rq_list

	return render(request, 'profile.html', rdata)

def install(request):
	username = 'root'
	password = '123'
	user = auth.authenticate(username=username, password=password)
	if user is None:
		user = User.objects.create_user(username=username, password=password, is_superuser=1, is_staff=1)
		suser = SUser.objects.create(username=username, nickname=username, uid=user.id, is_sample=0)
		html += 'add ' + username + ' successful <br/>'
	else:
		html += ' already exists <br/>'
	return HttpResponse(html)
