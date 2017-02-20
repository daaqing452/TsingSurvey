# -*- coding: utf-8 -*-


def username_to_password(username):
	return str((hash(username) ^ 3968766407) % 104939997)


def remake_questionaire(questionaire, qid_dict):
	d = {}
	d['id'] = questionaire.id
	
	if questionaire.title == '':
		d['title'] = '（No title）'
	else:
		d['title'] = questionaire.title

	if not str(questionaire.id) in qid_dict:
		d['fill'] = ''
	elif qid_dict[str(questionaire.id)] == 0:
		d['fill'] = 'Not filled'
	else:
		d['fill'] = 'Filled'
	
	if questionaire.status == 0:
		d['status'] = 'Not released'
	elif questionaire.status == 1:
		d['status'] = 'Released'
	elif questionaire.status == 2:
		d['status'] = 'Finish'
	elif questionaire.status == 3:
		d['status'] = 'Report'
	else:
		d['status'] = 'Error'
	
	return d
