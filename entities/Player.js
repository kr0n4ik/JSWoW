const Unit = require('./Unit.js');
const Bytes = require('../utils/Bytes.js');

class Player extends Unit {
    constructor(id){
        super(id, 0x0000);
        this.setScale(1.0);
		this.setType();
        this.movementFlags = 0;
        this.extraFlags = 0;
        this.x;
        this.y;
        this.z;
        this.o;
        this.spells = [59752, 81,8737,202,522,3050,22810,1843,7267,21651,196,204,668,9116,21652,3365,5301,6477,9077,9125,20597,61437,78,198,2382,6246,6478,9078,20598,6247,20599,32215,45927,20684,201,2457,6233,58985,7266,8386,107,203,6603,7355,22027];
    }
    
    setPosition(x,y,z,o) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.o = o;
    }
    
    setType() {
		super.setType(0x0010);
	}
    
    setPlayerBytes(val){
        this.bit.set(Player.field.PLAYER_BYTES);
        this.playerbytes = val;
    }
    
    setPlayerBytes2(val){
        this.bit.set(Player.field.PLAYER_BYTES_2);
        this.playerbytes2 = val;
    }
    
    setNextLevelXP(val) {
        this.bit.set(Player.field.PLAYER_NEXT_LEVEL_XP);
        this.nextlevelxp = val;
    }
    
    ValuesUpdate() {
        super.ValuesUpdate();
        if (this.bit.get(Player.field.PLAYER_BYTES))
            this.values.uint32(this.playerbytes);
        
        if (this.bit.get(Player.field.PLAYER_BYTES_2))
            this.values.uint32(this.playerbytes2);
        
        if (this.bit.get(Player.field.PLAYER_NEXT_LEVEL_XP))
            this.values.uint32(this.nextlevelxp);
    }
    Values(block) {
        this.ValuesUpdate();
        var bits = this.bit.buffer();
		block.uint8(bits.length/4);
		block.array(bits, false);
		block.array(this.values.buffer(), false);
    }
    Movement(block) {
        block.uint8(3);
		block.guid(this.guid);
		block.uint8(0x004);
		block.uint16(113); //97
		block.uint32(this.movementFlags);
		block.uint16(this.extraFlags);
		block.uint32(0);
		block.float(this.x);
		block.float(this.y);
		block.float(this.z);
		block.float(this.o);
		block.uint32(0);
		block.float(10.0);
		block.float(10.0);
		block.float(1.0);
		block.float(1.0);
		block.float(1.0);
		block.float(1.0);
		block.float(1.0);
		block.float(1.0);
		block.float(1.0);
		block.uint32(parseInt(this.guid & BigInt(0xFFFFFFFF)));
    }
    BlockBuffer() {
        var block = new Bytes();
        this.Movement(block);
        this.Values(block);
        return block.buffer();
    }
}
Player.field = {
    'PLAYER_DUEL_ARBITER': Unit.field.UNIT_END + 0x0000, // Size: 2, Type: LONG, Flags: PUBLIC
	'PLAYER_FLAGS': Unit.field.UNIT_END + 0x0002, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_GUILDID': Unit.field.UNIT_END + 0x0003, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_GUILDRANK': Unit.field.UNIT_END + 0x0004, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_BYTES': Unit.field.UNIT_END + 0x0005, // Size: 1, Type: BYTES, Flags: PUBLIC
	'PLAYER_BYTES_2': Unit.field.UNIT_END + 0x0006, // Size: 1, Type: BYTES, Flags: PUBLIC
	'PLAYER_BYTES_3': Unit.field.UNIT_END + 0x0007, // Size: 1, Type: BYTES, Flags: PUBLIC
	'PLAYER_DUEL_TEAM': Unit.field.UNIT_END + 0x0008, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_GUILD_TIMESTAMP': Unit.field.UNIT_END + 0x0009, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_QUEST_LOG_1_1': Unit.field.UNIT_END + 0x000A, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_1_2': Unit.field.UNIT_END + 0x000B, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_1_3': Unit.field.UNIT_END + 0x000C, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_1_4': Unit.field.UNIT_END + 0x000E, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_2_1': Unit.field.UNIT_END + 0x000F, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_2_2': Unit.field.UNIT_END + 0x0010, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_2_3': Unit.field.UNIT_END + 0x0011, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_2_5': Unit.field.UNIT_END + 0x0013, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_3_1': Unit.field.UNIT_END + 0x0014, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_3_2': Unit.field.UNIT_END + 0x0015, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_3_3': Unit.field.UNIT_END + 0x0016, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_3_5': Unit.field.UNIT_END + 0x0018, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_4_1': Unit.field.UNIT_END + 0x0019, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_4_2': Unit.field.UNIT_END + 0x001A, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_4_3': Unit.field.UNIT_END + 0x001B, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_4_5': Unit.field.UNIT_END + 0x001D, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_5_1': Unit.field.UNIT_END + 0x001E, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_5_2': Unit.field.UNIT_END + 0x001F, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_5_3': Unit.field.UNIT_END + 0x0020, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_5_5': Unit.field.UNIT_END + 0x0022, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_6_1': Unit.field.UNIT_END + 0x0023, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_6_2': Unit.field.UNIT_END + 0x0024, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_6_3': Unit.field.UNIT_END + 0x0025, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_6_5': Unit.field.UNIT_END + 0x0027, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_7_1': Unit.field.UNIT_END + 0x0028, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_7_2': Unit.field.UNIT_END + 0x0029, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_7_3': Unit.field.UNIT_END + 0x002A, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_7_5': Unit.field.UNIT_END + 0x002C, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_8_1': Unit.field.UNIT_END + 0x002D, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_8_2': Unit.field.UNIT_END + 0x002E, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_8_3': Unit.field.UNIT_END + 0x002F, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_8_5': Unit.field.UNIT_END + 0x0031, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_9_1': Unit.field.UNIT_END + 0x0032, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_9_2': Unit.field.UNIT_END + 0x0033, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_9_3': Unit.field.UNIT_END + 0x0034, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_9_5': Unit.field.UNIT_END + 0x0036, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_10_1': Unit.field.UNIT_END + 0x0037, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_10_2': Unit.field.UNIT_END + 0x0038, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_10_3': Unit.field.UNIT_END + 0x0039, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_10_5': Unit.field.UNIT_END + 0x003B, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_11_1': Unit.field.UNIT_END + 0x003C, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_11_2': Unit.field.UNIT_END + 0x003D, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_11_3': Unit.field.UNIT_END + 0x003E, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_11_5': Unit.field.UNIT_END + 0x0040, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_12_1': Unit.field.UNIT_END + 0x0041, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_12_2': Unit.field.UNIT_END + 0x0042, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_12_3': Unit.field.UNIT_END + 0x0043, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_12_5': Unit.field.UNIT_END + 0x0045, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_13_1': Unit.field.UNIT_END + 0x0046, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_13_2': Unit.field.UNIT_END + 0x0047, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_13_3': Unit.field.UNIT_END + 0x0048, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_13_5': Unit.field.UNIT_END + 0x004A, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_14_1': Unit.field.UNIT_END + 0x004B, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_14_2': Unit.field.UNIT_END + 0x004C, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_14_3': Unit.field.UNIT_END + 0x004D, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_14_5': Unit.field.UNIT_END + 0x004F, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_15_1': Unit.field.UNIT_END + 0x0050, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_15_2': Unit.field.UNIT_END + 0x0051, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_15_3': Unit.field.UNIT_END + 0x0052, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_15_5': Unit.field.UNIT_END + 0x0054, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_16_1': Unit.field.UNIT_END + 0x0055, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_16_2': Unit.field.UNIT_END + 0x0056, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_16_3': Unit.field.UNIT_END + 0x0057, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_16_5': Unit.field.UNIT_END + 0x0059, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_17_1': Unit.field.UNIT_END + 0x005A, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_17_2': Unit.field.UNIT_END + 0x005B, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_17_3': Unit.field.UNIT_END + 0x005C, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_17_5': Unit.field.UNIT_END + 0x005E, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_18_1': Unit.field.UNIT_END + 0x005F, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_18_2': Unit.field.UNIT_END + 0x0060, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_18_3': Unit.field.UNIT_END + 0x0061, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_18_5': Unit.field.UNIT_END + 0x0063, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_19_1': Unit.field.UNIT_END + 0x0064, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_19_2': Unit.field.UNIT_END + 0x0065, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_19_3': Unit.field.UNIT_END + 0x0066, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_19_5': Unit.field.UNIT_END + 0x0068, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_20_1': Unit.field.UNIT_END + 0x0069, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_20_2': Unit.field.UNIT_END + 0x006A, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_20_3': Unit.field.UNIT_END + 0x006B, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_20_5': Unit.field.UNIT_END + 0x006D, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_21_1': Unit.field.UNIT_END + 0x006E, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_21_2': Unit.field.UNIT_END + 0x006F, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_21_3': Unit.field.UNIT_END + 0x0070, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_21_5': Unit.field.UNIT_END + 0x0072, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_22_1': Unit.field.UNIT_END + 0x0073, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_22_2': Unit.field.UNIT_END + 0x0074, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_22_3': Unit.field.UNIT_END + 0x0075, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_22_5': Unit.field.UNIT_END + 0x0077, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_23_1': Unit.field.UNIT_END + 0x0078, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_23_2': Unit.field.UNIT_END + 0x0079, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_23_3': Unit.field.UNIT_END + 0x007A, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_23_5': Unit.field.UNIT_END + 0x007C, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_24_1': Unit.field.UNIT_END + 0x007D, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_24_2': Unit.field.UNIT_END + 0x007E, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_24_3': Unit.field.UNIT_END + 0x007F, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_24_5': Unit.field.UNIT_END + 0x0081, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_25_1': Unit.field.UNIT_END + 0x0082, // Size: 1, Type: INT, Flags: PARTY_MEMBER
	'PLAYER_QUEST_LOG_25_2': Unit.field.UNIT_END + 0x0083, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_25_3': Unit.field.UNIT_END + 0x0084, // Size: 2, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_QUEST_LOG_25_5': Unit.field.UNIT_END + 0x0086, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_VISIBLE_ITEM_1_ENTRYID': Unit.field.UNIT_END + 0x0087, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_1_ENCHANTMENT': Unit.field.UNIT_END + 0x0088, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_2_ENTRYID': Unit.field.UNIT_END + 0x0089, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_2_ENCHANTMENT': Unit.field.UNIT_END + 0x008A, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_3_ENTRYID': Unit.field.UNIT_END + 0x008B, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_3_ENCHANTMENT': Unit.field.UNIT_END + 0x008C, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_4_ENTRYID': Unit.field.UNIT_END + 0x008D, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_4_ENCHANTMENT': Unit.field.UNIT_END + 0x008E, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_5_ENTRYID': Unit.field.UNIT_END + 0x008F, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_5_ENCHANTMENT': Unit.field.UNIT_END + 0x0090, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_6_ENTRYID': Unit.field.UNIT_END + 0x0091, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_6_ENCHANTMENT': Unit.field.UNIT_END + 0x0092, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_7_ENTRYID': Unit.field.UNIT_END + 0x0093, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_7_ENCHANTMENT': Unit.field.UNIT_END + 0x0094, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_8_ENTRYID': Unit.field.UNIT_END + 0x0095, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_8_ENCHANTMENT': Unit.field.UNIT_END + 0x0096, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_9_ENTRYID': Unit.field.UNIT_END + 0x0097, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_9_ENCHANTMENT': Unit.field.UNIT_END + 0x0098, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_10_ENTRYID': Unit.field.UNIT_END + 0x0099, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_10_ENCHANTMENT': Unit.field.UNIT_END + 0x009A, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_11_ENTRYID': Unit.field.UNIT_END + 0x009B, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_11_ENCHANTMENT': Unit.field.UNIT_END + 0x009C, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_12_ENTRYID': Unit.field.UNIT_END + 0x009D, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_12_ENCHANTMENT': Unit.field.UNIT_END + 0x009E, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_13_ENTRYID': Unit.field.UNIT_END + 0x009F, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_13_ENCHANTMENT': Unit.field.UNIT_END + 0x00A0, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_14_ENTRYID': Unit.field.UNIT_END + 0x00A1, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_14_ENCHANTMENT': Unit.field.UNIT_END + 0x00A2, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_15_ENTRYID': Unit.field.UNIT_END + 0x00A3, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_15_ENCHANTMENT': Unit.field.UNIT_END + 0x00A4, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_16_ENTRYID': Unit.field.UNIT_END + 0x00A5, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_16_ENCHANTMENT': Unit.field.UNIT_END + 0x00A6, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_17_ENTRYID': Unit.field.UNIT_END + 0x00A7, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_17_ENCHANTMENT': Unit.field.UNIT_END + 0x00A8, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_18_ENTRYID': Unit.field.UNIT_END + 0x00A9, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_18_ENCHANTMENT': Unit.field.UNIT_END + 0x00AA, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_19_ENTRYID': Unit.field.UNIT_END + 0x00AB, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_VISIBLE_ITEM_19_ENCHANTMENT': Unit.field.UNIT_END + 0x00AC, // Size: 1, Type: TWO_SHORT, Flags: PUBLIC
	'PLAYER_CHOSEN_TITLE': Unit.field.UNIT_END + 0x00AD, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_FAKE_INEBRIATION': Unit.field.UNIT_END + 0x00AE, // Size: 1, Type: INT, Flags: PUBLIC
	'PLAYER_FIELD_PAD_0': Unit.field.UNIT_END + 0x00AF, // Size: 1, Type: INT, Flags: NONE
	'PLAYER_FIELD_INV_SLOT_HEAD': Unit.field.UNIT_END + 0x00B0, // Size: 46, Type: LONG, Flags: PRIVATE
	'PLAYER_FIELD_PACK_SLOT_1': Unit.field.UNIT_END + 0x00DE, // Size: 32, Type: LONG, Flags: PRIVATE
	'PLAYER_FIELD_BANK_SLOT_1': Unit.field.UNIT_END + 0x00FE, // Size: 56, Type: LONG, Flags: PRIVATE
	'PLAYER_FIELD_BANKBAG_SLOT_1': Unit.field.UNIT_END + 0x0136, // Size: 14, Type: LONG, Flags: PRIVATE
	'PLAYER_FIELD_VENDORBUYBACK_SLOT_1': Unit.field.UNIT_END + 0x0144, // Size: 24, Type: LONG, Flags: PRIVATE
	'PLAYER_FIELD_KEYRING_SLOT_1': Unit.field.UNIT_END + 0x015C, // Size: 64, Type: LONG, Flags: PRIVATE
	'PLAYER_FIELD_CURRENCYTOKEN_SLOT_1': Unit.field.UNIT_END + 0x019C, // Size: 64, Type: LONG, Flags: PRIVATE
	'PLAYER_FARSIGHT': Unit.field.UNIT_END + 0x01DC, // Size: 2, Type: LONG, Flags: PRIVATE
	'PLAYER__FIELD_KNOWN_TITLES': Unit.field.UNIT_END + 0x01DE, // Size: 2, Type: LONG, Flags: PRIVATE
	'PLAYER__FIELD_KNOWN_TITLES1': Unit.field.UNIT_END + 0x01E0, // Size: 2, Type: LONG, Flags: PRIVATE
	'PLAYER__FIELD_KNOWN_TITLES2': Unit.field.UNIT_END + 0x01E2, // Size: 2, Type: LONG, Flags: PRIVATE
	'PLAYER_FIELD_KNOWN_CURRENCIES': Unit.field.UNIT_END + 0x01E4, // Size: 2, Type: LONG, Flags: PRIVATE
	'PLAYER_XP': Unit.field.UNIT_END + 0x01E6, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_NEXT_LEVEL_XP': Unit.field.UNIT_END + 0x01E7, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_SKILL_INFO_1_1': Unit.field.UNIT_END + 0x01E8, // Size: 384, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_CHARACTER_POINTS1': Unit.field.UNIT_END + 0x0368, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_CHARACTER_POINTS2': Unit.field.UNIT_END + 0x0369, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_TRACK_CREATURES': Unit.field.UNIT_END + 0x036A, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_TRACK_RESOURCES': Unit.field.UNIT_END + 0x036B, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_BLOCK_PERCENTAGE': Unit.field.UNIT_END + 0x036C, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_DODGE_PERCENTAGE': Unit.field.UNIT_END + 0x036D, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_PARRY_PERCENTAGE': Unit.field.UNIT_END + 0x036E, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_EXPERTISE': Unit.field.UNIT_END + 0x036F, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_OFFHAND_EXPERTISE': Unit.field.UNIT_END + 0x0370, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_CRIT_PERCENTAGE': Unit.field.UNIT_END + 0x0371, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_RANGED_CRIT_PERCENTAGE': Unit.field.UNIT_END + 0x0372, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_OFFHAND_CRIT_PERCENTAGE': Unit.field.UNIT_END + 0x0373, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_SPELL_CRIT_PERCENTAGE1': Unit.field.UNIT_END + 0x0374, // Size: 7, Type: FLOAT, Flags: PRIVATE
	'PLAYER_SHIELD_BLOCK': Unit.field.UNIT_END + 0x037B, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_SHIELD_BLOCK_CRIT_PERCENTAGE': Unit.field.UNIT_END + 0x037C, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_EXPLORED_ZONES_1': Unit.field.UNIT_END + 0x037D, // Size: 128, Type: BYTES, Flags: PRIVATE
	'PLAYER_REST_STATE_EXPERIENCE': Unit.field.UNIT_END + 0x03FD, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_COINAGE': Unit.field.UNIT_END + 0x03FE, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_DAMAGE_DONE_POS': Unit.field.UNIT_END + 0x03FF, // Size: 7, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_DAMAGE_DONE_NEG': Unit.field.UNIT_END + 0x0406, // Size: 7, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_DAMAGE_DONE_PCT': Unit.field.UNIT_END + 0x040D, // Size: 7, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_HEALING_DONE_POS': Unit.field.UNIT_END + 0x0414, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_HEALING_PCT': Unit.field.UNIT_END + 0x0415, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_HEALING_DONE_PCT': Unit.field.UNIT_END + 0x0416, // Size: 1, Type: FLOAT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_TARGET_RESISTANCE': Unit.field.UNIT_END + 0x0417, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_MOD_TARGET_PHYSICAL_RESISTANCE': Unit.field.UNIT_END + 0x0418, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_BYTES': Unit.field.UNIT_END + 0x0419, // Size: 1, Type: BYTES, Flags: PRIVATE
	'PLAYER_AMMO_ID': Unit.field.UNIT_END + 0x041A, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_SELF_RES_SPELL': Unit.field.UNIT_END + 0x041B, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_PVP_MEDALS': Unit.field.UNIT_END + 0x041C, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_BUYBACK_PRICE_1': Unit.field.UNIT_END + 0x041D, // Size: 12, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_BUYBACK_TIMESTAMP_1': Unit.field.UNIT_END + 0x0429, // Size: 12, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_KILLS': Unit.field.UNIT_END + 0x0435, // Size: 1, Type: TWO_SHORT, Flags: PRIVATE
	'PLAYER_FIELD_TODAY_CONTRIBUTION': Unit.field.UNIT_END + 0x0436, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_YESTERDAY_CONTRIBUTION': Unit.field.UNIT_END + 0x0437, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_LIFETIME_HONORBALE_KILLS': Unit.field.UNIT_END + 0x0438, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_BYTES2': Unit.field.UNIT_END + 0x0439, // Size: 1, Type: 6, Flags: PRIVATE
	'PLAYER_FIELD_WATCHED_FACTION_INDEX': Unit.field.UNIT_END + 0x043A, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_COMBAT_RATING_1': Unit.field.UNIT_END + 0x043B, // Size: 25, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_ARENA_TEAM_INFO_1_1': Unit.field.UNIT_END + 0x0454, // Size: 21, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_HONOR_CURRENCY': Unit.field.UNIT_END + 0x0469, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_ARENA_CURRENCY': Unit.field.UNIT_END + 0x046A, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_MAX_LEVEL': Unit.field.UNIT_END + 0x046B, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_DAILY_QUESTS_1': Unit.field.UNIT_END + 0x046C, // Size: 25, Type: INT, Flags: PRIVATE
	'PLAYER_RUNE_REGEN_1': Unit.field.UNIT_END + 0x0485, // Size: 4, Type: FLOAT, Flags: PRIVATE
	'PLAYER_NO_REAGENT_COST_1': Unit.field.UNIT_END + 0x0489, // Size: 3, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_GLYPH_SLOTS_1': Unit.field.UNIT_END + 0x048C, // Size: 6, Type: INT, Flags: PRIVATE
	'PLAYER_FIELD_GLYPHS_1': Unit.field.UNIT_END + 0x0492, // Size: 6, Type: INT, Flags: PRIVATE
	'PLAYER_GLYPHS_ENABLED': Unit.field.UNIT_END + 0x0498, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_PET_SPELL_POWER': Unit.field.UNIT_END + 0x0499, // Size: 1, Type: INT, Flags: PRIVATE
	'PLAYER_END': Unit.field.UNIT_END + 0x049A
}
module.exports = Player;