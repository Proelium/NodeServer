var inquirer = require("inquirer");

//TODO: Clean up this mess, organize and make it smaller.

var commands = {};

commands.createGame = function () {
	inquirer.prompt([{
		type: "list",
		name: "commands",
		message: "Game size",
		choices: ["Small", "Medium", "Large", "Huge", "Cancel"],
		filter: function (val) {
			return val.toLowerCase();
		}
	}]).then(function (a) {
		a = a.commands;
		if (a == "small") {
			global.Proelium.createNewRandomGame({size: 1});
		}if (a == "medium") {
			global.Proelium.createNewRandomGame({size: 2});
		}if (a == "large") {
			global.Proelium.createNewRandomGame({size: 3});
		}if (a == "huge") {
			global.Proelium.createNewRandomGame({size: 6});
		}
		commands.go();
	});
};

commands.game = function () {
	inquirer.prompt([{
		type: "list",
		name: "commands",
		message: "Game menu",
		choices: ["Create", "Cancel"],
		filter: function (val) {
			return val.toLowerCase();
		}
	}]).then(function (a) {
		a = a.commands;
		if (a == "create") {
			commands.createGame();
		}else{
			commands.go();
		}			
	});
};

commands.go = function () {
	inquirer.prompt([{
		type: "list",
		name: "commands",
		message: "Command interface",
		choices: ["Game", "Stop"],
		filter: function (val) {
			return val.toLowerCase();
		}
	}]).then(function (a) {
		a = a.commands;
		if (a == "stop") {
			globa.Proelium.exit();
		}else if(a == "game"){
			commands.game();
		}
	});
};

commands.listen = function () { //TODO: Make this work
	inquirer.prompt([
		{
			type: "list",
			name: "commands",
			message: "Comamnd interface",
			choices: ["Press enter"],
			filter: function (val) {
				return val.toLowerCase();
			}
		}
	]).then(function (a) {
		commands.go();
	});
}

module.exports = commands;