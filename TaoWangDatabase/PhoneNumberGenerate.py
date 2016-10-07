'''
Created on Sep 30, 2016

@author: Tao
'''
import itertools
def GeneratePhoneNumber():
    phoneNumber=[]
    for i in itertools.permutations([1,2,3,4,5,6,7,8,9]):
        if len(phoneNumber)<5000:phoneNumber.append(''.join(str(x) for x in i))
        else:
            break
    return phoneNumber


