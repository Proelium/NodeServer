var water = global.makeBiome("water", 1, {
	image: "http://png.clipart.me/previews/49c/water-pattern-vector-free-25932.png",
	chance: 1,
	spawn: {
		min: 0,
		max: 127
	}
});

if (typeof module == "undefined") {
	define(function (require) {
		return water;
	});
}else{
	module.exports = water;
}