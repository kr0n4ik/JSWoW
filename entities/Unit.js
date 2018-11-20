const Object = require('./Object.js');
const Bytes = require('../utils/Bytes.js');
const unfield = require('../enums/unfield.js');

class Unit extends Object {
    constructor(guidlow){
        super();
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
    }
    ValuesUpdate() {
        super.ValuesUpdate();
         if (this.bit.get(unfield.UNIT_FIELD_HEALTH))
            this.values.uint32(this.health);
        
        if (this.bit.get(unfield.UNIT_FIELD_LEVEL))
            this.values.uint32(this.level);
        
        if (this.bit.get(unfield.UNIT_FIELD_FACTIONTEMPLATE))
            this.values.uint32(this.factiontemplate);
        
        if (this.bit.get(unfield.UNIT_FIELD_DISPLAYID))
            this.values.uint32(this.displayId[0]);
        
        if (this.bit.get(unfield.UNIT_FIELD_NATIVEDISPLAYID))
            this.values.uint32(this.displayId[1]);
     }
    MovementBlock(block) {
        block.uint8(3);
		block.guid(this.guid);
		block.uint8(0x004);
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
}
module.exports = Unit;