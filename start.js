var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, "WebClient/")));
app.use(express.static(path.join(__dirname, "Graphics/")));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'WebClient/index.html'));
});

app.listen(80);