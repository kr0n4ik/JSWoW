var Object = require('./Object.js');
class Unit extends Object {
    constructor(guidlow, guidhigh){
        super(guidlow, 0x0000, guidhigh);
        this.maxpower = [0,0,0,0,0,0,0,0];
        this.power = [0,0,0,0,0,0,0,0];
        this.stat = [];
    }
    
    setBoundingRadius(val) {
        this.bit.set(Unit.field.UNIT_FIELD_BOUNDINGRADIUS);
        this.boundingradius = val;
    }
    
    setDisplayID(id) {
		this.bit.set(Unit.field.UNIT_FIELD_DISPLAYID);
		this.bit.set(Unit.field.UNIT_FIELD_NATIVEDISPLAYID);
		//this.bitSet.set(0x0045);
		this.displayId0 = id;
		this.displayId1 = id;
		this.displayId2 = id;
	}
    
    setUnitFlags(val) {
        this.bit.set(Unit.field.UNIT_FIELD_FLAGS);
        this.unitflags = val;
    }
    
    setUnitFlags2(val) {
        this.bit.set(Unit.field.UNIT_FIELD_FLAGS_2);
        this.unitflags2 = val;
    }
    
    setType(type) {
		super.setType(type | 0x0008);
	}
    
    setUnitBytes(bytes){
        this.bit.set(Unit.field.UNIT_FIELD_BYTES_0);
		this.unitbytes = bytes;
    }
    
    setHealth(health) {
        this.bit.set(Unit.field.UNIT_FIELD_HEALTH);
		this.health = health;
    }
    
    setMaxHealth(val) {
        this.bit.set(Unit.field.UNIT_FIELD_MAXHEALTH);
		this.maxhealth = val;
    }
    
    setLevel(val) {
        this.bit.set(Unit.field.UNIT_FIELD_LEVEL);
		this.level = val;
    }
    
    setFactionTemplate(val) {
		this.bit.set(Unit.field.UNIT_FIELD_FACTIONTEMPLATE);
		this.factiontemplate = val;
	}
    
    setPower(val, n) {
		this.bit.set(Unit.field.UNIT_FIELD_HEALTH + n);
		this.power[n] = val;
	}
    
    setMaxPower(val, n) {
		this.bit.set(Unit.field.UNIT_FIELD_MAXHEALTH + n);
		this.maxpower[n] = val;
	}
    
    setStat(val, n) {
        this.bit.set(Unit.field.UNIT_FIELD_STAT0 + n);
        this.stat[n] = val;
    }
    
    setHoverHeight(val) {
        this.bit.set(Unit.field.UNIT_FIELD_HOVERHEIGHT);
        this.hoverhight = val;
    }
    
