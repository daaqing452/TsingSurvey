# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from SUser.models import SUser
from Survey.models import Questionaire, Question

class Utils:
	ROOT_PASSWORD = '123'
	@staticmethod
	def username_to_password(username):
		return str((hash(username) ^ 3968766407) % 104939997)

	@staticmethod
	def remake_questionaire(questionaire, qid_dict):
		d = {}
		d['id'] = questionaire.id
		
		if questionaire.title == '':
			d['title'] = '（无标题）'
		else:
			d['title'] = questionaire.title

		if not str(questionaire.id) in qid_dict:
			d['fill'] = ''
		elif qid_dict[str(questionaire.id)] == 0:
			d['fill'] = '未填写'
		else:
			d['fill'] = '已填写'
		
		if questionaire.status == 0:
			d['status'] = '尚未发布'
		elif questionaire.status == 1:
			d['status'] = '已发布'
		elif questionaire.status == 2:
			d['status'] = '结束'
		elif questionaire.status == 3:
			d['status'] = '已生成报告'
		else:
			d['status'] = '错误'
		
		return d



def add_user(username, password, is_superuser, is_staff):
	user = auth.authenticate(username=username, password=password)
	if user is None:
		user = User.objects.create_user(username=username, password=password, is_superuser=is_superuser, is_staff=is_staff)
		suser = SUser.objects.create(username=username, uid=user.id)
		return 'add ' + username + ' successful <br/>'
	else:
		return username + ' already exists <br/>'

def install(request):
	html = ''
	html += add_user('root', Utils.ROOT_PASSWORD, 1, 1)
	# html += add_user('admin', '123', 0, 1)
	# html += add_user('user', '123', 0, 0)
	return HttpResponse(html)