from docx import Document
import json
import re

qstring = None
options = None
options_mat = None
s_type = None
index = None
title = None

def record(s_type_new):
	global qstring
	global s_type
	global index
	global options
	global options_mat
	global title

	if s_type != 0:
		if s_type == 6:
			print(options_mat)
			options = []
			n_set = len(options_mat[0])
			cnt = 0
			for i in range(n_set):
				for j in range(len(options_mat[1])):
					d = {'index': cnt, 'text': options_mat[0][i], 'image': options_mat[1][j], 'option_type': 0}
					options.append(d)
					cnt += 1
			options_mat = [[],[]]

		d = {'s_type': s_type, 'index': index, 'title_html': title, 'title': title, 'jump_to': False, 'jump_from': False, 'must_answer': True, 'n_option': len(options), 'options': options}
		
		if s_type == 2:
			d['min_select'] = ''
			d['max_select'] = ''

		if s_type == 6:
			d['n_set'] = n_set

		if s_type == 8:
			must_answer = False

		# 清空
		qstring.append(d)
		options = []
		options_mat = [[],[]]
		if s_type != 8: index += 1
	
	s_type = s_type_new


def load_survey(filepath):
	global qstring
	global s_type
	global index
	global options
	global options_mat
	global title

	qstring = []
	options = []
	options_mat = [[],[]]
	s_type = 0
	index = 0
	title = ''

	document = Document(filepath)
	line_cnt = 0
	for paragraph in document.paragraphs:
		line_cnt += 1
		text = paragraph.text
		# print(line_cnt, text)
		# continue

		# 大标题
		if re.match('[一二三四五六七八九十][、．\.]', text) is not None:
			record(8)
			title = text
			continue

		# 问题
		g = re.match('\d+[、．\.](.*)', text)
		if g is not None:
			text = g.group(1)

			# 多选题
			if re.search('多选', text) is not None:
				record(2)
				title = text
				continue
			# 填空题
			if re.search('___', text) is not None:
				record(7)
				title = ''
				sub_text = re.sub('_{3,}', '__y__', text)
				blanks = sub_text.split('__y__')
				for i in range(len(blanks)-1):
					d = {'index': i, 'text': blanks[i], 'image': '', 'option_type': 0}
					options.append(d)
				continue
			# 排序题
			if re.search('排序', text) is not None:
				record(5)
				title = text
				continue

			# 其他题先默认单选？
			record(1)
			title = text

		# 矩阵题
		if re.match('\[矩阵行\]', text) is not None:
			s_type = 6
			m_type = 0
		if re.match('\[矩阵列\]', text) is not None:
			s_type = 6
			m_type = 1
		
		# 选项
		while True:
			g = re.search('([A-Z])[、．\.]\s*(\S+)', text)
			if g is None: break
			if s_type == 6:
				options_mat[m_type].append(g.group(2))
			else:
				d = {'index': g.group(1), 'text': g.group(2), 'image': '', 'allow_filled': False, 'option_type': 0}
				options.append(d)
			text = text[g.span()[1]:]

	record(0)
	# print(qstring)
	return json.dumps(qstring)
