# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
from User.models import User

# @csrf_protect
def login(request):
	info = ""
	if "student_id" in request.POST:
		u = User.objects.filter(student_id=request.POST['student_id'])
		if len(u) != 0:
			info = "success"
		else:
			info = "用户名或密码错误"
	return render(request, "login.html", {'info':info})