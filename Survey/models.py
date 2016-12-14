# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Questionaire(models.Model):
	enable = models.BooleanField(default=1)
	update_time = models.DateTimeField()
	title = models.CharField(max_length=64)
	founder = models.IntegerField()
	question_list = models.TextField()
	comment = models.TextField()

class Question(models.Model):
	qid = models.IntegerField()
	enable = models.BooleanField(default=1)
	qtype = models.IntegerField()
	content = models.TextField()
	dependency = models.TextField()

class Answeraire(models.Model):
	qid = models.IntegerField()
	uid = models.IntegerField()
	update_time = models.DateTimeField()
	answer_list = models.TextField()

class Answer(models.Model):
	aid = models.IntegerField()
	uid = models.IntegerField()
	tid = models.IntegerField()
	answer = models.TextField()