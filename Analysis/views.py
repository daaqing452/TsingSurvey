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
import time
import xlsxwriter


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
		qdict_list = json.loads(questionaire.questions)
		# 获取答案
		answeraire_list = Answeraire.objects.filter(qid=qid)
		adict_list = [json.loads(answeraire.answers) for answeraire in answeraire_list]
		qnum = len(adict_list[0])

		# 枚举每道题
		report = []
		'''for i in range(qnum):
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
		questionaire.save()'''
		return HttpResponse(json.dumps({}))

	if op == 'export':
		# 获取答案
		qid = int(request.POST.get('qid'))
		questionaires = Questionaire.objects.filter(id=qid)
		if len(questionaires) == 0:
			return HttpResponse(json.dumps({'info': 'no tt'}))
		questionaire = json.loads(questionaires[0].questions)
		answeraires = Answeraire.objects.filter(qid=qid)
		answers = [json.loads(answeraire.answers) for answeraire in answeraires]
		# 写入excel
		excel_name = 'media/' + time.strftime('%Y%m%d%H%M%S') + '-export.xlsx'
		excel = xlsxwriter.Workbook(excel_name)
		sheet1 = excel.add_worksheet('工作表1')
		sheet2 = excel.add_worksheet('工作表2')
		sheet3 = excel.add_worksheet('工作表3')
		col = -1
		for question in questionaire:
			s_type = question['s_type']
			index = question['index']
			title = question['title']
			selects = [answer[index]['select'] for answer in answers]
			row = 0
			# 单选题、下拉题
			if s_type == 1 or s_type == 4:
				col += 1
				sheet1.write(row, col, '第' + str(index) + '题（' + title + '）')
				sheet2.write(row, col, '第' + str(index) + '题（' + title + '）')
				for select in selects:
					row += 1
					if len(select) > 0:
						selected_option = select[0]
						sheet1.write(row, col, str(selected_option[0]))
						sheet2.write(row, col, selected_option[int(selected_option[1]) + 2])
			# 填空题
			elif s_type == 3:
				col += 1
				sheet1.write(row, col, '第' + str(index) + '题（' + title + '）')
				sheet2.write(row, col, '第' + str(index) + '题（' + title + '）')
				for select in selects:
					row += 1
					if len(select) > 0:
						sheet2.write(row, col, select[0][2])
			# 矩阵题
			elif s_type == 6:
				n_set = question['n_set']
				n_option = question['n_option']
				n_column = n_option / n_set
				options = question['options']
				qtitles = [options[i]['text'] for i in range(0, n_option, n_column)]
				for qtitle in qtitles:
					col += 1
					sheet1.write(row, col, '第' + str(index) + '题（' + qtitle + '）')
					sheet2.write(row, col, '第' + str(index) + '题（' + qtitle + '）')
				for select in selects:
					row += 1
					for selected_option in select:
						index2 = selected_option[0]
						qrow, qcol = index2 / n_column, index2 % n_column
						sheet1.write(row, col - n_set + qrow + 1, str(qcol))
						sheet2.write(row, col - n_set + qrow + 1, selected_option[3])
		excel.close()
		return HttpResponse(json.dumps({'export_path': excel_name}))

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
			p = questionaire.questions.find(keyword)
			if p != -1:
				d['id'] = questionaire.id
				d['title'] = questionaire.title
				d['update_time'] = str(questionaire.update_time)[:19]
				d['context_left'], d['context_mid'], d['context_right'] = context(questionaire.questions, len(keyword), p)
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
