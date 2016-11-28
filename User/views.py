# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext

# @csrf_protect
def login(request):
	test = "no"
	if 'username' in request.POST:
		test = "yes"
	return render(request, "register.html", {'test':test})