if (typeof module == "undefined") {
	define(function (require) {
		return {
			water: require("./water.js")
		};
	});
}else{
	module.exports = {
		water: require("./water.js")
	};
}