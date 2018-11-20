var zlib = require('zlib');
const utf8 = require('utf8');
const mysql = require('mysql');
const Crypt = require('../utils/Crypt.js');
const Bytes = require('../utils/Bytes.js');
const SMSG = require('./SMSG.js');
const CMSG = require('./CMSG.js');
const Player = require('../entities/Player.js');
const Unit = require('../entities/Unit.js');
const opcode = require('./opcode.js');
const recode = require('../enums/response.js');

var map = require('../global/map.js'); 
const manager = require('../global/Manager.js'); 

var auth = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'auth', insecureAuth: true, charset  : 'utf8mb4'});
var characters = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'characters', insecureAuth: true, charset  : 'utf8mb4'});
var world = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'world', insecureAuth: true, charset  : 'utf8mb4'});

characters.query("SET NAMES utf8");


class Session {
    constructor(socket){
        this.crypt = new Crypt();
        this.socket = socket;
        this.AuthChallenge();
    }
    recive(buffer){
        if (buffer.length < 5)
			return;
		
		var buffer = this.crypt.decrypt(buffer);
		var size = ( buffer[0] << 8 ) | buffer[1] + 2;//чекаем размер, если не совпадает режем и на переработку
		if (size != buffer.length)
			this.recive(buffer.slice(size));
		var buffer = buffer.slice(0, size);
		var code = ( buffer[3] << 8 ) | buffer[2];
		var cmsg = new CMSG(buffer);
        //код пакета
		switch(code) {
			case opcode.CMSG_AUTH_SESSION: this.AuthSession(cmsg); break;
			//case opcode.CMSG_REALM_SPLIT: this.RealmSplit(cmsg); break;
			case opcode.CMSG_PING: this.Ping(cmsg); break;
			case opcode.CMSG_CHAR_ENUM: this.CharEnum(cmsg); break;
            case opcode.CMSG_CHAR_CREATE: this.CharCreate(cmsg); break;
            case opcode.CMSG_SET_PLAYER_DECLINED_NAMES: this.SetPlayerDeclinedNames(cmsg); break;
			case opcode.CMSG_PLAYER_LOGIN: this.PlayerLogin(cmsg); break;
            case opcode.CMSG_ITEM_QUERY_SINGLE: this.ItemQuerySingle(cmsg); break;
                
            case opcode.MSG_MOVE_STOP: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_START_FORWARD: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_START_BACKWARD: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_START_STRAFE_LEFT: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_START_STRAFE_RIGHT: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_STOP_STRAFE: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_HEARTBEAT: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_START_TURN_LEFT: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_START_TURN_RIGHT: this.Movement(cmsg); break;    
            case opcode.MSG_MOVE_STOP_TURN: this.Movement(cmsg); break;  
            case opcode.MSG_MOVE_JUMP: this.Movement(cmsg); break;
            case opcode.MSG_MOVE_FALL_LAND: this.Movement(cmsg); break;   
                
                
                
            case opcode.CMSG_LOGOUT_REQUEST: this.LogoutRequest(cmsg); break;
            case opcode.CMSG_LOGOUT_CANCEL: this.LogoutCancel(cmsg); break;

			default:
				console.log('[WARNING]: '.red + "Unknown packet. Command: 0x" + code.toString(16) + " size: " + size + " length: " + buffer.length );
			break;
		}
        this.HelperWrite(buffer, 'in');
    }
    LogoutRequest(cmsg) {
        var smsg = new SMSG(opcode.SMSG_LOGOUT_RESPONSE);
        smsg.uint32(0x00000000);
        smsg.uint8(0x00);
        this.Write(smsg.buffer());
    }
    LogoutCancel(cmsg) {
        var smsg = new SMSG(opcode.SMSG_LOGOUT_CANCEL_ACK);
        this.Write(smsg.buffer());
    }
    Random(size) {
		var buffer = new Buffer.alloc(size);
		for (var  i = 0; i < size; ++i) 
			buffer[i] = Math.floor(Math.random() * 255);
		return buffer;
	}
    HelperWrite(buffer, io = 'out') {
        return;
        function codes(n) {
			for (var c in opcode)
				if (opcode[c] == n)
					return c;
			return opcode.NUM_MSG_TYPES;
		}
		var size = ( buffer[0] << 8 ) | buffer[1];
		var code = ( buffer[3] << 8 ) | buffer[2];
		console.log(' ');
		if (io == 'in') {
			console.log(('client->server code: 0x' + code.toString(16) + ' size: ' + size + ' length: ' + buffer.length + ' ').green + codes(code).yellow);
			console.log('---------------------------------------------------'.green);
		} else {
			console.log(('server->client code: 0x' + code.toString(16) + ' size: ' + size + ' length: ' + buffer.length + ' ').yellow + codes(code).green);
			console.log('---------------------------------------------------'.yellow);
		}
		console.log('0000  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F'.blue);
		var block = '';
		for (var i =  0; i < buffer.length; ++i) {
			if (i%16 == 0 && i != 0) {
				console.log(('000' + (i-16).toString(16)).substr(-4) + ' ' + block);
				block = '';
			}
			block += " " + ("0" + buffer[i].toString(16)).substr(-2);
		}
		console.log(('000' + ((i > 16)?i-16:0).toString(16)).substr(-4) + ' ' + block);
		console.log(' ');
    }
    Write(buffer) {
        this.HelperWrite(buffer, 'out');
		var buffer = this.crypt.encrypt(buffer);
		this.socket.write(buffer);
    }
    Ping(cmsg) {
        this.ping = Date.now();
		var ping = cmsg.uint32();
		var latency = cmsg.uint32();
		var smsg = new SMSG(opcode.SMSG_PONG);
		smsg.uint32(ping);
		this.Write(smsg.buffer());
	}
    AuthChallenge() {
        var smsg = new SMSG(opcode.SMSG_AUTH_CHALLENGE);
		this.seed = this.Random(16);
		var seed1 = this.Random(16);
		var seed2 = this.Random(16);
		smsg.uint32(0x00000001);
		smsg.array(this.seed);
		smsg.array(seed1);
		smsg.array(seed2);
		this.Write(smsg.buffer());
    }
    AuthSession(cmsg){
        var client = this;
		var Build = cmsg.uint32();
		var LoginServerID = cmsg.uint32();
		var Account = cmsg.string();
		var LoginServerType = cmsg.uint32();
		var LocalChallenge = cmsg.uint32();
		var RegionID = cmsg.uint32();
		var BattlegroupID = cmsg.uint32();
		var RealmID = cmsg.uint32();
		var DosResponse = cmsg.uint64();
		console.log(Build);
		console.log(LoginServerID);
		console.log(Account);
		console.log(LoginServerType);
		console.log(LocalChallenge);
		console.log(RegionID);
		console.log(BattlegroupID);
		console.log(RealmID);
		console.log(DosResponse);
        console.log(Account.toLowerCase())
		auth.query("SELECT sessionkey, id FROM account WHERE username=?", [Account.toLowerCase()], function (err, result, fields) {client.AuthSessionCallback(result)});
	}
    AuthSessionCallback(result) {
        if (!result) {
            var smsg = new SMSG(opcode.SMSG_AUTH_RESPONSE);
            smsg.uint8(recode.AUTH_UNKNOWN_ACCOUNT);
            this.Write(smsg.buffer());
            this.socket.destroy(); //Test, close, delete all
            return;
        }
        this.account = result[0].id;
        this.crypt.enable(result[0].sessionkey);
        var smsg = new SMSG(opcode.SMSG_AUTH_RESPONSE);
        smsg.uint8(12);
        smsg.uint32(0);
        smsg.uint8(0);
        smsg.uint32(0);
        smsg.uint8(2); //2-WoTLK
        this.Write(smsg.buffer());
    }
    CharEnum(cmsg) {
        var client = this;
        characters.query("SELECT * FROM characters WHERE account=?", [this.account], function (err, result, fields) {client.CharEnumCallback(result)});
    }
    CharEnumCallback(result) {
        var smsg = new SMSG(opcode.SMSG_CHAR_ENUM);
        smsg.uint8(result.length);
        for (var character of result) {
            smsg.uint64(character.guid);
            smsg.string(character.name);
            smsg.uint8(character.race);
            smsg.uint8(character.class);
            smsg.uint8(character.gender);
            smsg.uint8(character.playerBytes); //skin
            smsg.uint8(character.playerBytes >> 8); //face
            smsg.uint8(character.playerBytes >> 16); //hair style
            smsg.uint8(character.playerBytes >> 24); //hair color
            smsg.uint8(character.playerBytes2); //facial hair
            smsg.uint8(character.level);  
            smsg.uint32(character.zone);
            smsg.uint32(character.map);
            smsg.float(character.position_x);
            smsg.float(character.position_y);
            smsg.float(character.position_z);
            smsg.uint32(0); //гильдтя
            smsg.uint32(0x00); //flags
            smsg.uint32(character.at_login & 0x08 ? 0x00000001 : 0x00000000);
            smsg.uint8(character.at_login & 0x20 ? 1 : 0);
            smsg.uint32(0x00000000); //pet id
            smsg.uint32(0x00000000); //pet level
            smsg.uint32(0x00000000); //pet famaily
            
            var equipments = character.equipmentCache.split(' ');
            for (var slot = 0; slot < 23; ++slot) {
                if (equipments[slot] != 0) {
                    smsg.uint32(0);
                    smsg.uint8(0);
                    smsg.uint32(0);
                } else {
                    smsg.uint32(0);
                    smsg.uint8(0);
                    smsg.uint32(0);  
                }
            }
        }
        this.Write(smsg.buffer());
    }
    CharCreate(cmsg) {
        var client = this;
        var name = cmsg.string();
        var race = cmsg.uint8();
        var clas = cmsg.uint8();
        var gender = cmsg.uint8();
        var skin = cmsg.uint8();
        var face = cmsg.uint8();
        var hairStyle = cmsg.uint8();
        var hairColor = cmsg.uint8();
        var facialHair = cmsg.uint8();
        var playerBytes = skin | (face << 8) | (hairStyle << 16) | (hairColor << 24);
        var playerBytes2 = facialHair;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        characters.query("SELECT * FROM characters;", function (err, result, fields) {
            world.query("SELECT * FROM playercreateinfo WHERE race=? AND class=?;", [race, clas], function (err, info, fields) {
                characters.query("INSERT INTO characters SET guid=?, account=?, name=?, race=?, class=?, gender=?, playerBytes=?, playerBytes2=?, equipmentCache=?, map=?, zone=?, position_x=?, position_y=?, position_z=?, orientation=?, level=?;", [result.length, client.account, name, race, clas, gender, playerBytes, playerBytes2, '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ', info[0].map, info[0].zone, info[0].position_x, info[0].position_y, info[0].position_z, info[0].orientation, 1], function (err, result, fields) {client.CharCreateCallback(result)});
            });
        });
    }
    SetPlayerDeclinedNames(cmsg) {
        var guid = cmsg.uint64();
        var smsg = new SMSG(opcode.SMSG_SET_PLAYER_DECLINED_NAMES_RESULT);
        smsg.uint32(0);
        smsg.uint64(guid);
        this.Write(smsg.buffer());
    }
    CharCreateCallback(result) {
        if (!result) {
            var smsg = new SMSG(opcode.SMSG_CHAR_CREATE);
            smsg.uint8(recode.ACCOUNT_CREATE_FAILED);
            this.Write(smsg.buffer());
            return;
        }
        var smsg = new SMSG(opcode.SMSG_CHAR_CREATE);
        smsg.uint8(recode.ACCOUNT_CREATE_SUCCESS);
        this.Write(smsg.buffer());
    }
    PlayerLogin(cmsg) {
        var client = this;
        var guid = cmsg.uint32();
        console.log('[DEBUG]'.blue + ' charcter enter guid32: ' + guid);
		characters.query("SELECT * FROM characters WHERE guid=? AND account=?;", [guid, this.account], function (err, result, fields) {client.PlayerLoginCallback(result)});
    }
    PlayerLoginCallback(result) {
        if (!result) {
            console.log('[ERROR]: '.red + ' mysql');
            return;
        }
        
        this.player = new Player();
        this.player.setGuid(result[0].guid, 0x0000);
        this.player.setType();
        this.player.setPosition(result[0].position_x, result[0].position_y, result[0].position_z, result[0].orientation);
        this.player.setLevel(result[0].level);
        var display = (result[0].gender == 1) ? manager.ChrRaces[result[0].race].FemaleDisplayId : manager.ChrRaces[result[0].race].MaleDisplayId;
        this.player.setDisplayID(display); 
        
        
        for (var guid in manager.map) {
            if (guid && manager.map[guid].player) {
                if (manager.map[guid].player == this.player) {
                    var block = manager.map[guid].player.Create(113);
                    var smsg = new SMSG(opcode.SMSG_UPDATE_OBJECT);
                    smsg.uint32(1);
                    smsg.array(block, false);
                    this.Write(smsg.buffer());
                } else {
                    var block = manager.map[guid].player.Create(112);
                    var smsg = new SMSG(opcode.SMSG_UPDATE_OBJECT);
                    smsg.uint32(1);
                    smsg.array(block, false);
                    this.Write(smsg.buffer());  
                }
            }
        }
        
        var block = this.player.Create(112);
        var smsg = new SMSG(opcode.SMSG_UPDATE_OBJECT);
        smsg.uint32(1);
        smsg.array(block, false);
        manager.Write( smsg.buffer(), this.player.guid);
        
        var smsg = new SMSG(opcode.SMSG_TIME_SYNC_REQ);
        smsg.uint32(0);
        this.Write(smsg.buffer());
    }
    Movement(cmsg) {
        var guid = cmsg.guid();
        var flags = cmsg.uint32();
        var extra = cmsg.uint16();
        var time = cmsg.uint32();
        var x = cmsg.float();
        var y = cmsg.float();
        var z = cmsg.float();
        var o = cmsg.float();
        var falltime = cmsg.uint32();
        this.player.setPosition(x, y, z, o);
        this.player.setTime(time);
        var smsg = new SMSG(cmsg.code);
        smsg.guid(guid);
        smsg.uint32(flags);
        smsg.uint16(extra);
        smsg.uint32(time);
        smsg.float(x);
        smsg.float(y);
        smsg.float(z);
        smsg.float(o);
        smsg.uint32(falltime);
        manager.Write(smsg.buffer(), guid);
    }
    ItemQuerySingle(cmsg) {
        var item = cmsg.uint32();
        console.log("STORAGE: Item Query = " + item);
    }
}
module.exports = Session;