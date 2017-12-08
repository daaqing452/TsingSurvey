# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.core.signals import request_finished
from django.dispatch import receiver
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from SUser.models import SUser
from Survey.models import Questionaire, Answeraire, Report
from Analysis.models import *
import SUser.utils as Utils
import datetime
import json
import math
import numpy as np
import time
import xlsxwriter


def get_report(qid):
	MATRIX_STAT_RANK = 2
	questionaire = Questionaire.objects.get(id=qid)
	# 已经生成报告
	if questionaire.report_id != -1:
		return Report.objects.get(id=questionaire.report_id).report
	# 还没生成报告
	questions = json.loads(questionaire.questions)
	answeraire_list = Answeraire.objects.filter(qid=qid, submitted=True)
	answeraires = [json.loads(answeraire.answers) for answeraire in answeraire_list]
	# 预处理+清空
	counters = []
	for question in questions:
		s_type = question['s_type']
		if s_type == 8: continue
		if 'n_option' in question: n_option = int(question['n_option'])
		# 单选题、多选题、下拉题、矩阵题
		if s_type in [1, 2, 4, 6]:
			counters.append(np.zeros((1, n_option)))
		# 排序题
		elif s_type == 5:
			counters.append(np.zeros((MATRIX_STAT_RANK, n_option)))
		else:
			counters.append(-1)
	# 计数
	for answeraire in answeraires:
		for answer in answeraire:
			s_type = answer['s_type']
			if s_type == 8: continue
			qindex = int(answer['index'])
			selects = answer['select']
			for i in range(len(selects)):
				select = selects[i]
				if select[0] is None: select[0] = 0
				oindex = int(select[0])
				if s_type in [1, 2, 4, 6]:
					counters[qindex][0, oindex] += 1
				elif s_type == 5:
					if i < MATRIX_STAT_RANK:
						counters[qindex][i, oindex] += 1
	# 统计
	reports = []
	n_people = len(answeraires)
	i = -1
	for question in questions:
		s_type = question['s_type']
		if s_type == 8: continue
		report = {}
		i += 1
		counter = counters[i]
		report['s_type'] = s_type
		report['index'] = question['index']
		report['title'] = question['title']
		if 'n_option' in question: report['n_option'] = question['n_option']
		if 'n_set' in question: report['n_set'] = question['n_set']
		report['options'] = []
		if s_type in [1, 2, 4, 5, 6]:
			options = question['options']
			for j in range(len(options)):
				option = options[j]
				n_total = counter.sum(axis=1)
				nk = 1
				if s_type == 5: nk = MATRIX_STAT_RANK
				for k in range(nk):
					roption = {}
					roption['index'] = j
					roption['option_type'] = option['option_type']
					roption['text'] = option['text']
					roption['image'] = option['image']
					roption['rank'] = k
					roption['num'] = counter[k, j]
					roption['ratio'] = 1.0 * counter[k, j] / n_people
					report['options'].append(roption)
		reports.append(report)
	report_str = json.dumps(reports)
	if questionaire.status == 2:
		report = Report.objects.create(qid=qid, report=report_str)
		questionaire.report_id = report.id
		questionaire.save()
	return report_str

