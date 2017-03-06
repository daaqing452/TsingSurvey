# -*- coding: utf-8 -*-
import time

def username_to_password(username):
	return str((hash(username) ^ 3968766407) % 104939997)

def remake_questionaire(questionaire, qid_dict):
	d = {}
	d['id'] = questionaire.id
	d['create_time'] = questionaire.create_time

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