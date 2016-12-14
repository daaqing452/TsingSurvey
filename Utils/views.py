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

def add_user(username, password, is_superuser, is_staff):
	user = auth.authenticate(username=username, password=password)
	if user is None:
		user = User.objects.create_user(username=username, password=password, is_superuser=is_superuser, is_staff=is_staff)
		suser = SUser.objects.create(username=username, uid=user.id)
		return 'add ' + username + ' successful <br/>'
	else:
		return username + ' already exists <br/>'

def add_questionaire(title, question_list):
	questionaire = Questionaire.objects.filter(title=title)
	if len(questionaire) > 0:
		return title + ' already exists <br/>'
	questionaire = Questionaire.objects.create(title=title, founder=-1)
	question_list_str = ''
	for qtype, content in question_list:
		question = Question.objects.create(qid=questionaire.id, qtype=qtype, content=content)
		question_list_str += str(question.id) + ' '
	questionaire.question_list = question_list_str[:-1]
	questionaire.save()
	return 'add ' + title + ' successful <br/>'

def install(request):
	html = ''
	html += add_user('root', Utils.ROOT_PASSWORD, 1, 1)
	# html += add_user('admin', '123', 0, 1)
	# html += add_user('user', '123', 0, 0)
	html += add_questionaire('qq1', [(0,'123'), (3,'abc')])
	return HttpResponse(html)

def install_test(request):
	# User.objects.create_user(username='admin_t', password=123, is_superuser=0, is_staff=1)
	# user = User.objects.filter(username='root')[0]
	# SUser.objects.create(uid=user.id)
	return HttpResponse('hello')