def export(qid):
	questionaires = Questionaire.objects.filter(id=qid)
	if len(questionaires) == 0:
		return HttpResponse(json.dumps({'info': 'no that'}))
	questionaire = json.loads(questionaires[0].questions)
	answeraires = Answeraire.objects.filter(qid=qid, submitted=True)
	if len(answeraires) == 0: return None
	answers = [json.loads(answeraire.answers) for answeraire in answeraires]
	reports = json.loads(get_report(qid))
	# 写入excel
	excel_name = 'media/' + time.strftime('%Y%m%d%H%M%S') + '-问卷结果.xlsx'
	excel = xlsxwriter.Workbook(excel_name)
	sheet1 = excel.add_worksheet('工作表1')
	sheet2 = excel.add_worksheet('工作表2')
	sheet3 = excel.add_worksheet('工作表3')
	# 基本信息
	sheet1.write(0, 0, '开始时间')
	sheet2.write(0, 0, '开始时间')
	sheet1.write(0, 1, '结束时间')
	sheet2.write(0, 1, '结束时间')
	sheet1.write(0, 2, '持续时间')
	sheet2.write(0, 2, '持续时间')
	sheet1.write(0, 3, '学号')
	sheet2.write(0, 3, '学号')
	sheet1.write(0, 4, 'IP')
	sheet2.write(0, 4, 'IP')
	sheet1.write(0, 5, 'AGENT')
	sheet2.write(0, 5, 'AGENT')
	for i in range(len(answeraires)):
		answeraire = answeraires[i]
		sheet1.write(i + 1, 0, str(answeraire.load_time))
		sheet2.write(i + 1, 0, str(answeraire.load_time))
		sheet1.write(i + 1, 1, str(answeraire.submit_time))
		sheet2.write(i + 1, 1, str(answeraire.submit_time))
		cost_time = answeraire.submit_time - answeraire.load_time
		sheet1.write(i + 1, 2, str(cost_time))
		sheet2.write(i + 1, 2, str(cost_time))
		sheet1.write(i + 1, 3, User.objects.get(id=answeraire.uid).username)
		sheet2.write(i + 1, 3, User.objects.get(id=answeraire.uid).username)
		sheet1.write(i + 1, 4, answeraire.ip)
		sheet2.write(i + 1, 4, answeraire.ip)
		sheet1.write(i + 1, 5, answeraire.agent)
		sheet2.write(i + 1, 5, answeraire.agent)
	# 文件内容
	col = 5
	cnt = -1
	for question in questionaire:
		s_type = question['s_type']
		cnt += 1
		if s_type == 8: continue
		index_show = question['index']
		index = cnt
		title = question['title']
		selects = [answer[index]['select'] for answer in answers]
		row = 0
		# 单选题、下拉题
		if s_type in [1, 4]:
			col += 1
			sheet1.write(row, col, '第' + str(index_show + 1) + '题（' + title + '）')
			sheet2.write(row, col, '第' + str(index_show + 1) + '题（' + title + '）')
			for select in selects:
				row += 1
				if len(select) > 0:
					selected_option = select[0]
					if selected_option[0] is None: selected_option[0] = 0
					sheet1.write(row, col, int(selected_option[0]))
					sheet2.write(row, col, selected_option[int(selected_option[1]) + 2])
		# 填空题
		elif s_type == 3:
			col += 1
			sheet1.write(row, col, '第' + str(index_show + 1) + '题（' + title + '）')
			sheet2.write(row, col, '第' + str(index_show + 1) + '题（' + title + '）')
			for select in selects:
				row += 1
				if len(select) > 0:
					sheet2.write(row, col, select[0][2])
		# 多项填空题
		elif s_type == 7:
			options = question['options']
			n_option = len(options)
			for option in options:
				col += 1
				sheet1.write(row, col, '第' + str(index_show + 1) + '题（' + option['text'] + '）')
				sheet2.write(row, col, '第' + str(index_show + 1) + '题（' + option['text'] + '）')
			for select in selects:
				row += 1
				for selected_option in select:
					sheet2.write(row, col - n_option + selected_option[0] + 1, selected_option[2])
		# 矩阵题
		elif s_type == 6:
			n_option = int(question['n_option'])
			options = question['options']
			n_set = int(question['n_set'])
			n_column = int(n_option / n_set)
			qtitles = [options[i]['text'] for i in range(0, n_option, n_column)]
			for qtitle in qtitles:
				col += 1
				sheet1.write(row, col, '第' + str(index_show + 1) + '题（' + qtitle + '）')
				sheet2.write(row, col, '第' + str(index_show + 1) + '题（' + qtitle + '）')
			for select in selects:
				row += 1
				for selected_option in select:
					index2 = selected_option[0]
					qrow, qcol = int(index2 / n_column), int(index2 % n_column)
					sheet1.write(row, col - n_set + qrow + 1, int(qcol))
					sheet2.write(row, col - n_set + qrow + 1, selected_option[3])
		# 多选题
		elif s_type == 2:
			n_option = int(question['n_option'])
			options = question['options']
			for i in range(len(options)):
				option = options[i]
				col += 1
				str0 = '第' + str(index_show + 1) + '题第' + str(i + 1) + '项（'
				if option['option_type'] == 0:
					str0 += option['text']
				else:
					str0 += option['image']
				str0 += '）'
				sheet1.write(row, col, str0)
				sheet2.write(row, col, str0)
			for select in selects:
				row += 1
				for selected_option in select:
					idx = int(selected_option[0])
					sheet1.write(row, col - n_option + idx + 1, 1)
					sheet2.write(row, col - n_option + idx + 1, 1)
		# 排序题
		elif s_type == 5:
			n_option = int(question['n_option'])
			options = question['options']
			for i in range(len(options)):
				option = options[i]
				col += 1
				str0 = '第' + str(index_show + 1) + '题第' + str(i + 1) + '项（'
				if option['option_type'] == 0:
					str0 += option['text']
				else:
					str0 += option['image']
				str0 += '）'
				sheet1.write(row, col, str0)
				sheet2.write(row, col, str0)
			for select in selects:
				row += 1
				for i in range(len(select)):
					selected_option = select[i]
					idx = int(selected_option[0])
					sheet1.write(row, col - n_option + idx + 1, n_option - i)
					sheet2.write(row, col - n_option + idx + 1, n_option - i)
	# 写入统计
	row = 0
	for report in reports:
		s_type = report['s_type']
		if s_type == 8: continue
		if 'n_option' in report: n_option = int(report['n_option'])
		options = report['options']
		sheet3.write(row, 0, str(int(report['index'] + 1)) + '.' + report['title'])
		row += 1
		# 单选题、多选题、下拉题
		if s_type in [1, 2, 4]:
			for i in range(n_option):
				option = options[i]
				s = option['text']
				if option['option_type'] == 1: s = str(i + 1)
				sheet3.write(row + 0, i + 2, s)
				sheet3.write(row + 1, i + 2, option['num'])
				sheet3.write(row + 2, i + 2, option['ratio'])
			sheet3.write(row + 1, 1, '数量')
			sheet3.write(row + 2, 1, '比例')
			row += 4
		# 排序题
		elif s_type == 5:
			for option in options:
				s = option['text']
				if option['option_type'] == 1: s = str(i + 1)
				index = int(option['index'])
				rank = int(option['rank'])
				sheet3.write(row, index + 2, s)
				sheet3.write(row + rank * 2 + 1, index + 2, option['num'])
				sheet3.write(row + rank * 2 + 2, index + 2, option['ratio'])
			sheet3.write(row + 1, 1, '第一选择 数量')
			sheet3.write(row + 2, 1, '第一选择 比例')
			sheet3.write(row + 3, 1, '第二选择 数量')
			sheet3.write(row + 4, 1, '第二选择 比例')
			row += 6
		# 矩阵题
		elif s_type == 6:
			n_set = int(report['n_set'])
			n_column = int(n_option / n_set)
			for option in options:
				index = int(option['index'])
				r = row + 1 + int(index / n_column)
				c = 2 + index % n_column
				sheet3.write(row, c, option['image'])
				sheet3.write(r, 1, option['text'])
				sheet3.write(r, c, option['num'])
			row += n_set + 2
			for option in options:
				index = int(option['index'])
				r = row + 1 + int(index / n_column)
				c = 2 + index % n_column
				sheet3.write(row, c, option['image'])
				sheet3.write(r, 1, option['text'])
				sheet3.write(r, c, option['ratio'])
			row += n_set + 2
		# 填空题
		else:
			row += 1
	excel.close()
	return excel_name

