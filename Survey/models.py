# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Questionaire(models.Model):
	status = models.IntegerField(default=0)
	update_time = models.DateTimeField(default='1970-01-01 00:00:00')
	title = models.CharField(max_length=64)
	founder = models.IntegerField()
	question_list = models.TextField()
	user_list = models.TextField()
	comment = models.TextField(default='')

class Question(models.Model):
	qid = models.IntegerField()
	qtype = models.IntegerField()
	content = models.TextField()

class Answeraire(models.Model):
	qid = models.IntegerField()
	uid = models.IntegerField()
	update_time = models.DateTimeField(default='1970-01-01 00:00:00')
	answer_list = models.TextField()

class Answer(models.Model):
	aid = models.IntegerField()
	uid = models.IntegerField()
	tid = models.IntegerField()
	answer = models.TextField()