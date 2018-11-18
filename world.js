const colors = require('colors');
const net = require('net');
const Session = require('./network/Session.js'); 

class WorldServer {
	constructor() {
		this.session = [];
	}
	StartServer() {
		var self = this;
		net.createServer(function(socket) {
			self.session[socket] = new Session(socket);
			socket.on('data', function (buffer) {
				self.session[socket].recive(buffer);
			});
			socket.on('close', function () {
				console.log('[INFO]: '.red + "Client close");
				delete(self.session[socket]);
			});
			socket.on('error', function (err) {
				console.log('[ERROR]: '.red + "Connect error");
				console.log(err);
			});
		}).listen(8100);
		console.log('[INFO]: '.green + "Server start port: 8100" );
	}
}

var world = new WorldServer();
world.StartServer();