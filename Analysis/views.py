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

MATRIX_STAT_RANK = 2


def get_report_base(questionaire, answeraires):
	questions = json.loads(questionaire.questions)
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
	return report_str

def get_report(qid):
	questionaire = Questionaire.objects.get(id=qid)
	# 已经生成报告
	if questionaire.report_id != -1:
		return Report.objects.get(id=questionaire.report_id).report
	# 还没生成报告
	answeraire_list = Answeraire.objects.filter(qid=qid, submitted=True)
	answeraires = [json.loads(answeraire.answers) for answeraire in answeraire_list]
	report_str = get_report_base(questionaire, answeraires)
	if questionaire.status == 2:
		report = Report.objects.create(qid=questionaire.id, report=report_str)
		questionaire.report_id = report.id
		questionaire.save()
	return report_str


def export_base(questionaire, answeraires, reports):
	answers = [json.loads(answeraire.answers) for answeraire in answeraires]
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
		sheet1.write(i + 1, 3, answeraire.username)
		sheet2.write(i + 1, 3, answeraire.username)
		sheet1.write(i + 1, 4, answeraire.ip)
		sheet2.write(i + 1, 4, answeraire.ip)
		sheet1.write(i + 1, 5, answeraire.agent)
		sheet2.write(i + 1, 5, answeraire.agent)
	# 文件内容
	col = 5
	cnt = -1
	for question in questionaire:
		s_type = question['s_type']
		if s_type == 8: continue
		cnt += 1
		index_show = question['index']
		title = question['title']
		selects = []
		for answer in answers:
			j = -1
			for sub_answer in answer:
				if sub_answer['s_type'] != 8: j += 1
				if j == cnt:
					selects.append(sub_answer['select'])
					break
		# selects2 = [answer[cnt]['select'] for answer in answers]
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

def export(qid):
	questionaires = Questionaire.objects.filter(id=qid)
	if len(questionaires) == 0:
		return HttpResponse(json.dumps({'info': 'no that'}))
	questionaire = json.loads(questionaires[0].questions)
	answeraires = Answeraire.objects.filter(qid=qid, submitted=True)
	if len(answeraires) == 0: return None
	reports = json.loads(get_report(qid))
	return export_base(questionaire, answeraires, reports)

def export_multi(qids):
	questionaire = Questionaire.objects.get(id=qids[0])
	questions = json.loads(questionaire.questions)
	answeraire_list = []
	for qid in qids:
		answeraire_list += Answeraire.objects.filter(qid=qid, submitted=True)
	answeraires = [json.loads(answeraire.answers) for answeraire in answeraire_list]
	reports = json.loads(get_report_base(questionaire, answeraires))
	return export_base(questions, answeraire_list, reports)



def search(request):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if not suser.admin_all:
		return render(request, 'permission_denied.html', {})

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
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)

	# 商家重导向
	if suser.is_store:
		return HttpResponseRedirect('/prize_ticket/u/' + str(suser.id) + '/')

	if op == 'delete':
		pid = int(request.POST.get('pid'))
		Prize.objects.filter(id=pid).delete()
		return HttpResponse(json.dumps({}))

	if op == 'change_title':
		pid = int(request.POST.get('pid'))
		title = request.POST.get('title')
		Prize.objects.filter(id=pid).update(title=title)
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

	if op == 'change_description':
		pid = int(request.POST.get('pid'))
		Prize.objects.filter(id=pid).update(description=request.POST.get('description'))
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

def prize_ticket(request, ptype, qid=-1):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	qid = int(qid)

	if op == 'clear_scaned':
		tid = int(request.POST.get('tid'))
		PrizeTicket.objects.filter(id=tid).update(use_status=0)
		return HttpResponse(json.dumps({}))

	if op == 'if_scan_qrcode':
		jdata = {'result': 'not scaned'}
		print(request.POST.get('tid'))
		tid = int(request.POST.get('tid'))
		if PrizeTicket.objects.get(id=tid).use_status > 0:
			jdata['result'] = 'scaned'
		return HttpResponse(json.dumps(jdata))

	if ptype == 'p':
		# 某商品交易记录
		rdata['personal'] = False
		prizes = Prize.objects.filter(id=qid)
		if len(prizes) == 0:
			return render(request, 'permission_denied.html', {})
		prize = prizes[0]
		if (not suser.admin_all) and (not suser.id in json.loads(prize.store)):
			return render(request, 'permission_denied.html', {})
		tickets = PrizeTicket.objects.filter(pid=qid)
	elif ptype == 'u':
		if (not suser.admin_all) and (suser.id != qid):
			return render(request, 'permission_denied.html', {})
		qsuser = SUser.objects.get(id=qid)
		if qsuser.is_store:
			# 某商家交易记录
			rdata['personal'] = False
			rdata['is_store'] = True
			tickets = PrizeTicket.objects.filter(oid=qid)
		else:
			# 某用户兑换记录
			rdata['personal'] = True
			tickets = PrizeTicket.objects.filter(uid=qid)
	else:
		return render(request, 'permission_denied.html', {})

	def remake_tickets(tickets, d):
		# 去掉不合法的
		ticket_list = []
		for ticket in tickets:
			prizes = Prize.objects.filter(id=ticket.pid)
			if len(prizes) == 0: continue
			susers = SUser.objects.filter(id=ticket.uid)
			if len(susers) == 0:
				nickname = '已删除'
			else:
				nickname = susers[0].nickname
			prize = prizes[0]
			ticket_list.append({'tid': ticket.id, 'pid': prize.id, 'title': prize.title, 'nickname': nickname, 'credit': prize.credit, 'price': prize.price, 'used': ticket.used, 'cleared': ticket.cleared, 'use_time': ticket.use_time.strftime('%Y-%m-%d %H:%M:%S'), 'clear_time': ticket.clear_time.strftime('%Y-%m-%d %H:%M:%S'), 'description': prize.description})
		d['tickets'] = list(reversed(ticket_list))
		return 

	if op == 'refresh_prize_list':
		tp = request.POST.get('type')
		if tp == 'cleared':
			tickets = tickets.filter(cleared=True)
		elif tp == 'uncleared':
			tickets = tickets.filter(cleared=False).filter(used=True)
		elif tp == 'unused':
			tickets = tickets.filter(used=False)
		d = {}
		remake_tickets(tickets, d)
		return HttpResponse(json.dumps(d))

	remake_tickets(tickets, rdata)

	if op == 'clear_money':
		money = 0
		for t in rdata['tickets']:
			ticket = PrizeTicket.objects.get(id=t['tid'])
			prize = Prize.objects.get(id=t['pid'])
			money += (int(ticket.used) - int(ticket.cleared)) * prize.price
			ticket.cleared = True
			ticket.clear_time = datetime.datetime.now()
			ticket.save()
		return HttpResponse(json.dumps({'money': money}))

	# 计算金额
	if not rdata['personal']:
		used = 0
		cleared = 0
		money = 0
		for t in rdata['tickets']:
			used += int(t['used'])
			cleared += int(t['cleared'])
			money += (int(t['used']) - int(t['cleared'])) * int(t['price'])
		rdata['total'] = len(rdata['tickets'])
		rdata['cleared'] = cleared
		rdata['uncleared'] = used - cleared
		rdata['unused'] = rdata['total'] - used
		rdata['money'] = money

	return render(request, 'prize_ticket.html', rdata)

