var express = require('express');
var app = express();
var db = require('./db');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

//search contacts  return name& phonoe
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
            connection.query("SELECT * FROM contact;", function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    response.statusCode = 500;
                    response.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                response.send({
                    result: 'success',
                    err:    '',
                    fields: fields,
                    json:   rows,
                    length: rows.length
                });
                connection.release();
            });
        }
    });
    //console.log('select name,phone_number from contact join (location,gender) on ( contact.location_id=location.location_id and contact.gender_id=gender.gender_id)  where location.state= '+String(state)+ ' and gender.gender_name= '+String(gender));
});



//info of relation_id
app.get('/rest/relation/:id', function(request, response) {
    var id=request.params.id;
    db.query('select relation_name from relation join (contact_relation) on (relation.relation_id=contact_relation.relation_id )  where contact_relation.contact_id=?',id, function(err, rows, fields) {
        if (err) throw err;
        var result=new Array();
        for (var i=0;i<rows.length;i++)
        {
            result[i]=rows[i].relation_name;
        }
        response.json(result);
        console.log('The solution is: ', rows);
    });
});


//info of one contact
app.get('/rest/:id', function(request, response) {

    var id=request.params.id;
    db.query('select * from contact join (location,gender) on (contact.location_id=location.location_id and contact.gender_id=gender.gender_id )  where contact.contact_id=?',id, function(err, rows, fields) {
        if (err) throw err;
        response.json(rows);
        console.log('The solution is: ', rows);
    });
    console.log('The solution is: ', "hahh");
});

//create a new contact
app.post('/rest', function(request, response) {

});

//update a contact
app.put('/rest/:id', function(request, response) {

});

//delete a contact
app.delete('/rest/:id', function(request, response) {

});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

//anything below this are examples.

//var db = require('./db');
//db.query('show tables;', function(err, rows, fields) {
//    if (err) throw err;
//
//    console.log('The solution is: ', rows);
//});
//db.end();

app.get('/ejstest/:id', function(request, response) {
    var drinks = [
        { name: request.query.name , drunkness: request.params.id },//name is the param follows the URL after "?", e.g. "/ejstest/2?name=Mary"
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    response.render('pages/ejs', {
        drinks: drinks,
        tagline: tagline
    });
});