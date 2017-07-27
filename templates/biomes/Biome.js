var Biome = function () {
	
};

Biome.biomes = {};

Biome.fromId = function (id) {
	if (id in Biome.biomes)
		return Biome.biomes[id];
	
	return;
};

Biome.make = function (name, id, obj) {
	var newBiome = obj.create || function (isClient) {
		this.i = id;
	};
	
	for (var i in obj) {
		if (!obj.hasOwnProperty(i))
			continue;
		
		newBiome[i] = obj[i];
	}
	
	newBiome.id = id;
	newBiome.name = name;
	
	Biome.biomes[id] = newBiome;
	
	return newBiome;
};

global.makeBiome = Biome.make;

if (typeof module == "undefined") {
	define(function (require) {
		return Biome;
	});
}else{
	module.exports = Biome;
}