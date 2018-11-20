/*
База данных от TrinityCore
*/
const mysql = require('mysql');

var ChrRaces = require('../data/ChrRaces.json');

var auth = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'auth', insecureAuth: true});
var characters = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'characters', insecureAuth: true});
var world = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'world', insecureAuth: true});

class Manager {
    constructor() {
        this.ChrRaces = [];
        this.map = [];
        this.auth = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'auth', insecureAuth: true});
        this.characters = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'characters', insecureAuth: true});
        this.world = mysql.createConnection({ host:'127.0.0.1', user:'trinity', password:'trinity', database:'world', insecureAuth: true});
        this.creatureTemplate = [];
        this.playerInfo = [];
        this.LoadCreatureTemplates();
        this.LoadPlayerInfo();
        this.LoadChrRacesDBC();
    }
    
    LoadChrRacesDBC() {
        for (var val of ChrRaces) {
            this.ChrRaces[val.ID] = val;
        }
    }
    
    LoadCreatureTemplates() {
        var self = this;
        var ms = Date.now();
        this.world.query("SELECT * FROM creature_template", function (err, result, fields) {
            for (var val of result) 
                self.creatureTemplate[val.entry] = val;
            console.log("server.loading".green, ">> Loaded " + result.length + " creature definitions in " + (Date.now() - ms) + " ms");
        });
    }
    LoadPlayerInfo() {
        var self = this;
        var ms = Date.now();
        this.world.query("SELECT race, class, map, zone, position_x, position_y, position_z, orientation FROM playercreateinfo", function (err, result, fields) {
            for (var val of result) {
                if (!self.playerInfo[val.race])
                    self.playerInfo[val.race] = [];
                self.playerInfo[val.race][val.class] = val;
            }
            console.log("server.loading".green, ">> Loaded " + result.length + " player create definitions in " + (Date.now() - ms) + " ms");
        });
    }
    findBySocket(socket) {
        for (var m of this.map) {
            if (m && m.socket && m.socket == socket)
                return m;
        }
        return null;
    }
    Write(buffer, guid = null) {
        for (var i in manager.map) {
            if (manager.map[i] && manager.map[i].player && manager.map[i].player.guid != guid) {
                if (!manager.map[i].Write(buffer)) {
                   //delete(manager.map[i]); 
                }
            }
        }
    }
}

var manager = new Manager();

module.exports = manager;