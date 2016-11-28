# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class SUser(models.Model):
	student_id = models.CharField(max_length=16)
	u_id = models.IntegerField()
