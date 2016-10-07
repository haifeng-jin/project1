insert  into location(city,country,state)values("College Station","United States","Texas");
insert  into location(city,country,state)values("Los Angeles","United States","California");
insert  into location(city,country,state)values("Orange","United States","California");
insert  into location(city,country,state)values("Polk","United States","Florida");
insert  into location(city,country,state)values("Duval","United States","Florida");
insert  into location(city,country,state)values("Knox","United States","Illinois");
insert  into location(city,country,state)values("Chicago","United States","Illinois");
insert  into location(city,country,state)values("Delmar","United States","Maryland");
insert  into location(city,country,state)values("Denton","United States","Maryland");
insert  into location(city,country,state)values("Changchun","China","Jilin");
insert  into location(city,country,state)values("Tonghua","China","Jilin");
insert  into location(city,country,state)values("Changsha","China","Hunan");
insert  into location(city,country,state)values("Zhuzhou","China","Hunan");
insert  into location(city,country,state)values("Wuhan","China","Hubei");
insert  into location(city,country,state)values("Xiaogan","China","Hubei");

insert  into relation (relation_name,relation_id)values("Family",1);
insert  into relation (relation_name,relation_id)values("Classmate",2);
insert  into relation (relation_name,relation_id)values("Friend",3);
insert  into relation (relation_name,relation_id)values("Colleague",4);

contact_id:65536~70534

export databse               mysqldump -u root -p mydb > mydb.sql   //cmd window
improt databse                  source mydb.sql  // mysql window mydb must exist