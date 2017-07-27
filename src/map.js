var seedrandom = require("seedrandom");
var FastSimplexNoise = require('fast-simplex-noise');

var map = function (parent) {
	this.scape = [];
	var genMap = new global.Proelium.map[parent.generator](parent.seed);
	
	for (var i = 0; i < parent.size * 40; i++) {
		var add = [];
		for (var j = 0; j < parent.size * 40; j++) {
			add.push(genMap.getNewHexAt(j, i));
		}
		this.scape.push(add);
	}
};

map.prototype.encodeToBytes = function () {
	var output = "";
	for (var i in this.scape) {
		for (var j in this.scape[i]) {
			if (typeof this.scape[i][j] == "undefined" || this.scape[i][j] === null)
				output += " ";
			else
				output += String.fromCharCode(65 + this.scape[i][j][0]); //0 starts at A
		}
	}
	return output;
};

map.prototype.getNewSpawnHex = function () { //Find good hex to spawn on
	return [0, 0]; //TODO: Make it work
};

map.noise = function (seed) {
	var rng = seedrandom(seed);
	this.simplex = new FastSimplexNoise.default({frequency: 0.01, max: 255, min: 0, octaves: 8, random: rng});
};

map.noise.prototype.getNewHexAt = function (x, y) {
	var cur = this.simplex.scaled([x, y]);
	
	for (var i in global.Proelium.biomes) {
		var biome = global.Proelium.biomes[i];
		if ("spawn" in biome)
			if ("max" in biome.spawn && "min" in biome.spawn) {
				if (cur >= biome.spawn.min && cur <= biome.spawn.max) {
					return [biome.id, 1 /*This is the seeded size modi TODO*/]; //Call events
				}
			}
	}
};

map.prototype.at = function (x, y) {
	return this.scape[y][x];
};

module.exports = map;