# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class SUser(models.Model):
	uid = models.IntegerField()
	student_id = models.CharField(max_length=32)