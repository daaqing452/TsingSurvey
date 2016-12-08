# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Questionaire(models.Model):
	question_list = models.CharField(max_length=32)

class Question(models.Model):
	qid = models.IntegerField()
	qtype = models.IntegerField()
	content = models.CharField(max_length=32)

class Answer(models.Model):
	qid = models.IntegerField()
	answer = modelsCharField(max_length=32)
