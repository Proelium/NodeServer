var nation = function (name, player, game) {
	this.name = name;
	this.money = 0;
	this.level = 0;
	this.capital = game.map.getNewSpawnHex(); //Hex position
	
	this.ownerId = player.id; //Store the id and not the object. Use owner() to get the instance of the player.
}

nation.prototype.owner = function () {
	//TODO: return global.Proelium.getPlayer(this.ownerId);
};

nation.list = function (nations) { //Add this prototype to nations
	for (var i in nations) {
		Object.assign(nations[i], nation.prototype);
	}
}



module.exports = nation;