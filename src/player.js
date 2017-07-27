var querystring = require('querystring');
var https = require('https');
var loki = require("lokijs");

var player = function (socket, token) {
	var that = this;
	this.socket = socket;
	this.token = token;
	this.username = "";
	this.url = "";
	this.points = 0;
	this.id = -1;
	this.platformId = "";
	
	global.Google.client.verifyIdToken(token, global.Google.clientId, function(e, login) {
		if (e !== null)
			return;
		
		var payload = login.getPayload();
		var userid = payload['sub'];
		
		that.username = payload.name;
		
		that.url = payload.picture;
		
		var found = global.db.getCollection("users").find({platformId: payload.sub});
		
		if (found.length > 0) {
			that.load(found[0]);
		}else{
			that.create(payload.sub);
		}
		that.loaded();
	});
	
};

player.prototype.notify = function (msg, isError) {
	isError = isError || false;
	this.socket.emit("notify", {message: msg, error: isError});
};

player.prototype.loaded = function () {
	var that = this;
	
	that.socket.on("mail", function (data) {
		global.Proelium.mail.fire(that, data);
	});
	
	that.socket.on("game", function (data) {
		global.Proelium.game.fire(that, data);
	});
};

player.prototype.load = function (data) {
	this.points = data.points;
	this.id = data.$loki;
	this.platformId = data.platformId;
	this.socket.emit("join", {"new": false, "name": this.username, "picture": this.url, points: this.points, id: this.id});	
};

player.prototype.create = function (plat) {
	var out = global.db.getCollection("users").insert({
		platformId: plat,
		points: 0
	});
	this.points = 0;
	this.id = out.$loki;
	global.Proelium.mail.send(-1, this.id, "Welcome", "Welcome to Proelium. If you need help please view the tutorials section.");
	this.socket.emit("join", {"id": this. id, "new": true, "name": this.username, "picture": this.url, points: this.points});
};

module.exports = player;