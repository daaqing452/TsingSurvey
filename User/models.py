# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class User(models.Model):
	student_id = models.CharField(max_length=16)
	name = models.CharField(max_length=16)
	password = models.CharField(max_length=32)
