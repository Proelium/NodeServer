var dateTime = require('node-datetime');

var mail = {
	get: function (id) {
		var mails = global.db.getCollection("mail");
		var mail = mails.find({"$loki": id});
		if (mail.length > 0) {
			mail[0].viewed = true;
			mails.update(mail[0]);
			return {
				id: mail[0].id,
				subject: mail[0].subject,
				message: mail[0].message,
				from: mail[0].from,
				user: mail[0].user,
				date: mail[0].date,
				viewed: true
			};
		}else{
			return false;
		}
	},
	fetch: function (user) {
		var mail = global.db.getCollection("mail").chain().find({user: user}).simplesort("viewed").simplesort("data").limit(25).data();
		return mail;
	},
	send: function (userFrom, userTo, subject, msg) {
		global.db.getCollection("mail").insert({user: userTo, from: userFrom, subject: subject, message: msg, viewed: false, date: dateTime.create().format("m/d/Y")});
	},
	fire: function (user, data) {
		if (data === null)
			return;
		
		if (data.type == 1) {
			var send = global.Proelium.mail.fetch(user.id);
			var over = [];
			for (var i in send) {
				over.push({
					subject: send[i].subject,
					from: send[i].from,
					id: send[i].$loki,
					viewed: send[i].viewed
				});
			}
			user.socket.emit("mail", {type: 1, mail: over});
		}else if (data.type == 2) {
			var found = global.Proelium.mail.get(data.id);
			if (found !== false)
				user.socket.emit("mail", {type: 2, mail: found});
		}
	}
};

module.exports = mail;