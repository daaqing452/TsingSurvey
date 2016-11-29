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

def index(request):
	# 验证登录
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')

	access_adminlist = False
	if request.user.is_superuser:
		access_adminlist = True

	access_userlist = False
	if request.user.is_staff:
		access_userlist = True

	return render(request, 'index.html', {			\
		'access_adminlist': access_adminlist,		\
		'access_userlist' : access_userlist,		\
		})

def login(request):
	# 如果已登录直接跳转
	if request.user.is_authenticated():
		return HttpResponseRedirect('../index/')

	# 提示信息
	info = ''
	login = False

	# 获取用户名密码
	username = request.POST.get('username')
	password = request.POST.get('password')

	if username is not None and password is not None:
		# 如果不是root进行清华验证
		if username != 'root':
			# 通过API判断是否清华用户
			if username == password:
				# 转换成SUser密码
				password = Utils.username_to_password(username)
				suser = SUser.objects.filter(student_id=username)
				# 是否首次登陆
				if len(suser) == 0:
					user = User.objects.create_user(username=username, password=password, is_superuser=0, is_staff=0)
					suser = SUser.objects.create(uid=user.id)
			else:
				password = ''
		# 验证
		users = User.objects.filter(username=username)
		if len(users) == 0:
			info = '用户名不存在'
		else:
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

def adminlist(request):
	# 验证登录
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	admin_list = User.objects.filter(is_staff=1).filter(~Q(username='root'))
	return render(request, 'adminlist.html', {'admin_list': admin_list})
