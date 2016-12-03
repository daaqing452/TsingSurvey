# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import Q 
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from SUser.models import SUser
from Utils.views import Utils
import json

def index(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')

	access_adminlist = False
	if request.user.is_superuser:
		access_adminlist = True

	access_userlist = False
	if request.user.is_staff:
		access_userlist = True

	return render(request, 'index.html', {			\
		'username'        : request.user.username,	\
		'access_adminlist': access_adminlist,		\
		'access_userlist' : access_userlist,		\
		})

def login(request):
	# 如果已登录直接跳转
	if request.user.is_authenticated():
		return HttpResponseRedirect('../index/')
	info = ''
	login = False

	# 获取用户名密码
	username = request.POST.get('username')
	password = request.POST.get('password')

	if username is not None and password is not None:
		users = User.objects.filter(username=username)
		if len(users) == 0:
			info = '用户名不存在'
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
				info = '密码错误'

	if login:
		return HttpResponseRedirect('../index/')
	else:
		return render(request, 'login.html', {'info': info})

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect('../login/')

def userlist(request):
	# 验证身份
	if not request.user.is_authenticated() or not request.user.is_staff:
		return HttpResponseRedirect('../login/')
	info = ''

	# 添加用户
	username = request.POST.get('username')
	if username is not None:
		# 检查username
		suser_list = SUser.objects.filter(username=username)
		if len(suser_list) > 0:
			info = '用户已存在'
		else:
			password = Utils.username_to_password(username)
			user = User.objects.create_user(username=username, password=password)
			suser = SUser.objects.create(uid=user.id, username=username)
			info = '添加 ' + username + ' 成功'

	# 取出列表
	suser_list = SUser.objects.order_by("uid")

	return render(request, 'userlist.html', {'suser_list': suser_list, 'info': info})

def adminlist(request):
	# 验证身份
	if not request.user.is_authenticated() or not request.user.is_superuser:
		return HttpResponseRedirect('../login/')
	info = ''
	op = request.POST.get('op')

	# 删除管理员
	if op == 'delete':
		username = request.POST.get('username')
		user_list = User.objects.filter(username=username)
		if len(user_list) > 0:
			user = user_list[0]
			user.is_staff = 0
			user.save()
			return HttpResponse(json.dumps({'result': 'yes'}))
		else:
			return HttpResponse(json.dumps({'result': 'no'}))

	# 添加管理员
	if op == 'add':
		username = request.POST.get('username')
		user_list = User.objects.filter(username=username)
		if len(user_list) > 0:
			user = user_list[0]
			user.is_staff = 1
			user.save()
			return HttpResponse(json.dumps({'result': 'yes'}))
		else:
			return HttpResponse(json.dumps({'result': 'no'}))

	# 取出列表
	admin_list = User.objects.filter(is_staff=1).filter(~Q(username='root'))
	return render(request, 'adminlist.html', {'admin_list': admin_list})
