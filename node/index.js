var express = require('express');
var app = express();
var db = require('./db');
var bodyParser = require("body-parser");
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

//search contacts  gender&state return all
app.get('/rest', function(request, response) {
    db.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            response.statusCode = 503;
            response.send({
                result: 'error',
                err:    err.code
            });
        } else {
            // query the database using connection
            var firstname=request.query.firstname;
            var lastname=request.query.lastname;
            var name=String(firstname)+" "+String(lastname);
            var sql = "select * from contact join (location,gender) on (contact.location_id=location.location_id and contact.gender_id=gender.gender_id ) where contact.name= \""+String(name)+"\" ;";

            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    response.statusCode = 500;
                    response.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                response.send(
                    rows
                );
                connection.release();
            });
        }
    });
});


app.get('/rest/all', function(request, response) {
    db.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            response.statusCode = 503;
            response.send({
                result: 'error',
                err:    err.code
            });
        } else {
            // query the database using connection

            var sql = "select * from contact join (location,gender) on (contact.location_id=location.location_id and contact.gender_id=gender.gender_id ) ;";
            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    response.statusCode = 500;
                    response.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                response.send(
                    rows
                );
                connection.release();
            });
        }
    });
});

//info of video
app.get('/rest/video/:id', function(request, response) {
    var id=request.params.id;
    db.query('select path from video where contact_id=?;',id, function(err, rows, fields) {
        if (err) throw err;
        var result=[];
        for (var i=0;i<rows.length;i++)
        {
            result[i]=rows[i].path;
        }
        response.json(result);
    });
});

//info of sound
app.get('/rest/sound/:id', function(request, response) {
    var id=request.params.id;
    db.query('select path from sound where contact_id=?;',id, function(err, rows, fields) {
        if (err) throw err;
        var result=[];
        for (var i=0;i<rows.length;i++)
        {
            result[i]=rows[i].path;
        }
        response.json(result);
    });
});

//info of photo
app.get('/rest/photo/:id', function(request, response) {
    var id=request.params.id;
    db.query('select path from photo where contact_id=?;',id, function(err, rows, fields) {
        if (err) throw err;
        var result=[];
        for (var i=0;i<rows.length;i++)
        {
            result[i]=rows[i].path;
        }
        response.json(result);
    });
});

//info of relation_id
app.get('/rest/relation/:id', function(request, response) {
    var id=request.params.id;
    db.query('select relation_name from relation join (contact_relation) on (relation.relation_id=contact_relation.relation_id )  where contact_relation.contact_id=?',id, function(err, rows, fields) {
        if (err) throw err;
        var result=[];
        for (var i=0;i<rows.length;i++)
        {
            result[i]=rows[i].relation_name;
        }
        response.json(result);
    });
});


//info of one contact
app.get('/rest/:id', function(request, response) {

    var id=request.params.id;
    db.query('select * from contact join (location,gender) on (contact.location_id=location.location_id and contact.gender_id=gender.gender_id )  where contact.contact_id=?',id, function(err, rows, fields) {
        if (err) throw err;
        response.json(rows);
    });
});








function CreateContact(request,response)
{
    db.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            response.statusCode = 503;
            response.send({
                result: 'error',
                err:    err.code
            });
        } else {
            // query the database using connection
            var state=request.body.state;
            var gender=request.body.gender;
            if(String(gender)=="Male")gender=1;
            else gender=2;
            var name=String(request.body.name);
            var phone_number=request.body.phone_number;
            var email=request.body.email;
            var relation=request.body.relation;
            if(String(relation)=="Family")relation=1;
            else if(String(relation)=="Classmate")relation=2;
            else  if(String(relation)=="Friend")relation=3;
            else relation=4;
            var country=request.body.country;
            var city=request.body.city;
            var sql = "select * from location  where location.state= \""+String(state)+ "\" and location.country= \""+String(country)+"\" and location.city= \""+String(city)+"\" ;";
            var location_sql="insert  into location(city,country,state)values(\""+String(city)+"\""+",\""+String(country)+"\""+",\""+String(state)+"\" );"
            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    response.statusCode = 500;
                    response.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                //response.send(
                //    rows
                //);
                if(rows.length==0)
                {
                    //response.send("suceess");
                    connection.query(location_sql,function(err,rows1,fields){
                        if(err)console.error(err);
                        var contact_sql="insert into contact(name,phone_number,email,location_id,gender_id)values(\""+String(name)+"\""+",\""+String(phone_number)+"\""+",\""+String(email)+"\""+","+String(rows1.insertId)+","+String(gender)+");";
                        connection.query(contact_sql, function (err,rows2,fields) {
                            if(err)console.error(err);
                            //response.send(rows2);
                            var relation_sql="insert into contact_relation (contact_id,relation_id) values ("+String(rows2.insertId)+","+String(relation)+");";
                            connection.query(relation_sql, function (err,row3,fields) {
                                if(err)console.log(err);
                                response.send(row3);
                            })
                        })

                    })
                }
                else
                {
                    var contact_sql="insert into contact(name,phone_number,email,location_id,gender_id)values(\""+String(name)+"\""+",\""+String(phone_number)+"\""+",\""+String(email)+"\""+","+String(rows[0].location_id)+","+String(gender)+");";
                    connection.query(contact_sql, function (err,rows2,fields) {
                        if(err)console.error(err);
                        var relation_sql="insert into contact_relation (contact_id,relation_id) values ("+String(rows2.insertId)+","+String(relation)+");";
                        connection.query(relation_sql, function (err,row3,fields) {
                            if(err)console.log(err);
                            response.send(row3);
                        })
                    })
                }
                connection.release();
            });
        }
    });
}





//create a new contact
app.post('/rest', function(request, response) {
    CreateContact(request,response);
});



function DeleteTable(request,response,id)
{
    db.getConnection(function(err, connection) {
        var relation_sql = "delete from contact_relation where contact_id = " + String(id) + ";";
        var photo_sql = "delete from photo where contact_id = " + String(id) + ";";
        var sound_sql = "delete from sound where contact_id = " + String(id) + ";";
        var contact_sql = "delete from contact where contact_id = " + String(id) + ";";
        connection.query(relation_sql, relation_query);
        function relation_query(err, rows, fields){
            if (err)console.log(err);
            connection.query(photo_sql, photo_query);
        }
        function photo_query(err, rows1, fields) {
            if (err)console.log(err);
            connection.query(sound_sql, sound_query);
        }
        function sound_query(err, rows2, fields) {
            if (err)console.log(err);
            connection.query(contact_sql, contact_query);
        }
        function contact_query(err, rows3, fields) {
            if (err)console.log(err);
        }
    });
}

//update a contact
app.put('/rest', function(request, response) {
    var id =request.body.contact_id;
    DeleteTable(request,response,id);
    CreateContact(request,response);
});

//delete a contact
app.delete('/rest/:id', function(request, response) {
    var id=request.params.id;
   DeleteTable(request,response,id);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

