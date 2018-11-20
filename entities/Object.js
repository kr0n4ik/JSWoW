const Bytes = require('../utils/Bytes.js');
const Bit = require('../utils/bit.js');
const obfield = require('../enums/obfield.js');

class Object {
    constructor(){
        this.scale = 1.0;
        this.guidlow = 0;
        this.entry = 0;
        this.guidhight = 0;
        this.guid = 0n;
        this.type = 0;
        this.values = new Bytes();
        this.bit = new Bit();
    }
    setGuid(low, hight) {
		this.bit.set(obfield.OBJECT_FIELD_GUID);
		this.bit.set(obfield.OBJECT_FIELD_GUID + 1);
        this.guidlow = low;
        this.guidhight = hight;
		this.guid = BigInt(BigInt(this.guidlow) | (BigInt(this.entry) << 24n) | (BigInt(this.guidhight) << 48n));
		this.GUID(this.guid);
	}
	setType() {
		this.bit.set(obfield.OBJECT_FIELD_TYPE);
		this.type = this.type | 0x0001; //mask TYPEMASK_OBJECT;
	}
	setEntry(entry) {
		this.bit.set(obfield.OBJECT_FIELD_ENTRY);
		this.entry = entry;
        this.setGuidLow(this.guidlow);
	}
	setScale(scale) {
		this.bit.set(obfield.OBJECT_FIELD_SCALE_X);
		this.scale = scale;
	}
    setGuidHight(val) {
        this.guidhight = val;
        this.setGuidLow(this.guidlow); 
    }
	GUID(guid) {
		var tguid = guid;
		var packGUID = new Buffer.alloc(9);
		packGUID[0] = 0;
		var size = 1;
		for (var i = 0; tguid != 0; ++i) { 
			if ((tguid & BigInt(0xFF)) > 0) {
				packGUID[0] |= (1 << i);
				packGUID[size] = parseInt(tguid & BigInt(0xFF));
				++size;
			}
			tguid >>= 8n;
		}
		this.puid = packGUID.slice(0, size);
	}
	ValuesUpdate() {
		if (this.bit.get(obfield.OBJECT_FIELD_GUID))
			this.values.uint64(this.guid);
		
		if (this.bit.get(obfield.OBJECT_FIELD_TYPE))
			this.values.uint32(this.type);
		
		if (this.bit.get(obfield.OBJECT_FIELD_ENTRY))
			this.values.uint32(this.entry);
		
		if (this.bit.get(obfield.OBJECT_FIELD_SCALE_X))
			this.values.float(this.scale);
	}
}
module.exports = Object;