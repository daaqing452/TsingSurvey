# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from Survey.models import Questionaire, Question, Answer
from SUser.models import SUser
import json

# 问卷状态
#	 0 修改中（随时修改）
#	 1 发布中
#	 2 已结束（随时可分析）
#	-1 用户不可见

def survey(request, qid):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	rdata = {}
	rdata['uid'] = request.user.id
	op = request.POST.get('op')
	status = -1

	questionaire_list = Questionaire.objects.filter(id=qid)
	question_list = []
	if len(questionaire_list) == 0:
		rdata['info'] = '找不到该问卷'
	else:
		questionaire = questionaire_list[0]
		status = questionaire.status
		# 检查问卷状态
		if status == 0:
			# 修改中管理员可见
			if not request.user.is_staff:
				rdata['info'] = '找不到该问卷'
			# 修改问卷界面
			if op == 'save':
				print(request.POST.get('qstring'))
			elif op == 'release':
				pass
			else:
				pass
		elif status == 1:
			# 填写问卷界面
			tid_list = map(int, questionaire.question_list.split(' '))
			question_list = [Question.objects.get(id=tid) for tid in tid_list]
			pass
		elif status == 2:
			# 浏览问卷界面，可分析
			pass
		else:
			rdata['info'] = '找不到该问卷'

	rdata['status'] = status
	return render(request, 'survey.html', rdata)

def bonus(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	rdata = {}
	rdata['uid'] = request.user.id
	op = request.POST.get('op')

	if op == 'add_credit':
		credit = request.POST.get('credit')
		SUser = SUser.objects.get(uid=request.user.id)
		Suser.credit += credit
		print('c', credit);

	return render(request, 'bonus.html', rdata)

def design(request):
	# 设计问卷
	return render(request,'mydesign.html',{})

def surveypage(request):
	# 回答问卷页面
	return render(request,'mysurveypage.html',{})
