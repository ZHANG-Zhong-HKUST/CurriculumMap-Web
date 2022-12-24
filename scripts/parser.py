# print a json representation of courses information

import csv
import re
import json

def refine(s):
	return s

def clear_special(s):
	while(s.find(';')>-1):
		i=s.find(';')
		s='('+s[:i]+') OR ('+ s[i+1] +')'
	s = re.sub('\(.*for.*\)','',s)
	s = re.sub('\(.*prior.*\)','',s)
	s = re.sub('Grade .{1,2} or above in','',s)
	s = re.sub('grade .{1,2} or above in','',s)
	return s


def parse_inner(s):
	n = len(s)
	ret = []
	las = ''
	s=s+'     ';
	i = 0
	flag = 'AND'
	while(i<n):
		if(s[i]==' '):
			i+=1
			continue
		if (s[i]=='(' or s[i]=='[' or s[i]=='{'):
			tmp, j = parse_inner(s[i+1:])
			i = i+j+1
			ret.append(tmp)
		elif (s[i]==')' or s[i]==']' or s[i]=='}'):
			break
		elif (s[i:i+2] == 'OR' or s[i]=='/'):
			flag = 'OR'
			las = refine(las)
			if(las!=''):
				ret.append(las)
			las = ''
			if(s[i:i+2] == 'OR'):
				i+=1
		elif (s[i:i+3] == 'AND' or s[i]=='@' ):
			las = refine(las)
			if(las!=''):
				ret.append(las)
			las = ''

			if(s[i:i+3] == 'AND'):
				i+=3
		else:
			las = las+s[i]

		i+=1

	las = refine(las)
	if(las!=''):
		ret.append(las)

	if(len(ret)==0):
		return {}, i

	return {flag:ret}, i

def parse_req(s):
	'''
	return: (A OR B OR C) AND (D OR E OR F) AND G [[A, B, C],[D, E, F],[G]]
	'''
	s = clear_special(s)
	ret, i = parse_inner(s)
	return ret

def read_file(filename):
	ret = {}
	with open(filename, errors='ignore') as cfile:
		spamreader = csv.reader(cfile, delimiter=',', quotechar='|')
		'''
		[0]: course code
		[1]: name
		[2]: credits
		[3]: prerequisite
		[4]: exclusions
		[5]: corequisite
		[6]: co-list
		[10]: description
		'''
		for row in spamreader:
			# print(row)
			trow = {'code': row[0].replace(' ',''), 'name': row[1]};
			trow['pre'] = parse_req(row[3])
			trow['exc'] = parse_req(row[4])
			trow['cor'] = parse_req(row[5])
			ret[row[0].replace(' ','')]=trow
	return ret


filename = './courses.csv'

courses = read_file(filename)

json.dumps(courses)
print()

course_list = []

for i in courses.keys():
	course_list.append({'id':i, 'name':i})

json.dumps(course_list)

# print(parse_req('(MATH 1014 OR MATH 1020 OR MATH 1024) AND (PHYS 1111 OR PHYS 1112 OR PHYS 1312)'))
	#, '', 'CHEM 1010 OR CHEM 1020'