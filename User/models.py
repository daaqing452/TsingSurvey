# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class User(models.Model):
	name = models.CharField(max_length=16)
	pswd = models.CharField(max_length=32)
	student_id = models.CharField(max_lengt=16)
