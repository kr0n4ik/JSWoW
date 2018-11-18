const Bytes = require('../utils/Bytes.js');
const Bit = require('../utils/bit.js');

class Object {
    constructor(guidlow, entry, guidhigh){
        this.values = new Bytes();
        this.bit = new Bit();
        this.setGuid(BigInt(BigInt(guidlow) | (BigInt(entry) << 24n) | (BigInt(guidhigh) << 48n)));
    }
    setGuid(guid) {
		this.bit.set(Object.field.OBJECT_FIELD_GUID);
		this.bit.set(Object.field.OBJECT_FIELD_GUID + 1);
		this.guid = guid;
		this.GUID(guid);
	}
	setType(type) {
		this.bit.set(Object.field.OBJECT_FIELD_TYPE);
		this.type = type | 0x0001; //mask TYPEMASK_OBJECT;
	}
	setEntry(entry) {
		this.bit.set(Object.field.OBJECT_FIELD_ENTRY);
		this.entry = entry;
	}
	setScale(scale) {
		this.bit.set(Object.field.OBJECT_FIELD_SCALE_X);
		this.scale = scale;
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
		if (this.bit.get(Object.field.OBJECT_FIELD_GUID))
			this.values.uint64(this.guid);
		
		if (this.bit.get(Object.field.OBJECT_FIELD_TYPE))
			this.values.uint32(this.type);
		
		if (this.bit.get(Object.field.OBJECT_FIELD_ENTRY))
			this.values.uint32(this.entry);
		
		if (this.bit.get(Object.field.OBJECT_FIELD_SCALE_X))
			this.values.float(this.scale);
	}
}
Object.field = {
	'OBJECT_FIELD_GUID': 0x0000, // Size: 2, Type: LONG, Flags: PUBLIC
	'OBJECT_FIELD_TYPE': 0x0002, // Size: 1, Type: INT, Flags: PUBLIC
	'OBJECT_FIELD_ENTRY': 0x0003, // Size: 1, Type: INT, Flags: PUBLIC
	'OBJECT_FIELD_SCALE_X': 0x0004, // Size: 1, Type: FLOAT, Flags: PUBLIC
	'OBJECT_FIELD_PADDING': 0x0005, // Size: 1, Type: INT, Flags: NONE
	'OBJECT_END': 0x0006
};
module.exports = Object;