def search(request):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	if not request.user.is_staff:
		return render(request, 'permission_denied.html', {})
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

def prize(request):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	rdata = {}
	rdata['user'] = user = request.user
	rdata['suser'] = suser = SUser.objects.get(uid=user.id)
	op = request.POST.get('op')

	# 商家重导向
	if suser.is_store:
		return HttpResponseRedirect('/prize_ticket/')

	if op == 'delete':
		pid = int(request.POST.get('pid'))
		Prize.objects.filter(id=pid).delete()
		return HttpResponse(json.dumps({}))

	if op == 'change_credit':
		pid = int(request.POST.get('pid'))
		credit = int(request.POST.get('credit'))
		Prize.objects.filter(id=pid).update(credit=credit)
		return HttpResponse(json.dumps({}))

	if op == 'change_price':
		pid = int(request.POST.get('pid'))
		price = int(request.POST.get('price'))
		Prize.objects.filter(id=pid).update(price=price)
		return HttpResponse(json.dumps({}))

	if op == 'exchange':
		jdata = {'result': 'ok'}
		pid = int(request.POST.get('pid'))
		prize = Prize.objects.get(id=pid)
		if suser.credit < prize.credit:
			jdata['result'] = '没有足够积分'
			return HttpResponse(json.dumps(jdata))
		suser.credit -= prize.credit
		suser.save()
		PrizeTicket.objects.create(uid=suser.id, pid=pid, count=1, used=False, exchange_time=datetime.datetime.now())
		return HttpResponse(json.dumps(jdata))

	rdata['prizes'] = prizes = list(reversed(Prize.objects.all()))
	return render(request, 'prize.html', rdata)

