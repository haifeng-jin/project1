var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

//search contacts
app.get('/rest', function(request, response) {

});

//info of one contact
app.get('/rest/:id', function(request, response) {

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

var db = require('./db');
db.query('show tables;', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows);
});
db.end();

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
