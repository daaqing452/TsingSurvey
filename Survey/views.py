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
import datetime
from django.utils import timezone

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
	rdata['is_staff'] = request.user.is_staff
	rdata['viewable'] = 1
	op = request.POST.get('op')
	status = -1

	def update_questionaire(questionaire, title, qstring):
		questionaire.title = title
		questionaire.question_list = qstring
		questionaire.update_time = timezone.now()
		questionaire.save()

	if op == 'create':
		now = timezone.now()
		questionaire = Questionaire.objects.create(status=0, create_time=now, update_time=now, founder=request.user.id)
		questionaire.save()
		return HttpResponse(json.dumps({'qid': questionaire.id}));

	questionaires = Questionaire.objects.filter(id=qid)
	if len(questionaires) == 0:
		rdata['viewable'] = 0
		rdata['info'] = '找不到该问卷 -1'
	else:
		questionaire = questionaires[0]
		status = questionaire.status
		suser = Suser.objects.get(uid=request.user.id)

		# 问卷修改状态
		if status == 0:
			# 修改中管理员可见
			if not request.user.is_staff:
				rdata['viewable'] = 0
				rdata['info'] = '找不到该问卷 00'
			else:
				# 加载问卷请求
				if op == 'load':
					return HttpResponse(json.dumps({'title': questionaire.title, 'qstring': questionaire.question_list}))
				# 修改问卷请求
				if op == 'save':
					update_questionaire(questionaire, request.POST.get('title'), request.POST.get('qstring'))
					return HttpResponse(json.dumps({}))
				# 发布问卷请求
				elif op == 'release':
					questionaire.status = 1
					update_questionaire(questionaire, request.POST.get('title'), request.POST.get('qstring'))
					suser_list = SUser.objects.filter(is_sample=1)
					for suser in suser_list:
						qid_dict = json.loads(suser.qid_list)
						qid_dict[questionaire.id] = 0
						suser.qid_list = json.dumps(qid_dict)
						suser.save()
					return HttpResponse(json.dumps({}))
				# ???
				else:
					pass

		# 问卷填写状态
		elif status == 1:
			# 检验是否已经填写
			if not request.user.is_staff:
				qid_dict = json.loads(suser.qid_list)
				if not qid in qid_dict:
					rdata['viewable'] = 0
					rdata['info'] = '找不到该问卷 10'

			# 加载问卷请求
			if op == 'load':
				return HttpResponse(json.dumps({'title': questionaire.title, 'qstring': questionaire.question_list}))

		# 问卷结束状态（分析）
		elif status == 2:
			pass

		# 问卷出错状态
		else:
			rdata['viewable'] = 0
			rdata['info'] = '找不到该问卷 99'
		
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
