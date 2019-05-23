# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from SUser.models import *
from Survey.models import *
import time
import collections
import hashlib
import json

MAGIC_NUMBER = 456321887

def redirect_login(request, login_url='/login/'):
	request.session['last_url'] = request.get_full_path()
	return HttpResponseRedirect(login_url)

def uglyDecrypt(s):
	t = ''
	for i in range(0, len(s), 7):
		x = 0
		tt = ''
		for j in range(6, -1, -1):
			y = ord(s[i+j]) - 97
			x = x * 26 + y
		x = x ^ MAGIC_NUMBER
		for i in range(3):
			y = x % 1000
			if y > 0: tt = chr(y) + tt
			x = x // 1000
		t += tt
	return t

# -2 sample list cannot find
# -1 questionaire cannot find
#  0 not allowed
#  1 allowed, not fill
#  2 allowed, filled
#  3 allowed, filled, submitted

def check_allow(suser, questionaire=None, qid=None):
	if questionaire == None:
		questionaires = Questionaire.objects.filter(id=qid)
		if len(questionaires) == 0: return -1
		questionaire = questionaires[0]
	if not questionaire.public and questionaire.founder != suser.username:
		sample_lists = SampleList.objects.filter(id=questionaire.sample_list_id)
		if len(sample_lists) == 0: return -2
		sample_list = json.loads(sample_lists[0].sample_list)
		if not suser.id in sample_list: return 0
	return 1

def check_fill(suser, questionaire):
	answeraires = Answeraire.objects.filter(qid=questionaire.id, username=suser.username)
	if len(answeraires) == 0: return 1
	answeraire = answeraires[0]
	return (3 if answeraire.submitted else 2);

def remakeq(suser, questionaire, editable):
	d = {}
	d['id'] = questionaire.id
	d['create_time'] = questionaire.create_time
	d['editable'] = editable
	
	d['founder'] = '未找到'
	founders =  SUser.objects.filter(username=questionaire.founder)
	if len(founders) > 0:
		d['founder'] = founders[0].username

	if questionaire.title == '':
		d['title'] = '（无标题）'
	else:
		d['title'] = questionaire.title

	fill = check_fill(suser, questionaire)
	if fill == 1:
		d['fill'] = '尚未填写'
	elif fill == 2:
		d['fill'] = '填写未提交'
	elif fill == 3:
		d['fill'] = '已提交'
	else:
		d['fill'] = ''

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
	elif questionaire.status == 5:
		d['status'] = '审核未通过'
	else:
		d['status'] = '错误'
	
	return d

def get_request_basis(request):
	rdata = {}
	op = request.POST.get('op', '')
	suser = None
	if request.user.is_authenticated:
		rdata['suser'] = suser = SUser.objects.filter(username=request.user.username)[0]
	return rdata, op, suser

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

def hash_md5(s):
	h1 = hashlib.md5()
	h1.update(s.encode(encoding='utf-8'))
	return h1.hexdigest()