    ValuesUpdate() {
        super.ValuesUpdate();
        if (this.bit.get(Unit.field.UNIT_FIELD_BYTES_0))
            this.values.uint32(this.unitbytes);
        
        if (this.bit.get(Unit.field.UNIT_FIELD_HEALTH))
            this.values.uint32(this.health);
        
        for (var i = 1; i < 8; ++i) {
            if (this.bit.get(Unit.field.UNIT_FIELD_HEALTH + i))
                this.values.uint32(this.power[i]);
        }
        
        if (this.bit.get(Unit.field.UNIT_FIELD_MAXHEALTH))
            this.values.uint32(this.maxhealth);
        
        for (var i = 1; i < 8; ++i) {
            if (this.bit.get(Unit.field.UNIT_FIELD_MAXHEALTH + i))
                this.values.uint32(this.maxpower[i]);
        }
        
        if (this.bit.get(Unit.field.UNIT_FIELD_LEVEL))
            this.values.uint32(this.level);
        
        if (this.bit.get(Unit.field.UNIT_FIELD_FACTIONTEMPLATE))
            this.values.uint32(this.factiontemplate);
        
        if (this.bit.get(Unit.field.UNIT_FIELD_FLAGS))
            this.values.uint32(this.unitflags);
        
        if (this.bit.get(Unit.field.UNIT_FIELD_FLAGS_2))
            this.values.uint32(this.unitflags2);
        
        if (this.bit.get(Unit.field.UNIT_FIELD_BOUNDINGRADIUS))
            this.values.uint32(this.boundingradius);
        
        if (this.bit.get(Unit.field.UNIT_FIELD_DISPLAYID))
            this.values.uint32(this.displayId0);
        
        if (this.bit.get(Unit.field.UNIT_FIELD_NATIVEDISPLAYID))
            this.values.uint32(this.displayId1);
        
        for (var i = 0; i < 5; ++i) {
            if (this.bit.get(Unit.field.UNIT_FIELD_STAT0 + i))
                this.values.uint32(this.stat[i]);
        }
        
        if (this.bit.get(Unit.field.UNIT_FIELD_HOVERHEIGHT))
            this.values.float(this.hoverhight); 
     }
}
Unit.field = {
	'UNIT_FIELD_CHARM': Object.field.OBJECT_END + 0x0000, // Size: 2, Type: LONG, Flags: PUBLIC
	'UNIT_FIELD_SUMMON': Object.field.OBJECT_END + 0x0002, // Size: 2, Type: LONG, Flags: PUBLIC
	'UNIT_FIELD_CRITTER': Object.field.OBJECT_END + 0x0004, // Size: 2, Type: LONG, Flags: PRIVATE
	'UNIT_FIELD_CHARMEDBY': Object.field.OBJECT_END + 0x0006, // Size: 2, Type: LONG, Flags: PUBLIC
	'UNIT_FIELD_SUMMONEDBY': Object.field.OBJECT_END + 0x0008, // Size: 2, Type: LONG, Flags: PUBLIC
	'UNIT_FIELD_CREATEDBY': Object.field.OBJECT_END + 0x000A, // Size: 2, Type: LONG, Flags: PUBLIC
	'UNIT_FIELD_TARGET': Object.field.OBJECT_END + 0x000C, // Size: 2, Type: LONG, Flags: PUBLIC
	'UNIT_FIELD_CHANNEL_OBJECT': Object.field.OBJECT_END + 0x000E, // Size: 2, Type: LONG, Flags: PUBLIC
	'UNIT_CHANNEL_SPELL': Object.field.OBJECT_END + 0x0010, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_BYTES_0': Object.field.OBJECT_END + 0x0011, // Size: 1, Type: BYTES, Flags: PUBLIC
	'UNIT_FIELD_HEALTH': Object.field.OBJECT_END + 0x0012, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER1': Object.field.OBJECT_END + 0x0013, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER2': Object.field.OBJECT_END + 0x0014, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER3': Object.field.OBJECT_END + 0x0015, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER4': Object.field.OBJECT_END + 0x0016, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER5': Object.field.OBJECT_END + 0x0017, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER6': Object.field.OBJECT_END + 0x0018, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER7': Object.field.OBJECT_END + 0x0019, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXHEALTH': Object.field.OBJECT_END + 0x001A, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXPOWER1': Object.field.OBJECT_END + 0x001B, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXPOWER2': Object.field.OBJECT_END + 0x001C, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXPOWER3': Object.field.OBJECT_END + 0x001D, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXPOWER4': Object.field.OBJECT_END + 0x001E, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXPOWER5': Object.field.OBJECT_END + 0x001F, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXPOWER6': Object.field.OBJECT_END + 0x0020, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MAXPOWER7': Object.field.OBJECT_END + 0x0021, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_POWER_REGEN_FLAT_MODIFIER': Object.field.OBJECT_END + 0x0022, // Size: 7, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POWER_REGEN_INTERRUPTED_FLAT_MODIFIER': Object.field.OBJECT_END + 0x0029, // Size: 7, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_LEVEL': Object.field.OBJECT_END + 0x0030, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_FACTIONTEMPLATE': Object.field.OBJECT_END + 0x0031, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_VIRTUAL_ITEM_SLOT_ID': Object.field.OBJECT_END + 0x0032, // Size: 3, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_FLAGS': Object.field.OBJECT_END + 0x0035, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_FLAGS_2': Object.field.OBJECT_END + 0x0036, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_AURASTATE': Object.field.OBJECT_END + 0x0037, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_BASEATTACKTIME': Object.field.OBJECT_END + 0x0038, // Size: 2, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_RANGEDATTACKTIME': Object.field.OBJECT_END + 0x003A, // Size: 1, Type: INT, Flags: PRIVATE
	'UNIT_FIELD_BOUNDINGRADIUS': Object.field.OBJECT_END + 0x003B, // Size: 1, Type: FLOAT, Flags: PUBLIC
	'UNIT_FIELD_COMBATREACH': Object.field.OBJECT_END + 0x003C, // Size: 1, Type: FLOAT, Flags: PUBLIC
	'UNIT_FIELD_DISPLAYID': Object.field.OBJECT_END + 0x003D, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_NATIVEDISPLAYID': Object.field.OBJECT_END + 0x003E, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MOUNTDISPLAYID': Object.field.OBJECT_END + 0x003F, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_MINDAMAGE': Object.field.OBJECT_END + 0x0040, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER, PARTY_LEADER
	'UNIT_FIELD_MAXDAMAGE': Object.field.OBJECT_END + 0x0041, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER, PARTY_LEADER
	'UNIT_FIELD_MINOFFHANDDAMAGE': Object.field.OBJECT_END + 0x0042, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER, PARTY_LEADER
	'UNIT_FIELD_MAXOFFHANDDAMAGE': Object.field.OBJECT_END + 0x0043, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER, PARTY_LEADER
	'UNIT_FIELD_BYTES_1': Object.field.OBJECT_END + 0x0044, // Size: 1, Type: BYTES, Flags: PUBLIC
	'UNIT_FIELD_PETNUMBER': Object.field.OBJECT_END + 0x0045, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_PET_NAME_TIMESTAMP':Object.field.OBJECT_END + 0x0046, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_PETEXPERIENCE': Object.field.OBJECT_END + 0x0047, // Size: 1, Type: INT, Flags: OWNER
	'UNIT_FIELD_PETNEXTLEVELEXP': Object.field.OBJECT_END + 0x0048, // Size: 1, Type: INT, Flags: OWNER
	'UNIT_DYNAMIC_FLAGS': Object.field.OBJECT_END + 0x0049, // Size: 1, Type: INT, Flags: DYNAMIC
	'UNIT_MOD_CAST_SPEED': Object.field.OBJECT_END + 0x004A, // Size: 1, Type: FLOAT, Flags: PUBLIC
	'UNIT_CREATED_BY_SPELL': Object.field.OBJECT_END + 0x004B, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_NPC_FLAGS': Object.field.OBJECT_END + 0x004C, // Size: 1, Type: INT, Flags: DYNAMIC
	'UNIT_NPC_EMOTESTATE': Object.field.OBJECT_END + 0x004D, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_STAT0': Object.field.OBJECT_END + 0x004E, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_STAT1': Object.field.OBJECT_END + 0x004F, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_STAT2': Object.field.OBJECT_END + 0x0050, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_STAT3': Object.field.OBJECT_END + 0x0051, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_STAT4': Object.field.OBJECT_END + 0x0052, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POSSTAT0': Object.field.OBJECT_END + 0x0053, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POSSTAT1': Object.field.OBJECT_END + 0x0054, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POSSTAT2': Object.field.OBJECT_END + 0x0055, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POSSTAT3': Object.field.OBJECT_END + 0x0056, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POSSTAT4': Object.field.OBJECT_END + 0x0057, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_NEGSTAT0': Object.field.OBJECT_END + 0x0058, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_NEGSTAT1': Object.field.OBJECT_END + 0x0059, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_NEGSTAT2': Object.field.OBJECT_END + 0x005A, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_NEGSTAT3': Object.field.OBJECT_END + 0x005B, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_NEGSTAT4': Object.field.OBJECT_END + 0x005C, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_RESISTANCES': Object.field.OBJECT_END + 0x005D, // Size: 7, Type: INT, Flags: PRIVATE, OWNER, PARTY_LEADER
	'UNIT_FIELD_RESISTANCEBUFFMODSPOSITIVE': Object.field.OBJECT_END + 0x0064, // Size: 7, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_RESISTANCEBUFFMODSNEGATIVE': Object.field.OBJECT_END + 0x006B, // Size: 7, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_BASE_MANA': Object.field.OBJECT_END + 0x0072, // Size: 1, Type: INT, Flags: PUBLIC
	'UNIT_FIELD_BASE_HEALTH': Object.field.OBJECT_END + 0x0073, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_BYTES_2': Object.field.OBJECT_END + 0x0074, // Size: 1, Type: BYTES, Flags: PUBLIC
	'UNIT_FIELD_ATTACK_POWER': Object.field.OBJECT_END + 0x0075, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_ATTACK_POWER_MODS': Object.field.OBJECT_END + 0x0076, // Size: 1, Type: TWO_SHORT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_ATTACK_POWER_MULTIPLIER': Object.field.OBJECT_END + 0x0077, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_RANGED_ATTACK_POWER': Object.field.OBJECT_END + 0x0078, // Size: 1, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_RANGED_ATTACK_POWER_MODS': Object.field.OBJECT_END + 0x0079, // Size: 1, Type: TWO_SHORT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_RANGED_ATTACK_POWER_MULTIPLIER': Object.field.OBJECT_END + 0x007A, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_MINRANGEDDAMAGE': Object.field.OBJECT_END + 0x007B, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_MAXRANGEDDAMAGE': Object.field.OBJECT_END + 0x007C, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POWER_COST_MODIFIER': Object.field.OBJECT_END + 0x007D, // Size: 7, Type: INT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_POWER_COST_MULTIPLIER': Object.field.OBJECT_END + 0x0084, // Size: 7, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_MAXHEALTHMODIFIER': Object.field.OBJECT_END + 0x008B, // Size: 1, Type: FLOAT, Flags: PRIVATE, OWNER
	'UNIT_FIELD_HOVERHEIGHT': Object.field.OBJECT_END + 0x008C, // Size: 1, Type: FLOAT, Flags: PUBLIC
	'UNIT_FIELD_PADDING': Object.field.OBJECT_END + 0x008D, // Size: 1, Type: INT, Flags: NONE
	'UNIT_END': Object.field.OBJECT_END + 0x008E,
};
module.exports = Unit;