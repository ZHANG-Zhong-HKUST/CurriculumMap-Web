# print a json representation of courses information

import csv
import re
import json

def refine(s):
	if (re.match('^[A-Z]{4}[0-9]{4}[H]{0,1}$',s)==None):
		s=''
	s = re.sub('\b[A-Z]*?[a-z][A-Z]*?\b','',s)
	return s

def clear_special(s):
	while(s.find(';')>-1):
		i=s.find(';')
		s='('+s[:i]+') OR ('+ s[i+1:] +')'
	s = re.sub(r'\(.*?for.*?\)','',s)
	s = re.sub(r'\(.*?prior.*?\)','',s)
	s = re.sub(r'\(.*?For.*?\)','',s)
	s = re.sub(r'[oO]ne of', 'OR', s)
	s = re.sub('Grade .{1,2} or above in','',s)
	s = re.sub(r'grade .{1,2} or above in','',s)
	s = re.sub(r'([A-Z]{4} [0-9]{4}[H]{0,1})\s*or\s*([A-Z]{4} [0-9]{4}[H]{0,1})','\g<1> OR \g<2>',s)
	s = re.sub(r'\b[A-Z]*?[a-z]+?[A-Z]*?\b','',s)
	s = re.sub(r'\b[A-Za-z\-]{5,}\b','',s)
	# print(s)
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
		elif (s[i:i+2] == 'OR' or s[i]=='/' or s[i]=='@'):
			if(s[i:i+2] == 'OR'):
				flag = 'OR'
			las = refine(las)
			if(len(las)==8 or len(las)==9):
				ret.append(las)
			las = ''
			if(s[i:i+2] == 'OR'):
				i+=1
		elif (s[i:i+3] == 'AND' or s[i]=='/' or s[i]=='@'):
			las = refine(las)
			if(len(las)==8 or len(las)==9):
				ret.append(las)
			las = ''

			if(s[i:i+3] == 'AND'):
				i+=3
		else:
			las = las+s[i]

		i+=1

	las = refine(las)
	if(len(las)==8 or len(las)==9):
		ret.append(las)

	if(len(ret)==0):
		return {}, i

	return {flag:ret}, i

def parse_req(s):
	'''
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

# print(parse_req("One of ISOM 2500@ MATH 2411 or MATH 3423"))