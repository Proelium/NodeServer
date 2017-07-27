var dateTime = require("node-datetime");

var game = function(options) {
	options = options || {};
	this.starts = 2;
	this.started = false;
	this.name = game.getRandomName();
	this.mode = 1;
	this.acceptsNewNations = true;
	this.time = 0; // - bc, + ad, thus the current age is 0AD
	this.clock = 10;
	this.size = options.size || global.random(1, 4);
	this.speed = 1;
	this.price = 1;
	this.seed = global.random(505050505, 909090909);
	this.date = dateTime.create().format("Y-m-d H:M:S");
	this.description = ""; //TODO: Generate random descriptions of the state of the world
	this.startingResources = 1;
	this.loan = 0; //For future feature
	this.active = true;
	this.nations = [];
	global.Proelium.nation.list(this.nations);
	this.generator = "noise";
	this.map = new global.Proelium.map(this);
	console.log("New game named "+this.name+" with size "+this.map.scape.length+"x"+this.map.scape[0].length);
};

game.prototype.createNewNation = function (name, player) {
	this.nations.push(new global.Proelium.nation(name, player, this));
	return true;
};

game.prototype.hasNation = function (player) {
	for (var i in this.nations) {
		if (this.nations[i].ownerId == player.id) {
			return true;
		}
	}
	return false;
};

game.prototype.get = function (nationname) {
	for (var i in this.nations) {
		if (this.nations[i].name.toUpperCase() == nationname.toUpperCase())
			return this.nations[i];
	}
	return false;
};

game.fire = function (user, data) {
	if (data.type == 2) {
		var games = global.Proelium.games;
		var send = [];
		
		for (var i in games) {
			send.push({
				name: games[i].name,
				starts: games[i].starts,
				started: games[i].started,
				id: games[i].$loki
			});
		}
		
		user.socket.emit("game", {type: 2, games: send});
	}else if(data.type == 3){
		var game = global.db.getCollection("games").get(data.id);
		
		if (game == null)
			return;
		
		var send = {
			id: game.$loki,
			name: game.name,
			starts: game.starts,
			active: game.active,
			started: game.started,
			description: game.description,
			nations: game.nations.length,
			hasNation: game.hasNation(user),
			size: game.size,
			speed: game.speed
		};
		
		user.socket.emit("game", {type: 3, game: send});
	}else if(data.type == 4) {
		global.Proelium.game.handleJoin(user, data);
	}
};

game.handleJoin = function (player, data) { //Handle creation and joining of nations
	if (!("create" in data))
		return;
	
	if (!("id" in data))
		return;
	
	var game = global.db.getCollection("games").get(parseInt(data.id));
	
	if (data.create == true) {
		if (game.hasNation(player)) {
			player.notify("You already have a nation here", true);
			return;
		}
		
		if (!("name" in data))
			return;
		
		if (typeof data.name != "string")
			return;
		
		if (!global.Proelium.validateName(data.name, player))
			return;
		
		if (game == null || !game.acceptsNewNations) {
			player.notify("Unable to found nation in this game", true);
			return;
		}
		
		if (game.get(data.name) !== false) {
			player.notify("That nation name is already taken", true);
			return;
		}
		
		if (game.createNewNation(data.name, player)) {
			player.notify("Nation of " + data.name + " created");
		}
	}
	
	player.socket.emit("game", {type: 4, game: {
		map: {width: game.map.scape.length, bytes: game.map.encodeToBytes()}
	}});
};

game.begin = function () {
	this.startMinuteClock();
	console.log("[Server] Started clock");
};

game.startMinuteClock = function () {
	setInterval(function () {
		for (var i in global.Proelium.games) {
			var game = global.Proelium.games[i];
			game.starts--;
			
			if (game.starts <= 0 && !game.started) {
				game.started = true;
				global.IO.emit("game", {
					type: 1,
					game: game.$loki
				});
			}
		}
	}, 1000 * 60);
};

game.randomNames = {
	prefix: ["cas", "bo", "amt", "mat", "op", "aqu", "guh", "lio", "piu", "awq", "boo", "myo", "gad", "iop", "huj", "tra"],
	postfix: ["shen", "fore", "irol", "iro", "chi", "qew", "por", "ter", "rin", "mor", "lof", "lor", "awe"]
};

game.getRandomName = function () {
	return this.randomNames.prefix[global.random(0, this.randomNames.prefix.length)] + this.randomNames.postfix[global.random(0, this.randomNames.postfix.length)];
};

module.exports = game;