def prize_add(request):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if not suser.admin_all:
		return render(request, 'permission_denied.html', {})

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
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if not suser.admin_all:
		return render(request, 'permission_denied.html', {})
	
	if op == 'add_store':
		jdata = {'result': 'ok'}
		username = request.POST.get('username')
		if username.isdigit() and len(username) == 10:
			jdata['result'] = '请勿使用清华学号'
		elif len(SUser.objects.filter(username=username)) > 0:
			jdata['result'] = '用户名已存在'
		else:
			nickname = request.POST.get('nickname')
			password = request.POST.get('password')
			pid_list = json.loads(request.POST.get('pid_list'))
			user = User.objects.create_user(username=username, password=password)
			suser = SUser.objects.create(username=username, nickname=nickname, uid=user.id, is_sample=0, is_store=1)
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
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
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

def prize_store(request):
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	if suser.admin_all:
		return render(request, 'permission_denied.html', {})
	
	if op == 'change_nickname':
		SUser.objects.filter(id=int(request.POST.get('sid'))).update(nickname=request.POST.get('nickname'))
		return HttpResponse(json.dumps({}))

	if op == 'get_prize_list':
		sid = int(request.POST.get('sid'))
		prizes = Prize.objects.all()
		prize_list = []
		for prize in prizes:
			prize_list.append({'pid': prize.id, 'title': prize.title, 'in': sid in json.loads(prize.store)})
		return HttpResponse(json.dumps({'prize_list': prize_list}))

	if op == 'renew_prize_for_store':
		sid = int(request.POST.get('sid'))
		pid_list = [int(pid) for pid in json.loads(request.POST.get('pid_list'))]
		manage_list = []
		for prize in Prize.objects.all():
			stores = json.loads(prize.store)
			exp_in = prize.id in pid_list
			pre_in = sid in stores
			if exp_in != pre_in:
				if exp_in:
					stores.append(sid)
				else:
					stores.remove(sid)
				prize.store = json.dumps(stores)
				prize.save()
		return HttpResponse(json.dumps({}))

	storepairs = []
	for store in SUser.objects.filter(is_store=True):
		d = {'store': store}
		prizes = []
		for prize in Prize.objects.all():
			prizestores = json.loads(prize.store)
			print(store,id, prizestores)
			if store.id in prizestores:
				prizes.append(prize)
		d['prizes'] = prizes
		storepairs.append(d)
	rdata['storepairs'] = storepairs
	rdata['prizes'] = Prize.objects.all()

	return render(request, 'prize_store.html', rdata)

def help_center(request):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	
	if suser.admin_all:
		helps = reversed(Help.objects.all())
	else:
		helps = reversed(Help.objects.filter(released=True))

	rdata['helps'] = helps
	return render(request, 'helps.html', rdata)

def tip(request, hid):
	# 验证身份
	if not request.user.is_authenticated:
		return Utils.redirect_login(request)
	rdata, op, suser = Utils.get_request_basis(request)
	
	helps = Help.objects.filter(id=int(hid))
	if len(helps) == 0:
		rdata['info'] = '帮助不存在'
	else:
		help = helps[0]
		if not suser.admin_all and not help.released:
			return render(request, 'permission_denied.html', {})

	if op == 'create':
		help = Help.objects.create(founder=suser.id, create_time=datetime.datetime.now())
		return HttpResponse(json.dumps({'hid': help.id}))

	if op == 'load':
		return HttpResponse(json.dumps({'title': help.title, 'content': help.content, 'attachment': help.attachment, 'released': help.released}))

	if op == 'save' or op == 'release':
		tip_string = json.loads(request.POST.get('tip'))
		title = tip_string['title']
		content = tip_string['html']
		attachment = tip_string['attachments']
		released = (op == 'release')
		help = Help.objects.filter(id=int(hid)).update(title=title, content=content, attachment=attachment, released=released, release_time=datetime.datetime.now())
		return HttpResponse(json.dumps({}))

	if op == 'delete':
		help.delete()
		return HttpResponse(json.dumps({}))

	return render(request, 'tip.html', rdata)
