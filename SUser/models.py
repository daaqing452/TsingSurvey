# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class SUser(models.Model):
	uid = models.IntegerField()
	username = models.CharField(max_length=32)
	is_sample = models.BooleanField(default=1)
	credit = models.IntegerField(default=0)
	qid_list = models.TextField(default='')