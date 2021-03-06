# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Questionaire(models.Model):
	status = models.IntegerField(default=0)
	create_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	update_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	release_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	close_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	founder = models.CharField(max_length=64, default='')
	title = models.CharField(max_length=128, default='')
	questions = models.TextField(default='')
	comment = models.TextField(default='')
	public = models.BooleanField(default=False)
	credit = models.IntegerField(default=-1)
	report_template = models.TextField(default='')
	sample_list_id = models.IntegerField(default=-1)
	# report_id = models.IntegerField(default=-1)

class Answeraire(models.Model):
	qid = models.IntegerField()
	username = models.CharField(max_length=64, default='')
	submitted = models.BooleanField(default=0)
	load_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	submit_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	ip = models.CharField(max_length=64, default='unknown')
	agent = models.CharField(max_length=1024, default='unknown')
	os = models.CharField(max_length=64, default='unknown')
	answers = models.TextField(default='')

class Report(models.Model):
	qid = models.IntegerField()
	report = models.TextField()
