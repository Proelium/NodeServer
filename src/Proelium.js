module.exports = {
	validateName: function (name, player) { //TODO: Shorten this later
		player = player || false;
		
		if (name.length <= 2) {
			if (player !== false)
				player.notify("Name to small", true);
			return false;
		}
		
		if (name.length >= 84) {
			if (player !== false)
				player.notiy("Name to long", true);
			return false;
		}
		
		if (!/[A-Za-z0-9_*$@#]/.test(name)) {
			if (player !== false)
				player.notify("Name contains an invalid character, only use a-z, 0-9, @, #, $, *,  and _", true);
			return false;
		}
		
		return true;
	},
	createNewRandomGame: function (options) { //TODO: Accept options soon
		options = options || {};
		var game = new global.Proelium.game(options);
		global.Proelium.games.push(game);
		return db.getCollection("games").insert(game);
	},
	player: require("./player.js"),
	mail: require("./mail.js"),
	game: require("./game.js"),
	nation: require("./nation.js"),
	game: require("./game.js"),
	map: require("./map.js"),
	biome: require("../templates/biomes/Biome.js"),
	biomes: require("../templates/biomes")
};