const colors = require('colors');
const net = require('net');
const Session = require('./network/Session.js'); 
var SMSG = require('./network/SMSG.js'); 
const manager = require('./global/Manager.js');

class WorldServer {
	constructor() {
	}
	StartServer() {
		var self = this;
		net.createServer(function(socket) {
			manager.map.push(new Session(socket));
			socket.on('data', function (buffer) {
                manager.ReciveSession(socket, buffer);
			});
			socket.on('close', function () {
				console.log('[INFO]: '.red + "Client close");
                //manager.DeleteSession(socket);
			});
			socket.on('error', function (err) {
				console.log('[ERROR]: '.red + "Connect error");
				console.log(err);
                //manager.DeleteSession(socket);
			});
		}).listen(8100);
		console.log('[INFO]: '.green + "Server start port: 8100" );
	}
}

setInterval(function() {
    for (var i in manager.map) {
            if (manager.map[i].socket && manager.map[i].guid) {
                if (manager.map[i].ping < (Date.now() - 120000)) //4 ping'a 
                   manager.map.splice(i, 1);
            }
    }
    /*if (!map.length)
        return;
    for (var obj of map){
        if (obj && obj.x) {
            var id = 5 - Math.random() * 10;
            var id2 = 5 - Math.random() * 10;
            var x = obj.x+id;
            var y = obj.y+id2;
            var smsg = new SMSG(0x00DD);
            smsg.guid(obj.guid);
            smsg.uint8(0);
            smsg.float(obj.x);
            smsg.float(obj.y);
            smsg.float(obj.z);
            smsg.uint32(53282);//ticks
            smsg.uint8(0);//type
            smsg.uint32(4096);//spline flags
            smsg.uint32(2702);//move time
            smsg.uint32(1);//points
            smsg.float(x);
            smsg.float(y);
            smsg.float(obj.z);
            pl.Write(smsg.buffer());
            obj.x = x;
            obj.y = y;
        }
    }*/
}, 15000);

var world = new WorldServer();
world.StartServer();