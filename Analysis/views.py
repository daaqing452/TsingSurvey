# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from Survey.models import Questionaire, Answeraire
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
		qid = int(request.POST.get('qid'))
		questionaire = Questionaire.objects.get(id=qid)
		answeraire_list = Answeraire.objects.filter(qid=qid)
		astring_list = [json.loads(answeraire.answer_list) for answeraire in answeraire_list]
		qnum = len(astring_list[0])
		for i in range(qnum):
			d_list = [astring[i] for astring in astring_list]
			t = d_list[0]['s_type']
			if t == 1 or t == 2:
				answer_list = [d['select'] for d in d_list]
				result = Stat.count(answer_list)
				print(result)
			elif t == 3:
				result = [d['text'] for d in d_list]
				print(result)

	return HttpResponse('hello')

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