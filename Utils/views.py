# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from SUser.models import SUser

class Utils:
	ROOT_PASSWORD = '123'

	@staticmethod
	def username_to_password(username):
		return str((long(username) ^ 3968766407) % 104939997)

def check_and_create(username, password, is_superuser, is_staff):
	user = auth.authenticate(username=username, password=password)
	if user is None:
		user = User.objects.create_user(username=username, password=password, is_superuser=is_superuser, is_staff=is_staff)
		suser = SUser.objects.create(uid=user.id)
		return 'add ' + username + ' successful <br/>'
	else:
		return username + ' already exists <br/>'

def install(request):
	html = ''
	html += check_and_create('root', Utils.ROOT_PASSWORD, 1, 1)
	# html += check_and_create('admin', '123', 0, 1)
	# html += check_and_create('user0', '123', 0, 0)
	return HttpResponse(html)

def install_test(request):
	# User.objects.create_user(username='admin_t', password=123, is_superuser=0, is_staff=1)
	# user = User.objects.filter(username='root')[0]
	# SUser.objects.create(uid=user.id)
	return HttpResponse('hello')