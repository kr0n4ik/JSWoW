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
const manager = require('../global/Manager.js'); 

var auth = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'auth', insecureAuth: true, charset  : 'utf8mb4'});
var characters = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'characters', insecureAuth: true, charset  : 'utf8mb4'});
var world = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'world', insecureAuth: true, charset  : 'utf8mb4'});

characters.query("SET NAMES utf8");


class Session extends Player {
    constructor(socket) {
        super();
        this.crypt = new Crypt();
        this.socket = socket;
        this.ping = Date.now();
        this.AuthChallenge();   
    }
    Recive(buffer){
        if (buffer.length < 5)
			return;
		
		var buffer = this.crypt.decrypt(buffer);
		var size = ( buffer[0] << 8 ) | buffer[1] + 2;//чекаем размер, если не совпадает режем и на переработку
		if (size != buffer.length)
			this.Recive(buffer.slice(size));
		var buffer = buffer.slice(0, size);
		var code = ( buffer[3] << 8 ) | buffer[2];
		var cmsg = new CMSG(buffer);
        this.HelperPacket(buffer, 'in');
        //код пакета
		switch(code) {
            case opcode.CMSG_PING: this.Ping(cmsg); break;
            case opcode.CMSG_AUTH_SESSION: this.AuthSession(cmsg); break;
            case opcode.CMSG_CHAR_ENUM: this.CharEnum(); break;
            case opcode.CMSG_CHAR_CREATE: this.CharCreate(cmsg); break;
            case opcode.CMSG_CHAR_DELETE: this.CharDelete(cmsg); break;
            case opcode.CMSG_SET_PLAYER_DECLINED_NAMES: this.SetPlayerDeclinedNames(cmsg); break;
            case opcode.CMSG_PLAYER_LOGIN: this.PlayerLogin(cmsg); break;
            case opcode.CMSG_REALM_SPLIT: this.RealmSplit(cmsg); break;
            case opcode.CMSG_SET_SELECTION: this.SetSelection(cmsg); break;
            case opcode.CMSG_LIST_INVENTORY: this.ListInventory(cmsg); break;
            case opcode.CMSG_ITEM_QUERY_SINGLE: this.ItemQuerySingle(cmsg); break;
            case opcode.CMSG_LOGOUT_REQUEST: this.LogoutRequest(cmsg); break;
            case opcode.CMSG_LOGOUT_CANCEL: this.LogoutCancel(cmsg); break;
            case opcode.CMSG_UI_TIME_REQUEST: this.UITimeRequest(cmsg); break;
            case opcode.CMSG_ZONEUPDATE: this.ZoneUpdate(cmsg); break;
            case opcode.CMSG_JOIN_CHANNEL: this.JoinChannel(cmsg); break;
                
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
                
            default:
                console.log('[WARNING]: '.red + "Unknown packet. Command: 0x" + code.toString(16) + " size: " + size + " length: " + buffer.length );
			break;
        }
    }
    HelperPacket(buffer, io = 'out') {
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
    Random(size) {
		var buffer = new Buffer.alloc(size);
		for (var  i = 0; i < size; ++i) 
			buffer[i] = Math.floor(Math.random() * 255);
		return buffer;
	}
    Write(buffer) {
        this.HelperPacket(buffer);
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
        this.l = this.ping;
	}
    RealmSplit(cmsg) {
		var unk = cmsg.uint32();
		var smsg = new SMSG(opcode.SMSG_REALM_SPLIT);
		smsg.uint32(unk);
		smsg.uint32(0);
		smsg.string('01/01/01');
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
		var LocalChallenge = cmsg.uint32(); //seed
		var RegionID = cmsg.uint32();
		var BattlegroupID = cmsg.uint32();
		var RealmID = cmsg.uint32();
		var DosResponse = cmsg.uint64();
        var Digest = cmsg.array(20);
		console.log(Build);
		console.log(LoginServerID);
		console.log(Account);
		console.log(LoginServerType);
		console.log(LocalChallenge);
		console.log(RegionID);
		console.log(BattlegroupID);
		console.log(RealmID);
		console.log(DosResponse);
        console.log(Account.toLowerCase());
        console.log(Digest);
		auth.query("SELECT sessionkey, id FROM account WHERE username=?", [Account.toLowerCase()], function (err, result, fields) {client.AuthSessionCallback(result)});
	}
    AuthSessionCallback(result) {
        if (!result) {
            var smsg = new SMSG(opcode.SMSG_AUTH_RESPONSE);
            smsg.uint8(recode.AUTH_UNKNOWN_ACCOUNT);
            this.Write(smsg.buffer());
            //this.socket.destroy(); //Test, close, delete all
            return;
        }
        this.account = result[0].id;
        this.crypt.enable(result[0].sessionkey);
        var smsg = new SMSG(opcode.SMSG_AUTH_RESPONSE);
        smsg.uint8(recode.AUTH_OK);
        smsg.uint32(0);
        smsg.uint8(0);
        smsg.uint32(0);
        smsg.uint8(2); //2-WoTLK
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
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        characters.query("SELECT * FROM characters;", function (err, result, fields) {
            world.query("SELECT * FROM playercreateinfo WHERE race=? AND class=?;", [race, clas], function (err, info, fields) {
                characters.query("INSERT INTO characters SET guid=?, account=?, name=?, race=?, class=?, gender=?, playerBytes=?, playerBytes2=?, equipmentCache=?, map=?, zone=?, position_x=?, position_y=?, position_z=?, orientation=?, level=?;", [result.length, client.account, name, race, clas, gender, playerBytes, playerBytes2, '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ', info[0].map, info[0].zone, info[0].position_x, info[0].position_y, info[0].position_z, info[0].orientation, 1], function (err, result, fields) {client.CharCreateCallback(result)});
            });
        });
    }
    CharDelete(cmsg) {
        var guid = cmsg.uint64();
        var client = this;
        characters.query("DELETE FROM characters WHERE account=? AND guid=?", [this.account, guid], function (err, result, fields) {
             var smsg = new SMSG(opcode.SMSG_CHAR_DELETE);
            smsg.uint8(recode.CHAR_DELETE_SUCCESS);
            client.Write(smsg.buffer());
        });  
    }
    CharEnum() {
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
                //if (manager.itemTemplate[equipments[slot*2]]) {
                  //  smsg.uint32(manager.itemTemplate[equipments[slot*2]].displayid);
                 //   smsg.uint8(0);
                 //   smsg.uint32(0);
              //  } else {
                    smsg.uint32(0);
                    smsg.uint8(0);
                    smsg.uint32(0);
               // }
            }
        }
        this.Write(smsg.buffer());
    }
    SetPlayerDeclinedNames(cmsg) {
        var client = this;
        var guid = cmsg.uint64();
        var name = cmsg.string();
        var genitive = cmsg.string();
        var dative = cmsg.string();
        var accusative = cmsg.string();
        var instrumental = cmsg.string();
        var prepositional = cmsg.string();
        
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        genitive = genitive.charAt(0).toUpperCase() + genitive.slice(1).toLowerCase();
        dative = dative.charAt(0).toUpperCase() + dative.slice(1).toLowerCase();
        accusative = genitive.charAt(0).toUpperCase() + accusative.slice(1).toLowerCase();
        instrumental = instrumental.charAt(0).toUpperCase() + instrumental.slice(1).toLowerCase();
        prepositional = prepositional.charAt(0).toUpperCase() + prepositional.slice(1).toLowerCase();
        
        characters.query("REPLACE INTO character_declinedname (guid, genitive, dative, accusative, instrumental, prepositional) VALUES (?,?,?,?,?,?)", [guid, genitive, dative, accusative, instrumental, prepositional], function (err, result, fields) {
            if (err) {
                var smsg = new SMSG(opcode.SMSG_SET_PLAYER_DECLINED_NAMES_RESULT);
                smsg.uint32(1);                                      // OK
                smsg.uint64(guid);
                client.Write(smsg.buffer());
            } else {
                var smsg = new SMSG(opcode.SMSG_SET_PLAYER_DECLINED_NAMES_RESULT);
                smsg.uint32(0);                                      // OK
                smsg.uint64(guid);
                client.Write(smsg.buffer());
            }
        });
        
        //wname.match(/[^А-Яа-яЁё]/g);
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
        var guid = cmsg.uint64();
        console.log('[DEBUG]'.blue + ' charcter enter guid32: ' + guid);
        characters.query("SELECT * FROM characters WHERE guid=? AND account=?;", [guid, this.account], function (err, result, fields) {client.PlayerLoginCallback(result)});
    }
    PlayerLoginCallback(result) {
        if (!result) {
            console.log('[ERROR]: '.red + ' mysql');
            return;
        }
        
        this.setGuid(result[0].guid, 0x0000);
        this.setType();
        this.setPosition(result[0].position_x, result[0].position_y, result[0].position_z, result[0].orientation);
        this.setLevel(result[0].level);
        var display = (result[0].gender == 1) ? manager.ChrRaces[result[0].race].FemaleDisplayId : manager.ChrRaces[result[0].race].MaleDisplayId;
        this.setDisplayID(display);
        this.setUnitFlags(8);
        this.setUnitFlags2(2048);
        this.setUnitBytes(16777473);
        
        this.AccountDataTimes(0xEA);
        
        var smsg = new SMSG(opcode.SMSG_LOGIN_VERIFY_WORLD);
        smsg.uint32(this.map);
        smsg.float(this.x);
        smsg.float(this.y);
        smsg.float(this.z);
        smsg.float(this.onchange);
        this.Write(smsg.buffer());
        
        var smsg = new SMSG(opcode.SMSG_MOTD);
        smsg.uint32(1);
        smsg.string('Welcome JSWoW server');
        this.Write(smsg.buffer());
        
        var smsg = new SMSG(opcode.SMSG_LEARNED_DANCE_MOVES);
        smsg.uint32(0);
        smsg.uint32(0);
        this.Write(smsg.buffer());
        
        
        var smsg = new SMSG(opcode.SMSG_FEATURE_SYSTEM_STATUS);         // added in 2.2.0
        smsg.uint8(2);                                       // unknown value
        smsg.uint8(0);                                       // enable(1)/disable(0) voice chat interface in client
        this.Write(smsg.buffer());
        
        var smsg = new SMSG(opcode.SMSG_INITIAL_SPELLS);
        smsg.uint8(0);
        smsg.uint16(this.spells.length);
        for (var spell of this.spells) {
            smsg.uint32(spell);
            smsg.uint16(0);
        }
        smsg.uint16(0);
        this.Write(smsg.buffer());
        
        
        var smsg = new SMSG(opcode.SMSG_LOGIN_SETTIMESPEED);
        smsg.time(Date.now());
        smsg.float(0.01666667);
        smsg.uint32(0);
        this.Write(smsg.buffer());
        
        
        var smsg = new SMSG(opcode.SMSG_UPDATE_OBJECT);
        smsg.uint32(1);
        smsg.array(this.Create(113), false);
        this.Write(smsg.buffer());
        
        var smsg = new SMSG(opcode.SMSG_TIME_SYNC_REQ);
        smsg.uint32(0);
        this.Write(smsg.buffer());
        
        this.CreateTestNpc();
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
        
        this.setPosition(x, y, z, o);
        this.setTime(time);
        
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
    AccountDataTimes(mask) {
        var time = Math.round(Date.now()/1000);
        var smsg = new SMSG(opcode.SMSG_ACCOUNT_DATA_TIMES); // changed in WotLK
        smsg.uint32(time);                             // unix time of something
        smsg.uint8(1);
        smsg.uint32(mask);                                   // type mask
        for (var i = 0; i < 8; ++i)
            if (mask & (1 << i))
                smsg.uint32(0);// also unix time
        this.Write(smsg.buffer());
    }
    UITimeRequest(cmsg) {
        var time = Math.round(Date.now()/1000);
        var smsg = new SMSG(opcode.SMSG_UI_TIME);
        smsg.uint32(time);
        this.Write(smsg.buffer());
    }
    JoinChannel(cmsg) {
        var id = cmsg.uint32();
        var unk1 = cmsg.uint8();
        var unk2 = cmsg.uint8();
        var channel = cmsg.string();
        var password = cmsg.string();
        console.log('[LOG]'.green + ' CMSG_JOIN_CHANNEL ' + this.guid + ' Channel: '+id+', unk1: '+unk1+', unk2: '+unk2+', channel: '+channel+', password: '+password);
        var smsg = new SMSG(opcode.SMSG_CHANNEL_NOTIFY);
        smsg.uint8(2);
        smsg.string(channel);
        smsg.uint8(24);
        smsg.uint32(id);
        smsg.uint32(0);
        this.Write(smsg.buffer());
    }
    ItemQuerySingle(cmsg) {
        var item = cmsg.uint32();
        console.log("STORAGE: Item Query = " + item);
    }
    SetSelection(cmsg) {
        var guid = cmsg.uint64();
        this.targrt = guid;
        console.log('target: ' + guid.toString(16));
    }
    ListInventory(cmsg) {
        var guid = cmsg.uint64();
        console.log('inventory: ' + guid.toString(16));
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
    ZoneUpdate(cmsg){
        var id = cmsg.uint32();
        console.log('ZoneUpdate: ' + id.toString(16));
    }
    CreateTestNpc() {
        var self = this;
        world.query("SELECT * FROM creature WHERE map=0 AND position_x<? AND position_x>? AND position_y<? AND position_y>?;", [this.x+100, this.x-100, this.y+100, this.y-100], function (err, result, fields) {
             var smsg = new SMSG(opcode.SMSG_UPDATE_OBJECT);
            smsg.uint32(result.length);
            for (var u of result){
                var template = manager.creatureTemplate[u.id];
                var unit = new Unit();
                unit.setGuid(u.guid, 0xF130);
                unit.setEntry(u.id);
                unit.setUpdateFlag(112);
                unit.setType();
                unit.setDisplayID(template.modelid1);
                unit.setPosition(u.position_x, u.position_y, u.position_z, u.orientation);
                unit.setNpcFlags(template.npcflag);
                unit.setUnitFlags(template.unit_flags);
                var block = unit.Create();
                smsg.array(block, false);
            }
            self.Write(smsg.buffer());
        });
    }
}
module.exports = Session;