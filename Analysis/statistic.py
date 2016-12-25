# -*- coding: utf-8 -*-
import math

def dict_add(d, key, value):
	if not key in d:
		d[key] = 0
	d[key] += value

# 统计平均数
def average(a):
	return sum(a) / len(a)

# 统计每个选项的数目
def count(a):
	d = {}
	map(lambda x: dict_add(d, x, 1), [c for b in a for c in b])
	return d