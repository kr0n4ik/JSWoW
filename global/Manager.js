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
        this.itemTemplate  = [];
        this.LoadCreatureTemplates();
     //   this.LoadPlayerInfo();
        this.LoadChrRacesDBC();
      //  this.LoadItemTemplates();
    }
    
    LoadChrRacesDBC() {
        var ms = Date.now();
        for (var val of ChrRaces) {
            this.ChrRaces[val.ID] = val;
        }
        console.log("server.loading".green, ">> Loaded ChrRaces definitions in " + (Date.now() - ms) + " ms");
    }
    
    LoadItemTemplates() {
        var self = this;
        var ms = Date.now();
        this.world.query("SELECT * FROM item_template", function (err, result, fields) {
            for (var val of result) 
                self.itemTemplate[val.entry] = val;
            console.log("server.loading".green, ">> Loaded " + result.length + " item definitions in " + (Date.now() - ms) + " ms");
        });
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
    
    ReciveSession(socket, buffer) {
        for (var i in this.map)
            if (this.map[i].socket && this.map[i].socket == socket)
                this.map[i].Recive(buffer);
    }
    
    DeleteSession(socket) {
        for (var i in this.map) {
            if (this.map[i].socket && this.map[i].socket == socket) {
                if (!this.map[i].guid) {
                    this.map.splice(i, 1);
                    break;
                }
                if (this.map[i].ping < (Date.now() - 120000)) //4 ping'a 
                   this.map.splice(i, 1);
                break; 
            }
        }
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
            if (manager.map[i] && manager.map[i].socket && manager.map[i].online && manager.map[i].guid != guid) {
                manager.map[i].Write(buffer);
            }
        }
    }
}

var manager = new Manager();

module.exports = manager;