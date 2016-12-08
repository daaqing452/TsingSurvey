# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
import json

def create_survey(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	if not request.user.is_staff:
		return HttpResponseRedirect('../index/')
	op = request.POST.get('op')

	return render(request, 'create_survey.html', {})

def survey(request, hash):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	op = request.POST.get('op')

	return render(request, 'survey.html', {})

def bonus(request):
	# 验证身份
	if not request.user.is_authenticated():
		return HttpResponseRedirect('../login/')
	op = request.POST.get('op')

	return render(request, 'bonus.html', {})