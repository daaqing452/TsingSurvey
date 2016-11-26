# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
import datetime

def test(request, arg0, arg1):
    now = datetime.datetime.now()
    html = "            \
        <html><body>    \
        <h1> %s </h1>     \
        <h3> %s </h3>     \
        now time is %s  \
        </body></html>  \
    " % (arg0, arg1, now)
    return HttpResponse(html)
