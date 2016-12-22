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
import json

def index(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	rdata = {}
	rdata['user'] = user = request.user
	
	def remake_questionaire(questionaire, qid_dict):
		r = {}
		r['id'] = questionaire.id
		
		if questionaire.title == '':
			r['title'] = '（无标题）'
		else:
			r['title'] = questionaire.title

		if not str(questionaire.id) in qid_dict:
			r['fill'] = ''
		elif qid_dict[str(questionaire.id)] == 0:
			r['fill'] = '未填写'
		else:
			r['fill'] = '已填写'
		
		if questionaire.status == 0:
			r['status'] = '尚未发布'
		elif questionaire.status == 1:
			r['status'] = '已发布'
		elif questionaire.status == 2:
			r['status'] = '结束'
		elif questionaire.status == 3:
			r['status'] = '已生成报告'
		else:
			r['status'] = '错误'
		
		return r

	# 问卷列表
	suser = SUser.objects.get(uid=request.user.id)
	qid_dict = json.loads(suser.qid_list)

	if user.is_staff:
		questionaire_list = Questionaire.objects.all()
		rq_list = [remake_questionaire(questionaire, qid_dict) for questionaire in questionaire_list]
	else:
		rq_list = []
		for qid in qid_dict:
			questionaires = Questionaire.objects.filter(id=int(qid))
			if len(questionaires) > 0:
				rq_list.append(remake_questionaire(questionaires[0], qid_dict))

	rdata['questionaire_list'] = rq_list
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
			rdata['info'] = '用户名不存在'
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
				rdata['info'] = '密码错误'

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
	rdata['uid'] = request.user.id
	op = request.POST.get('op')

	def get_suser_list():
		return [{'uid': suser_raw.uid, 'username': suser_raw.username, 'is_sample': suser_raw.is_sample} for suser_raw in SUser.objects.all()]

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
			result = '用户已存在'
		else:
			password = Utils.username_to_password(username)
			user = User.objects.create_user(username=username, password=password)
			suser = SUser.objects.create(uid=user.id, username=username)
			result = 'yes'
		return HttpResponse(json.dumps({'result': result, 'user_list': get_suser_list()}))

	rdata['user_list'] = get_suser_list()
	return render(request, 'user_list.html', rdata)

def admin_list(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if not request.user.is_superuser:
		return HttpResponseRedirect('/index/')
	rdata = {}
	rdata['uid'] = request.user.id
	op = request.POST.get('op')

	def get_admin_list():
		return [{'uid': admin_raw.id, 'username': admin_raw.username} for admin_raw in User.objects.filter(is_staff=1).filter(~Q(username='root'))]

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
	rdata['uid'] = uid
	rdata['user'] = user = User.objects.get(id=uid)
	rdata['suser'] = suser = SUser.objects.get(uid=user.id)
	op = request.POST.get('op')

	qid_dict = json.loads(suser.qid_list)
	rq_list = []
	for qid in qid_dict:
		questionaires = Questionaire.objects.filter(id=qid)
		if len(questionaires) > 0:
			questionaire = questionaires[0]
			rq_list.append({'questionaire': questionaire, 'fill': qid_dict[qid]})
	rdata['rq_list'] = rq_list

	return render(request, 'profile.html', rdata)