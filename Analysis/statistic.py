# -*- coding: utf-8 -*-
import math
import collections

# 统计平均数
def average(a):
	return sum(a) / len(a)

# 统计每个选项的数目
def count(a):
	c = collections.Counter(a)
	return dict(c)