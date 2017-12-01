# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Prize(models.Model):
	title = models.CharField(max_length=128, default='')
	description = models.TextField(default='')
	credit = models.IntegerField(default=0)
	expired_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')

class PrizeGot(modesl.Model):
	uid = models.IntegerField(default=-1)
	pid = models.IntegerField(default=-1)
	count = models.IntegerField(default=0)
	used = models.BooleanField(default=0)