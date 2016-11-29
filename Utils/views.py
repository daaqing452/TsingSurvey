# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render

def check_and_create(username, password, is_superuser):
	user = auth.authenticate(username=username, password=password)
	if user is None:
		User.objects.create_user(username=username, password=password, is_superuser=is_superuser)
		return 'add ' + username + ' successful <br/>'
	else:
		return username + ' already exists <br/>'

def install(request):
	html = ''
	html += check_and_create('admin', '123', 1)
	html += check_and_create('user0', '123', 0)
	return HttpResponse(html)