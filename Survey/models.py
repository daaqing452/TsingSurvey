# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Questionaire(models.Model):
	status = models.IntegerField(default=0)
	create_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	update_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	founder = models.IntegerField(default=-1)
	title = models.CharField(max_length=128, default='')
	question_list = models.TextField(default='')
	comment = models.TextField(default='')

class Question(models.Model):
	qid = models.IntegerField()
	qtype = models.IntegerField()
	content = models.TextField()

class Answeraire(models.Model):
	qid = models.IntegerField()
	uid = models.IntegerField()
	update_time = models.DateTimeField(default='1970-01-01 00:00:00.000000')
	answer_list = models.TextField()

class Answer(models.Model):
	aid = models.IntegerField()
	uid = models.IntegerField()
	tid = models.IntegerField()
	answer = models.TextField()