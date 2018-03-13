# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from SUser.models import *
import time
import collections

def redirect_login(request, login_url='/login/'):
	request.session['last_url'] = request.get_full_path()
	return HttpResponseRedirect(login_url)

def username_to_password(username):
	h = 0
	username = str(username)
	for c in username: h = h * ord(c) % 10499997
	return str(h)

def check_fill(qid, qid_dict):
	if not str(qid) in qid_dict:
		return -1
	elif qid_dict[str(qid)] == 0:
		return 0
	else:
		return 1

def check_questionaire_in_index(user, questionaire, qid_dict):
	return not (not user.is_staff and check_fill(questionaire.id, qid_dict) != 1 and (questionaire.status == 2) or  (questionaire.status == 3))

def remakeq(questionaire, qid_dict, editable):
		d = {}
		d['id'] = questionaire.id
		d['create_time'] = questionaire.create_time
		d['editable'] = editable
		
		d['founder'] = '已移除'
		founders =  User.objects.filter(id=questionaire.founder)
		if len(founders) > 0:
			d['founder'] = founders[0].username

		if questionaire.title == '':
			d['title'] = '（无标题）'
		else:
			d['title'] = questionaire.title

		filled = check_fill(questionaire.id, qid_dict)
		if filled == -1:
			d['fill'] = ''
		elif filled == 0:
			d['fill'] = '尚未填写'
		else:
			d['fill'] = '已填写'

		if questionaire.status == 0:
			d['status'] = '尚未发布'
		elif questionaire.status == 1:
			d['status'] = '已发布'
		elif questionaire.status == 2:
			d['status'] = '已关闭'
		elif questionaire.status == 3:
			d['status'] = '已生成报告'
		elif questionaire.status == 4:
			d['status'] = '待审核'
		else:
			d['status'] = '错误'
		
		return d

def upload_file(raw):
	f_path = 'media/' + time.strftime('%Y%m%d%H%M%S') + '-' + raw.name
	f = open(f_path, 'wb')
	for chunk in raw.chunks():
		f.write(chunk)
	f.close()
	return f_path

def count(a):
	c = collections.Counter(a)
	return dict(c)