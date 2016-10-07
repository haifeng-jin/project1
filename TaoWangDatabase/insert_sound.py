import pymysql
i=1
j=70000
conn=pymysql.connect(user='root',passwd='123456',host='127.0.0.1',db='mydb')
cur=conn.cursor()
while i<42:
   cmd="insert into sound (path,sound_id,contact_id) values('{0}',{1},{2})".format((4-len(str(i)))*'0'+str(i),i,j)
   print(cmd)
   cur.execute(cmd)
   i+=1
   j-=1
conn.commit()
cur.close()
conn.close()
print('done')
