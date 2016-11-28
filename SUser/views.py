# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse,HttpResponseRedirect
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
from SUser.models import SUser

def login(request):
	info = ""
	# if "student_id" in request.POST:
	# 	users = User.objects.filter(student_id=request.POST['student_id'])
	# 	if len(users) != 0:
	# 		user = users[0]
	# 		response = HttpResponseRedirect('../index/')
	# 		response.set_cookie('student_u_id', user.student_id + ' ' + str(user.id), 3600)
	# 		return response
	# 	else:
	# 		info = "用户名或密码错误"
	return render(request, "login.html", {'info':info})

def index(request):
	return render(request, 'index.html', {})