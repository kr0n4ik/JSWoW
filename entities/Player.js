const Unit = require('./Unit.js');
const Bytes = require('../utils/Bytes.js');
const obfield = require('../enums/obfield.js');
const unfield = require('../enums/unfield.js');

class Player extends Unit {
    constructor(){
        super();
        this.factiontemplate = 1;
    }
    
    setSocket(val) {
        this.socket = val;
    }
    
    ValuesUpdate() {
        super.ValuesUpdate();
    }
    ValuesBlock(block) {
        this.ValuesUpdate();
        var bits = this.bit.buffer();
		block.uint8(bits.length/4);
		block.array(bits, false);
		block.array(this.values.buffer(), false);
    }
    Create(updateflag) {
        this.setUpdateFlag(updateflag);
        this.bit.set(obfield.OBJECT_FIELD_GUID);
        this.bit.set(obfield.OBJECT_FIELD_GUID + 1);
        this.bit.set(obfield.OBJECT_FIELD_TYPE);
        this.bit.set(obfield.OBJECT_FIELD_SCALE_X);
        this.bit.set(unfield.UNIT_FIELD_FACTIONTEMPLATE);
        this.bit.set(unfield.UNIT_FIELD_DISPLAYID);
        this.bit.set(unfield.UNIT_FIELD_NATIVEDISPLAYID);
        this.bit.set(unfield.UNIT_FIELD_HEALTH);
        this.bit.set(unfield.UNIT_FIELD_LEVEL);
        
        var block = new Bytes();
        this.MovementBlock(block);
        this.ValuesBlock(block);
        return block.buffer();
    }
    
    setType() {
        super.setType();
        this.type = this.type | 0x0010;
    }
}
module.exports = Player;