def prize_ticket(request, pid=-1):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	rdata = {}
	rdata['user'] = user = request.user
	rdata['suser'] = suser = SUser.objects.get(uid=user.id)
	op = request.POST.get('op')

	if pid == -1:
		# 用户兑换记录
		rdata['personal'] = True
		tickets = []
		if suser.is_store:
			for prize in Prize.objects.all():
				store = json.loads(prize.store)
				if suser.id in store:
					tickets += PrizeTicket.objects.filter(pid=prize.id)
		else:
			tickets = PrizeTicket.objects.filter(uid=suser.id)
	else:
		# 商品兑换记录
		if not request.user.is_staff:
			return render(request, 'permission_denied.html', {})
		rdata['personal'] = False
		used = 0
		cleared = 0
		prize = Prize.objects.get(id=pid)
		tickets = PrizeTicket.objects.filter(pid=pid)
		for ticket in tickets:
			used += int(ticket.used)
			cleared += int(ticket.cleared)
		rdata['total'] = len(tickets)
		rdata['used'] = used
		rdata['cleared'] = cleared
		rdata['money'] = (used - cleared) * prize.price

	if op == 'clear_scaned':
		tid = int(request.POST.get('tid'))
		PrizeTicket.objects.filter(id=tid).update(use_status=0)
		return HttpResponse(json.dumps({}))

	if op == 'if_scan_qrcode':
		jdata = {'result': 'not scaned'}
		tid = int(request.POST.get('tid'))
		if PrizeTicket.objects.get(id=tid).use_status > 0: jdata['result'] = 'scaned'
		return HttpResponse(json.dumps(jdata))

	ticket_list = []
	for ticket in tickets:
		prizes = Prize.objects.filter(id=ticket.pid)
		if len(prizes) == 0: continue
		susers = SUser.objects.filter(id=ticket.uid)
		if len(susers) == 0: continue
		ticket_list.append({'ticket': ticket, 'prize': prizes[0], 'username': susers[0].username})
	rdata['tickets'] = list(reversed(ticket_list))

	return render(request, 'prize_ticket.html', rdata)

def prize_add(request):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	if not request.user.is_staff:
		return render(request, 'permission_denied.html', {})
	rdata = {}
	rdata['user'] = user = request.user
	op = request.POST.get('op')

	if op == 'add_prize':
		title = request.POST.get('title')
		description = request.POST.get('description')
		credit = int(request.POST.get('credit'))
		price = int(request.POST.get('price'))
		expire_time = request.POST.get('expire_time')
		prize = Prize.objects.create(title=title, description=description, credit=credit, price=price, expire_time=expire_time)
		return HttpResponse(json.dumps({}))

	return render(request, 'prize_add.html', rdata)

def prize_add_store(request):
	# 验证身份
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	if not request.user.is_staff:
		return render(request, 'permission_denied.html', {})
	rdata = {}
	rdata['user'] = user = request.user
	op = request.POST.get('op')

	if op == 'add_store':
		jdata = {'result': 'ok'}
		username = request.POST.get('username')
		if username.isdigit() and len(username) == 10:
			jdata['result'] = '请勿使用清华学号'
		elif len(SUser.objects.filter(username=username)) > 0:
			jdata['result'] = '用户名已存在'
		else:
			password = request.POST.get('password')
			pid_list = json.loads(request.POST.get('pid_list'))
			user = User.objects.create_user(username=username, password=password, is_superuser=0, is_staff=0)
			suser = SUser.objects.create(username=username, uid=user.id, is_sample=0, is_store=1)
			for pid in pid_list:
				prize = Prize.objects.get(id=int(pid))
				store = json.loads(prize.store)
				store.append(suser.id)
				prize.store=json.dumps(store)
				prize.save()
		return HttpResponse(json.dumps(jdata))

	rdata['prizes'] = prizes = list(reversed(Prize.objects.all()))

	return render(request, 'prize_add_store.html', rdata)

def prize_exchange(request, tid):
	# 验证身份，只有特定商家和特定用户
	if not request.user.is_authenticated():
		return Utils.redirect_login(request)
	rdata = {}
	rdata['user'] = user = request.user
	rdata['suser'] = suser = SUser.objects.get(uid=user.id)
	rdata['ticket'] = ticket = PrizeTicket.objects.get(id=tid)
	rdata['prize'] = prize = Prize.objects.get(id=ticket.pid)
	if suser.is_store:
		store = json.loads(prize.store)
		if not suser.id in store:
			return render(request, 'permission_denied.html', {})
	else:
		if ticket.uid != suser.id:
			return render(request, 'permission_denied.html', {})
	op = request.POST.get("op")

	if op == "exchange":
		if suser.is_store:
			ticket.use_status = ticket.use_status | 2
			ticket.oid = suser.id
		else:
			ticket.use_status = ticket.use_status | 4
		if ticket.use_status == 7:
			ticket.used = True
			ticket.use_time = datetime.datetime.now()
		ticket.save()
		return HttpResponse(json.dumps({}))

	if op == "if_confirm":
		jdata = {'result': 'not confirmed'}
		if ticket.use_status == 7:
			jdata['result'] = 'confirmed'
		return HttpResponse(json.dumps(jdata))

	if ticket.used == True:
		return render(request, 'permission_denied.html', {})
	if suser.is_store:
		ticket.use_status = ticket.use_status | 1
		ticket.save()

	return render(request, 'prize_exchange.html', rdata)
