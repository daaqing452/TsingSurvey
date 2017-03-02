# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from django.utils import timezone
from Survey.models import Questionaire, Answeraire
from SUser.models import SUser
import SUser.utils as Utils
import json
import datetime

# 问卷状态
#	 0 修改中（随时修改）
#	 1 发布中
#	 2 已结束（随时可分析）
#	 3 已生成报告
#	-1 用户不可见

def survey(request, qid):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	rdata = {}
	rdata['user'] = user = request.user
	rdata['viewable'] = 1
	rdata['qid'] = qid
	op = request.POST.get('op')
	status = -1

	def update_questionaire(questionaire, title, qstring):
		questionaire.title = title
		questionaire.questions = qstring
		questionaire.update_time = timezone.now()

	if op == 'create':
		now = timezone.now()
		questionaire = Questionaire.objects.create(status=0, create_time=now, update_time=now, founder=request.user.id)
		questionaire.save()
		return HttpResponse(json.dumps({'qid': questionaire.id}));

	questionaires = Questionaire.objects.filter(id=qid)
	if len(questionaires) == 0:
		rdata['viewable'] = 0
		rdata['info'] = 'Not found -1'
	else:
		questionaire = questionaires[0]
		status = questionaire.status
		suser = SUser.objects.get(uid=user.id)

		# 问卷修改状态
		if status == 0:
			# 修改中管理员可见
			if not user.is_staff:
				rdata['viewable'] = 0
				rdata['info'] = 'Not found 00'
			else:
				# 加载问卷请求
				if op == 'load':
					return HttpResponse(json.dumps({'status': status, 'title': questionaire.title, 'qstring': questionaire.questions}))
				# 修改问卷请求
				if op == 'save':
					update_questionaire(questionaire, request.POST.get('title'), request.POST.get('qstring'))
					questionaire.save()
					return HttpResponse(json.dumps({}))
				# 发布问卷请求
				elif op == 'release':
					questionaire.status = 1
					questionaire.release_time = timezone.now()
					update_questionaire(questionaire, request.POST.get('title'), request.POST.get('qstring'))
					questionaire.save()
					suser_list = SUser.objects.filter(is_sample=1)
					for suser in suser_list:
						qid_dict = json.loads(suser.qid_list)
						qid_dict[questionaire.id] = 0
						suser.qid_list = json.dumps(qid_dict)
						suser.save()
					return HttpResponse(json.dumps({}))
				else:
					pass

		# 问卷填写状态
		elif status == 1:
			# 检验是否可见和是否已经填写
			permission_submit = 0
			qid_dict = json.loads(suser.qid_list)
			if not user.is_staff and not qid in qid_dict:
				rdata['viewable'] = 0
				rdata['info'] = 'Not found 10'
			if qid in qid_dict:
				if qid_dict[str(qid)] == 1:
					rdata['info'] = 'Already filled'
				else:
					permission_submit = 1
			rdata['permission_submit'] = permission_submit

			# 加载问卷请求
			if op == 'load':
				return HttpResponse(json.dumps({'status': status, 'title': questionaire.title, 'qstring': questionaire.questions}))
			# 提交问卷请求
			if op == 'submit':
				answeraire = Answeraire.objects.create(qid=qid, uid=user.id, submit_time=timezone.now(), answers=request.POST.get('astring'))
				answeraire.save()
				qid_dict[str(qid)] = 1
				suser.qid_list = json.dumps(qid_dict)
				suser.credit += int(request.POST.get('credit'));
				suser.save()
				return HttpResponse(json.dumps({}))
			# 关闭问卷请求
			if op == 'closeup':
				questionaire.close_time = timezone.now()
				questionaire.status = 2
				questionaire.save()
				return HttpResponse(json.dumps({}))

		# 问卷结束状态（待分析）
		elif status == 2:
			if not user.is_staff:
				rdata['viewable'] = 0
				rdata['info'] = 'Closed'
			else:
				# 加载问卷请求
				if op == 'load':
					return HttpResponse(json.dumps({'status': status, 'title': questionaire.title, 'qstring': questionaire.questions}))

		# 报告生成状态
		elif status == 3:
			return HttpResponseRedirect('/report/' + qid + '/')

		# 问卷出错状态
		else:
			rdata['viewable'] = 0
			rdata['info'] = 'Not found 99'
		
	rdata['status'] = status
	return render(request, 'survey.html', rdata)

def bonus(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	rdata = {}
	rdata['user'] = request.user
	op = request.POST.get('op')

	return render(request, 'bonus.html', rdata)

def upload_file(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')

	f = request.FILES.get('file', None)
	if not f is None:
		f_path = Utils.upload_file(f)
		return HttpResponse(json.dumps({'status': 'yes', 'url': f_path}))
	else:
		return HttpResponse(json.dumps({'status': 'no'}));