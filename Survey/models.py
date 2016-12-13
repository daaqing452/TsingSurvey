# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Questionaire(models.Model):
	question_list = models.TextField()

class Question(models.Model):
	qid = models.IntegerField()
	qtype = models.IntegerField()
	content = models.TextField()

class Answer(models.Model):
	uid = models.IntegerField()
	tid = models.IntegerField()
	answer = models.TextField()
