# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Prize(models.Model):
	title = models.CharField(max_length=128, default='')
	description = models.TextField(default='')
	credit = models.IntegerField(default=0)
	price = models.IntegerField(default=0)
	expire_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	store = models.TextField(default='[]')

class PrizeTicket(models.Model):
	uid = models.IntegerField(default=-1)
	pid = models.IntegerField(default=-1)
	oid = models.IntegerField(default=-1)
	count = models.IntegerField(default=0)
	used = models.BooleanField(default=0)
	cleared = models.BooleanField(default=0)
	use_status = models.IntegerField(default=0)
	exchange_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	use_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	clear_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')

class Help(models.Model):
	title = models.CharField(max_length=128, default='')
	content = models.TextField(default='')
	attachment = models.TextField(default='[]')
	founder = models.IntegerField(default=-1)
	released = models.BooleanField(default=0)
	create_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	release_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')