const Object = require('./Object.js');
const Bytes = require('../utils/Bytes.js');
const unfield = require('../enums/unfield.js');
const obfield = require('../enums/obfield.js');

class Unit extends Object {
    constructor(guidlow){
        super();
        this.map = 0;
        this.x = -8931.06;
        this.y = -129.243;
        this.z = 82.3808;
        this.o = 0.208124;
        this.updateflag = 0;
        this.WalkSpeed = 2.5;
		this.RunSpeed = 7.0;
		this.RunBackSpeed = 4.5;
		this.SwimSpeed = 4.7;
		this.SwimBackSpeed = 2.5;
		this.TurnSpeed = 7.0;
		this.FlySpeed = 4.5;
		this.FlyBackSpeed = 3.14;
		this.PitchSpeed = 3.14;
        this.time = 0;
        this.level = 1;
        this.displayId = [49,49,49];
        this.health = 1;
        this.npcflag = 0;
        this.unitflag = 0;
        this.unitflag2 = 0;
        this.unitbytes = 0;
        this.spells = [59752, 81,8737,202,522,3050,22810,1843,7267,21651,196,204,668,9116,21652,3365,5301,6477,9077,9125,20597,61437,78,198,2382,6246,6478,9078,20598,6247,20599,32215,45927,20684,201,2457,6233,58985,7266,8386,107,203,6603,7355,22027];
    }
    ValuesUpdate() {
        super.ValuesUpdate();
        if (this.bit.get(unfield.UNIT_FIELD_BYTES_0))
            this.values.uint32(this.unitbytes);
        
         if (this.bit.get(unfield.UNIT_FIELD_HEALTH))
            this.values.uint32(this.health);
        
        if (this.bit.get(unfield.UNIT_FIELD_LEVEL))
            this.values.uint32(this.level);
        
        if (this.bit.get(unfield.UNIT_FIELD_FACTIONTEMPLATE))
            this.values.uint32(this.factiontemplate);
        
        if (this.bit.get(unfield.UNIT_FIELD_FLAGS))
            this.values.uint32(this.unitflag);
        
        if (this.bit.get(unfield.UNIT_FIELD_FLAGS_2))
            this.values.uint32(this.unitflag2);
        
        if (this.bit.get(unfield.UNIT_FIELD_DISPLAYID))
            this.values.uint32(this.displayId[0]);
        
        if (this.bit.get(unfield.UNIT_FIELD_NATIVEDISPLAYID))
            this.values.uint32(this.displayId[1]);
        
        if (this.bit.get(unfield.UNIT_NPC_FLAGS))
            this.values.uint32(this.npcflag);
     }
     ValuesBlock(block) {
        this.ValuesUpdate();
        var bits = this.bit.buffer();
		block.uint8(bits.length/4);
		block.array(bits, false);
		block.array(this.values.buffer(), false);
    }
    MovementBlock(block) {
        switch(this.guidhight) {
            case 0x0000: block.uint8(0x003); break;
            case 0xF130: block.uint8(0x002); break;
        }
		block.guid(this.guid);
        switch(this.guidhight) {
            case 0x0000: block.uint8(0x004); break;
            case 0xF130: block.uint8(0x003); break;
        }
		block.uint16(this.updateflag); //97
		block.uint32(0);
		block.uint16(0);
		block.uint32(this.time);
		block.float(this.x);
		block.float(this.y);
		block.float(this.z);
		block.float(this.o);
		block.uint32(0);
		block.float(this.WalkSpeed);
		block.float(this.RunSpeed);
		block.float(this.RunBackSpeed);
		block.float(this.SwimSpeed);
		block.float(this.SwimBackSpeed);
		block.float(this.TurnSpeed);
		block.float(this.FlySpeed);
		block.float(this.FlyBackSpeed);
		block.float(this.PitchSpeed);
		block.uint32(parseInt(this.guid & BigInt(0xFFFFFFFF)));
    }
    setUnitBytes(val){
        this.bit.set(unfield.UNIT_FIELD_BYTES_0);
		this.unitbytes = val;
    }
    setUnitFlags2(val) {
        this.bit.set(unfield.UNIT_FIELD_FLAGS_2);
        this.unitflag2 = val;
    }
    setUnitFlags(val) {
        this.bit.set(unfield.UNIT_FIELD_FLAGS);
        this.unitflag = val;
    }
    setNpcFlags(val) {
        this.bit.set(unfield.UNIT_NPC_FLAGS);
        this.npcflag = val;
    }
    
    setType() {
        super.setType();
        this.type = this.type | 0x0008;
    }
    
    setUpdateFlag(val) {
        this.updateflag = val;
    }
    
    setTime(val) {
        this.time = val;
    }
    setPosition(x,y,z,o) {
        this.x = Math.round(x*10)/10;
        this.y = Math.round(y*10)/10;
        this.z = Math.round(z*10)/10;
        this.o = Math.round(o*10)/10;
    }
    setLevel(val){
        this.bit.set(unfield.UNIT_FIELD_LEVEL);
		this.level = val;
    }
    setDisplayID(id) {
		this.bit.set(unfield.UNIT_FIELD_DISPLAYID);
		this.bit.set(unfield.UNIT_FIELD_NATIVEDISPLAYID);
		//this.bitSet.set(0x0045);
		this.displayId[0] = id;
		this.displayId[1] = id;
		this.displayId[2] = id;
	}
    Create() {
        this.bit.set(obfield.OBJECT_FIELD_GUID);
        this.bit.set(obfield.OBJECT_FIELD_GUID + 1);
        this.bit.set(obfield.OBJECT_FIELD_TYPE);
        this.bit.set(obfield.OBJECT_FIELD_SCALE_X);
        this.bit.set(unfield.UNIT_FIELD_FACTIONTEMPLATE);
        this.bit.set(unfield.UNIT_FIELD_DISPLAYID);
        this.bit.set(unfield.UNIT_FIELD_NATIVEDISPLAYID);
        this.bit.set(unfield.UNIT_FIELD_HEALTH);
        this.bit.set(unfield.UNIT_FIELD_LEVEL);
        this.bit.set(unfield.UNIT_FIELD_FLAGS);
        this.bit.set(unfield.UNIT_FIELD_FLAGS_2);
        this.bit.set(unfield.UNIT_FIELD_BYTES_0);
        this.bit.set(unfield.UNIT_NPC_FLAGS);
        
        var block = new Bytes();
        this.MovementBlock(block);
        this.ValuesBlock(block);
        return block.buffer();
    }
    
    getPositionX() {
        return this.x;
    }
    getPositionY() {
        return this.y;
    }
    getPositionZ() {
        return this.z;
    }
    getMapId() {
        return this.map;
    }
    getOrientation() {
        return this.o;
    }
}
module.exports = Unit;