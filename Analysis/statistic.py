# -*- coding: utf-8 -*-
import math

# 统计平均数
def average(a):
	return sum(a) / len(a)

# 统计每个选项的数目
def count(a, len):
	l = [0 for i in range(len)]
	def plus(x): l[x] += 1
	map(plus, [c for b in a for c in b])
	return l