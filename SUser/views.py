# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse,HttpResponseRedirect
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
from SUser.models import SUser

def login(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('../index/')

	info = ''
	username = request.POST.get('username')
	password = request.POST.get('password')
	if username is not None and password is not None:
		user = auth.authenticate(username=username, password=password)
		if user is not None:
			auth.login(request, user)
			return HttpResponseRedirect('../index/')
		else:
			info = '用户名或密码错误'
	# if "student_id" in request.POST:
	# 	users = User.objects.filter(student_id=request.POST['student_id'])
	# 	if len(users) != 0:
	# 		user = users[0]
	# 		response = HttpResponseRedirect('../index/')
	# 		response.set_cookie('student_u_id', user.student_id + ' ' + str(user.id), 3600)
	# 		return response
	# 	else:
	# 		info = "用户名或密码错误"
	return render(request, 'login.html', {'info':info})

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect('../login/')

def index(request):
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	return render(request, 'index.html', {})