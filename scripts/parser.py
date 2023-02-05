# print a json representation of courses information

import csv
import re
import json

def refine(s):
	if (re.match('^[A-Z]{4}[0-9]{4}[A-Z]{0,1}$',s)==None):
		s=''
	s = re.sub('\b[A-Z]*?[a-z][A-Z]*?\b','',s)
	return s

def clear_special(s):
	while(s.find(';')>-1):
		i=s.find(';')
		s='('+s[:i]+') OR ('+ s[i+1:] +')'

	s = re.sub(r'\([A-Za-z\-\s]?for[A-Za-z\-\s]?\)','',s)
	s = re.sub(r'\([A-Za-z\-\s]?prior[A-Za-z\-\s]?\)','',s)
	s = re.sub(r'\([A-Za-z\-\s]?For[A-Za-z\-\s]?\)','',s)
	s = re.sub(r'[oO]ne of', 'OR', s)
	s = re.sub(r'[Gg]rade .{1,2} or above in','OR',s)
	s = re.sub(r'([A-Z]{4} [0-9]{4}[H]{0,1})\s*[Oo]r\s*([A-Z]{4} [0-9]{4}[H]{0,1})','\g<1> OR \g<2>',s)
	s = re.sub(r'([A-Z]{4} [0-9]{4}[H]{0,1})\s*[Aa]nd\s*([A-Z]{4} [0-9]{4}[H]{0,1})','\g<1> AND \g<2>',s)
	s = re.sub(r'\b[A-Z]*?[a-z]+?[A-Z]*?\b','',s)
	s = re.sub(r'\b[A-Za-z\-]{5,}\b','',s)
	s = re.sub(r'\b[A-Za-z\-]{1}\b','',s)
	s = re.sub(r'\(\s*?\)','',s)
	# print(s)
	return s


def parse_inner(s, isOut):
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
			tmp, j = parse_inner(s[i+1:], False)
			i = i+j+1
			if(len(tmp)>0):
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

	if(len(ret)==1 and ((isOut == False) or (type(ret[0]) is not str))):
		return ret[0],i

	nret = []

	for k in range(len(ret)):
		if (type(ret[k])is not str):
			if (list(ret[k].keys())[0]==flag):
				for j in ret[k][flag]:
					nret.append(j)
			else:
				nret.append(ret[k])
		else:
			nret.append(ret[k])

	return {flag:nret}, i

def parse_req(s):
	'''
	'''
	s = clear_special(s)
	ret, i = parse_inner(s, True)
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
			trow = {'code': row[0].replace(' ',''), 'name': row[1].replace('@',','), 'des':row[10].replace('@',','),
					'cre': row[2].replace('@',','), 'tpre': row[3].replace('@',','), 'texc': row[4].replace('@',','), 'tcor': row[5].replace('@',',')};
			trow['pre'] = parse_req(row[3])
			trow['exc'] = parse_req(row[4])
			trow['cor'] = parse_req(row[5])
			ret[row[0].replace(' ','')]=trow
	return ret


filename = './courses.csv'

courses = read_file(filename)

f = open('courses.json','w')
f.write(json.dumps(courses))

# course_list = []

# for i in courses.keys():
# 	course_list.append({'id':i, 'name':i})



# f = open('course_list.json','w')
# f.write(json.dumps(course_list))

print(parse_req("COMP 2011"))