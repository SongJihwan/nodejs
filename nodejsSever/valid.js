var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'java80',
  password : '1111',
  database : 'karaoke'
});

var email = [];

app.listen(3200, function() {
	console.log('app listening on port 3200!')
	connection.connect()
	connection.query('SELECT EMAIL FROM MEMBER', function(err, rows, fields) {
		if (err) throw err
		for (var i in rows) {
			email.push(rows[i].EMAIL)
		}
	});
	connection.end()
});

app.get('/valid', function(req, res) {
	var emailValid = {};
	for (var i in email) {
		if (email[i] == req.query.email) {
			emailValid = "false"
			break
		} else {
			emailValid = "true"
		}
	}
	
	var check = []
	check.push(emailValid)
	res.header('Access-Control-Allow-Origin', "*")     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST')
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept')
    res.send(check)
});
