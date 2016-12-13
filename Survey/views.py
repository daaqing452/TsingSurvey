# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from Survey.models import Questionaire, Question, Answer
import json

def create_survey(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if not request.user.is_staff:
		return HttpResponseRedirect('/index/')
	op = request.POST.get('op')

	return render(request, 'create_survey.html', {	\
		'uid': request.user.id,						\
		})

def survey(request, qid):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	op = request.POST.get('op')
	info = ''

	print(qid, op);

	if op == 'submit':
		pass

	questionaire_list = Questionaire.objects.filter(id=qid)
	if len(questionaire_list) == 0:
		info = '找不到该问卷'
		question_list = []
	else:
		questionaire = questionaire_list[0]
		tid_list = map(int, questionaire.question_list.split(' '))
		question_list = [Question.objects.get(id=tid) for tid in tid_list]

	return render(request, 'survey.html', {		\
		'uid'			: request.user.id,		\
		'info'			: info,					\
		'question_list'	: question_list,		\
		})

def bonus(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	op = request.POST.get('op')

	return render(request, 'bonus.html', {'uid': request.user.id})