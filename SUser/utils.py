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