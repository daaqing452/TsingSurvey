# -*- coding: utf-8 -*-
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

def remakeq(questionaire, qid_dict, editable):
		d = {}
		d['id'] = questionaire.id
		d['create_time'] = questionaire.create_time
		d['editable'] = editable

		if questionaire.title == '':
			d['title'] = '（无标题）'
		else:
			d['title'] = questionaire.title

		if not str(questionaire.id) in qid_dict:
			d['fill'] = ''
		elif qid_dict[str(questionaire.id)] == 0:
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