'''
Created on Sep 30, 2016

@author: Tao
'''
import re
import pymysql
import itertools
def GeneratePhoneNumber():
    phoneNumber=[]
    for i in itertools.permutations([1,2,3,4,5,6,7,8,9]):
        if len(phoneNumber)<5000:phoneNumber.append(''.join(str(x) for x in i))
        else:
            break
    return phoneNumber
def ExtractFirstName(FirstNameFilePath):
    BoyFirstName=[]
    GirlFirstName=[]
    with open(FirstNameFilePath,'r') as f:
        for line in f:
            Names=re.split(r'\s+',line)
            BoyFirstName.append(Names[1])
            GirlFirstName.append(Names[2])
    return BoyFirstName,GirlFirstName
def ExtractLastName(LastNameFilePath):
    LastName=[]
    with open(LastNameFilePath,'r') as f:
        for line in f:
            Names=re.split(r'\s+',line)
            LastName.append(Names[0].capitalize())
    return LastName
def NameGenertate(BoyFirstName,GirlFirstName,LastName):
    BoyName=[]
    GirlName=[]
    for i in LastName:
        for j in BoyFirstName:
            BoyName.append(j+" "+i)
        for k in GirlFirstName:
            GirlName.append(k+" "+i)
    return BoyName,GirlName
def WriteFile(Names,OutputFilePath):
    with open(OutputFilePath,'w') as f:
        i=10
        while i<=len(Names):
            f.write('    '.join(name for name in Names[i-10:i]))
            f.write('\n')
            i+=10
    print("Done!")

def EmailGenerate(Name,Suffix):
    Email=[]
    for i in range(len(Name)):
        Email.append(Name[i]+"@"+Suffix[i%len(Suffix)]+".com")
    return Email
if __name__=="__main__":
    company=['google','facebook','linkedin','apple','amazon','huawei','tecent','alibaba','baidu','lenovo']
    university=['tamu','stanford','usc','uscd','ucla','nyu','uci','ucr','bupt','thu']
    #countries=['United States','China']
   #states=['Texas','California','Florida','Illinois','Maryland','Jiangxi','JiLin','Hunan','Hubei','Hebei']
    #cities=['Austin','College Station','los Angeles','Orange','Duval','Polk','Knox','Chicago','Delmar','Denton','Nanchang','Shangrao','Changchun','Tonghua','Changsha','Zhuzhou','Wuhan','Xiaogan','Shijiazhuang','Tangshan']
    BoyFirstName,GirlFirstName=ExtractFirstName("FirstName.txt")
    LastName=ExtractLastName("LastName.txt")
    BoyName,GirlName=NameGenertate(BoyFirstName, GirlFirstName, LastName)
    Email=EmailGenerate(BoyName+GirlName, university+company)
    PhoneNumber=GeneratePhoneNumber()
    #WriteFile(BoyName, "BoyName.txt")
    #WriteFile(GirlName, "GirlName.txt")
    #WriteFile(Email, "Email.txt")
    #WriteFile(PhoneNumber, "PhoneNumber.txt")
    i=1998
    conn=pymysql.connect(user='root',passwd='123456',host='127.0.0.1',db='mydb')
    cur=conn.cursor()
    while i<2500:
        cmd="insert into contact (name,phone_number,email,location_id,gender_id) values('{0}','{1}','{2}',{3},{4})".format(GirlName[i],PhoneNumber[i+2500],Email[i+2500],(i+1)%20+1,2)
        print(cmd)
        cur.execute(cmd)
        i+=1
    conn.commit()
    cur.close()
    conn.close()
    print('done')
    
    
