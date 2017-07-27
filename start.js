var express = require('express');
var app = express();
var commands = require("./src/commands.js");
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var loki = require("lokijs");

global.random = function (min, max) {
	return Math.floor(Math.random() * max) + min;
};

function onExit(doExit, err) {
    if ("db" in global) {
		global.db.saveDatabase(function () {
			global.db.close();
			if (err)
				console.log(err.stack);
			if (doExit)
				process.exit();
		});
	}
}

process.on('exit', onExit.bind(null, false));

process.on('SIGINT', onExit.bind(null, true));

process.on('uncaughtException', onExit.bind(null, true));

global.db = new loki('proelium.db', {
	autoload: true,
	autoloadCallback : databaseInitialize,
	autosave: true, 
	autosaveInterval: 4000
});

function databaseInitialize() {
	var mail = db.getCollection("mail");
	var users = db.getCollection("users");
	var games = db.getCollection("games");
	if (users === null) {
		users = db.addCollection("users");
	}
	
	if (mail === null) {
		mail = db.addCollection("mail");
	}
	
	if (games === null) {
		games = db.addCollection("games");
	}
	
	process.on("exit", function () {
		db.saveDatabase();
	});
	
	ready();
}

//Database locked and loaded
function ready() {
	global.IO = io;
	
	//Google client id, public
	var googleClientId = "354831220610-qirvi2r1ceb9dbpgi9jh15s926t49rue.apps.googleusercontent.com";
	
	//Do google oAuth
	var GoogleAuth = require('google-auth-library');
	var auth = new GoogleAuth;
	var client = new auth.OAuth2(googleClientId, '', '');
	global.Google = {clientId: googleClientId, client: client, auth: auth};
	
	var Proelium = require(path.join(__dirname, "src/Proelium.js"));
	
	Proelium.exit = function () {
		onExit.bind(null, false)();
	};
	
	global.Proelium = Proelium;
	
	var games = db.getCollection("games").find({active: true});
	
	for (var i in games) {
		Object.assign(games[i], global.Proelium.game.prototype);
		Object.assign(games[i].map, global.Proelium.map.prototype);
		global.Proelium.nation.list(games[i].nations);
	}
	
	global.Proelium.games = games;
	
	global.Proelium.game.begin();
	
	app.use(express.static(path.join(__dirname, "WebClient/")));
	app.use(express.static(path.join(__dirname, "Graphics/")));
	app.use(express.static(path.join(__dirname, "templates/")));
	
	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname, 'WebClient/index.html'));
	});
	
	http.listen(80, function(){
		console.log('listening on *:80');
	});
	
	var players = [];
	
	
	io.on('connection', function(socket) {
		socket.on("login", function (data) {
			var player = new Proelium.player(socket, data.token);
		});
		
		socket.on('disconnect', function() {
		});
	});
	setTimeout(function () {
		commands.listen();
	}, 1000);
}