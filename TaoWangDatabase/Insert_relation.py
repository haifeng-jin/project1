import pymysql

i=65536
conn=pymysql.connect(user='root',passwd='123456',host='127.0.0.1',db='mydb')
cur=conn.cursor()
while i<66536:
   cmd="insert into contact_relation (contact_id,relation_id) values({0},{1})".format(i,((i+1)%4)+1)
   print(cmd)
   cur.execute(cmd)
   i+=1
conn.commit()
cur.close()
conn.close()
print('done')
