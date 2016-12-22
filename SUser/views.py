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

	# 问卷列表
	if user.is_staff:
		questionaire_list = Questionaire.objects.all()
	else:
		suser = SUser.objects.get(uid=request.user.id)
		qid_list = suser.qid_list.split(' ')
		questionaire_list = []
		for qid in qid_list:
			if qid == '':
				continue
			questionaires = Questionaire.objects.filter(id=int(qid))
			if len(questionaires) > 0:
				questionaire_list.append(questionaires[0])

	rdata['questionaire_list'] = questionaire_list
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

	def getSUserList():
		return [{'username': suser_raw.username, 'is_sample': suser_raw.is_sample} for suser_raw in SUser.objects.all()]

	# 加载
	if op == 'load':
		return HttpResponse(json.dumps({'user_list': getSUserList()}))

	# 设置为样本
	if op == 'sample_yes':
		username_list = eval(request.POST.get('username_list'))
		for username in username_list:
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				suser.is_sample = 1
				suser.save()
		return HttpResponse(json.dumps({'user_list': getSUserList()}))

	# 设置为非样本
	if op == 'sample_no':
		username_list = eval(request.POST.get('username_list'))
		for username in username_list:
			susers = SUser.objects.filter(username=username)
			if len(susers) > 0:
				suser = susers[0]
				suser.is_sample = 0
				suser.save()
		return HttpResponse(json.dumps({'user_list': getSUserList()}))

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
		return HttpResponse(json.dumps({'user_list': getSUserList()}))

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
		return HttpResponse(json.dumps({'result': result, 'user_list': getSUserList()}))

	rdata['user_list'] = getSUserList()
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

	def getAdminList():
		return [{'username': admin_raw.username} for admin_raw in User.objects.filter(is_staff=1).filter(~Q(username='root'))]

	# 加载
	if op == 'load':
		return HttpResponse(json.dumps({'admin_list': getAdminList()}));

	# 删除管理员
	if op == 'delete':
		username_list = eval(request.POST.get('username_list'))
		for username in username_list:
			users = User.objects.filter(username=username)
			if len(users) > 0:
				user = users[0]
				user.is_staff = 0
				user.save()
		return HttpResponse(json.dumps({'admin_list': getAdminList()}))

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
		return HttpResponse(json.dumps({'result': result, 'admin_list': getAdminList()}))
	
	rdata['admin_list'] = getAdminList()
	return render(request, 'admin_list.html', rdata)

def profile(request, uid):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if (not request.user.is_staff) and (str(request.user.id) != uid):
		return HttpResponseRedirect('/index/')
	rdata = {}
	rdata['uid'] = request.user.id
	rdata['username'] = request.user.username
	op = request.POST.get('op')

	return render(request, 'profile.html', rdata)