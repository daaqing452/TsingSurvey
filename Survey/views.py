# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
# from django.utils import timezone
from Survey.models import Questionaire, Answeraire
from SUser.models import SUser, SampleList
import SUser.utils as Utils
import Analysis.views as Analysis
import datetime
import json
import math

# 问卷状态
#	 0 修改中（随时修改）
#	 1 发布中
#	 2 已结束

def survey(request, qid):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	rdata = {}
	rdata['user'] = user = request.user
	rdata['viewable'] = 1
	rdata['qid'] = qid
	op = request.POST.get('op')
	status = -1
	now = datetime.datetime.now()

	def update_questionaire(questionaire, title, qstring):
		questionaire.title = title
		questionaire.questions = qstring
		questionaire.update_time = datetime.datetime.now()

	# 添加新问卷
	if op == 'create':
		questionaire = Questionaire.objects.create(status=0, create_time=now, update_time=now, founder=request.user.id)
		questionaire.save()
		return HttpResponse(json.dumps({'qid': questionaire.id}));

	questionaires = Questionaire.objects.filter(id=qid)
	if len(questionaires) == 0:
		rdata['viewable'] = 0
		rdata['info'] = '问卷不存在'
	else:
		questionaire = questionaires[0]
		status = questionaire.status
		suser = SUser.objects.get(uid=user.id)

		# 加载问卷请求
		if op == 'load':
			if status == 0:
				return HttpResponse(json.dumps({'status': status, 'title': questionaire.title, 'qstring': questionaire.questions}))
			elif status == 1:
				answeraire = Answeraire.objects.filter(qid=qid, uid=user.id)
				if len(answeraire):
					astring = answeraire[0].answers
				else:
					astring = '{}'
				return HttpResponse(json.dumps({'status': status, 'title': questionaire.title, 'qstring': questionaire.questions, 'astring': astring}))
			elif status == 2:
				report = Analysis.get_report(qid)
				return HttpResponse(json.dumps({'status': status, 'title': questionaire.title, 'qstring': report}))
			else:
				assert(False)

		# 删除问卷
		if op == 'delete':
			questionaire.delete();
			return HttpResponse(json.dumps({}));

		# 复制问卷
		if op == 'copy':
			new_questionaire = Questionaire.objects.create(status=0, create_time=now, update_time=now, founder=request.user.id, title=questionaire.title, questions=questionaire.questions)
			new_questionaire.save()
			return HttpResponse(json.dumps({}));

		# 导出问卷
		if op == 'export':
			if status == 1 or status == 2:
				excel_name = Analysis.export(qid)
				if excel_name == None:
					return HttpResponse(json.dumps({'result': 'no', 'info': '尚未有人填写问卷！'}))
				else:
					return HttpResponse(json.dumps({'result': 'yes', 'export_path': excel_name}))
			else:
				return HttpResponse(json.dumps({'result': 'no', 'info': '问卷尚未发布！'}))

		# 问卷修改状态
		if status == 0:
			# 添加可选样本列表
			rdata['sample_lists'] = SampleList.objects.all()

			# 修改中管理员可见
			if not user.is_staff:
				rdata['viewable'] = 0
				rdata['info'] = '非管理员不能修改'
			else:
				# 修改问卷请求
				if op == 'save':
					update_questionaire(questionaire, request.POST.get('title'), request.POST.get('qstring'))
					questionaire.save()
					return HttpResponse(json.dumps({}))
				# 发布问卷请求
				elif op == 'release':
					sample_list_id = int(request.POST.get('sample_list_id'))
					ifpublic = bool(int(request.POST.get('ifpublic')))
					susers = SUser.objects.filter(is_sample=1)
					if sample_list_id != -1:
						sample_list = SampleList.objects.filter(id=sample_list_id)
						susers = []
						if len(sample_list) > 0:
							sample_list = eval(sample_list[0].sample_list)
							for suser_id in sample_list:
								suser = SUser.objects.filter(id=suser_id)
								if len(suser) > 0:
									susers.append(suser[0])
					for suser in susers:
						qid_dict = json.loads(suser.qid_list)
						qid_dict[str(questionaire.id)] = 0
						suser.qid_list = json.dumps(qid_dict)
						suser.save()
					questionaire.status = 1
					questionaire.release_time = now
					questionaire.public = ifpublic
					update_questionaire(questionaire, request.POST.get('title'), request.POST.get('qstring'))
					questionaire.save()
					return HttpResponse(json.dumps({}))

		# 问卷填写状态
		elif status == 1:
			# 检验是否可见和是否已经填写
			permission_submit = 0
			qid_dict = json.loads(suser.qid_list)
			if not (questionaire.public) and (not user.is_staff) and (not qid in qid_dict):
				rdata['viewable'] = 0
				rdata['info'] = '没有权限访问'
			if qid in qid_dict:
				if qid_dict[str(qid)] == 1:
					rdata['info'] = '已经填写该问卷'
				else:
					permission_submit = 1
			rdata['permission_submit'] = permission_submit

			# 提交问卷请求
			if op == 'submit':
				# 获取信息
				if 'HTTP_X_FORWARDED_FOR' in request.META:
				    ip = request.META['HTTP_X_FORWARDED_FOR']
				else:
				    ip = request.META['REMOTE_ADDR']
				agent = request.META.get('HTTP_USER_AGENT', 'unknown')
				os = request.META.get('OS', 'unknown')
				# 记录
				astring = request.POST.get('astring')
				complete = request.POST.get('complete', 'no')
				answeraire = Answeraire.objects.filter(qid=qid, uid=user.id)
				if len(answeraire) > 0:
					answeraire = answeraire[0]
				else:
					answeraire = Answeraire.objects.create(qid=qid, uid=user.id)
				answeraire.load_time = request.POST['load_time']
				answeraire.submit_time=request.POST['submit_time']
				answeraire.ip = ip
				answeraire.agent = agent
				answeraire.os = os
				answeraire.answers = astring
				answeraire.save()
				# 判断暂存还是提交
				if complete == 'yes':
					qid_dict[str(qid)] = 1
					suser.qid_list = json.dumps(qid_dict)
					suser.save()
					answeraire.submitted = True
					answeraire.save()
					# 计算积分
					k = (len(json.loads(astring)) - 1) / 5 + 1
					credit = int(k * math.pow(1.05, len(qid_dict)))
					suser.credit += credit
					suser.save()
					return HttpResponse(json.dumps({'credit': credit}))
				else:
					return HttpResponse(json.dumps({}))

			# 关闭问卷请求
			if op == 'closeup':
				questionaire.close_time = datetime.datetime.now()
				questionaire.status = 2
				questionaire.save()
				return HttpResponse(json.dumps({}))

		# 问卷结束状态
		elif status == 2:
			if not user.is_staff:
				rdata['viewable'] = 0
				rdata['info'] = '问卷已关闭'

		# 问卷出错状态
		else:
			rdata['viewable'] = 0
			rdata['info'] = '错误？'

	rdata['status'] = status
	return render(request, 'survey.html', rdata)

def bonus(request):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request, '../login/')
	rdata = {}
	rdata['user'] = request.user
	rdata['credit'] = request.GET.get('credit', 0)
	op = request.POST.get('op')

	return render(request, 'bonus.html', rdata)

def upload_file(request):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)

	f = request.FILES.get('file', None)
	if not f is None:
		f_path = Utils.upload_file(f)
		return HttpResponse(json.dumps({'status': 'yes', 'url': f_path}))
	else:
		return HttpResponse(json.dumps({'status': 'no'}));
