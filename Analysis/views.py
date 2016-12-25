# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from Survey.models import Questionaire, Answeraire, Report
import Analysis.statistic as Stat
import json
import math


def analysis(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if not request.user.is_staff:
		return HttpResponseRedirect('/index/')
	op = request.POST.get('op')

	if op == 'analysis':
		# 获取问卷
		qid = int(request.POST.get('qid'))
		questionaire = Questionaire.objects.get(id=qid)
		qdict_list = json.loads(questionaire.question_list)
		# 获取答案
		answeraire_list = Answeraire.objects.filter(qid=qid)
		adict_list = [json.loads(answeraire.answer_list) for answeraire in answeraire_list]
		qnum = len(adict_list[0])

		# 枚举每道题
		report = []
		for i in range(qnum):
			adicti_list = [adict[i] for adict in adict_list]
			s_type = adicti_list[0]['s_type']
			d = {}
			# 获取统计信息
			if s_type == 1 or s_type == 2:
				d['options'] = [option['text'] for option in qdict_list[i]['options']]
				answer_list = [adicti['select'] for adicti in adicti_list]
				d['result'] = Stat.count(answer_list, len(qdict_list[i]['options']))
			elif s_type == 3:
				d['result'] = [adicti['text'] for adicti in adicti_list]
			# 生成报告字典
			d['title'] = qdict_list[i]['title']
			d['s_type'] = s_type
			report.append(d)
		
		report = Report.objects.create(qid=qid, title=questionaire.title, report=json.dumps(report))
		report.save()
		questionaire.status = 3
		questionaire.save()
		return HttpResponse(json.dumps({}))

	return render(request, 'analysis.html', {})

def search(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	if not request.user.is_staff:
		return HttpResponseRedirect('/index/')
	rdata = {}
	rdata['user'] = user = request.user
	op = request.POST.get('op')

	def context(s, klen, pos):
		l = max(0, pos - 5)
		r = min(len(s), pos + klen + 5)
		context_left = s[l:pos]
		if l != 0:
			context_left = '...' + context_left
		context_right = s[pos+klen:r]
		if r != len(s):
			context_right = context_right + '...'
		return context_left, s[pos:pos+klen], context_right

	if op == 'search':
		keyword = request.POST.get('keyword')
		questionaire_list = Questionaire.objects.all()
		result = []
		for questionaire in questionaire_list:
			d = {}
			p = questionaire.title.find(keyword)
			if p != -1:
				d['id'] = questionaire.id
				d['title'] = questionaire.title
				d['update_time'] = str(questionaire.update_time)[:19]
				d['context_left'], d['context_mid'], d['context_right'] = context(questionaire.title, len(keyword), p)
				result.append(d)
				continue
			p = questionaire.question_list.find(keyword)
			if p != -1:
				d['id'] = questionaire.id
				d['title'] = questionaire.title
				d['update_time'] = str(questionaire.update_time)[:19]
				d['context_left'], d['context_mid'], d['context_right'] = context(questionaire.question_list, len(keyword), p)
				result.append(d)
		return HttpResponse(json.dumps({'result': result}))

	return render(request, 'search.html', rdata)

def report(request, qid):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('/login/')
	rdata = {}
	rdata['user'] = user = request.user
	op = request.POST.get('op')

	if op == 'load':
		reports = Report.objects.filter(qid=qid)
		if len(reports) == 0:
			rdata['info'] = '找不到该报告'
		else:
			report = reports[0]
			return HttpResponse(json.dumps({'qid': report.qid, 'title': report.title, 'report': report.report}))

	return render(request, 'report.html', rdata)
