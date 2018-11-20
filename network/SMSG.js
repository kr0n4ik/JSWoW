class SMSG {
    constructor(code) {
        this.code = code;
		this.dataLength = 0;
		this.data = new Uint8Array(809600);
		this.view = new DataView(this.data.buffer);
        this.uint16(code);
	}
    uint8(val) {
		this.view.setUint8(this.dataLength, val);
		this.dataLength += 1;
	}
	uint16(val) {
		this.view.setUint16(this.dataLength, val, true);
		this.dataLength += 2;
	}
	uint32(val) {
		this.view.setUint32(this.dataLength, val, true);
		this.dataLength += 4;
	}
	float(val) {
		this.view.setFloat32(this.dataLength, val, true);
		this.dataLength += 4;
	}
    uint64(val) {
		this.uint32(parseInt(BigInt(val) & BigInt(0xFFFFFFFF)));
		this.uint32(parseInt((BigInt(val) >> 32n) & BigInt(0xFFFFFFFF)));
	}
    array(val, rev = true) {
        if (rev)
            for (var i = val.length - 1; i >= 0; --i)
                this.uint8(val[i]);
        else
            for (var i = 0; i < val.length; ++i)
                this.uint8(val[i]);
	}
    string(val) {
        var val = new Buffer(val);
        for (var i = 0; i < val.length; ++i)
            this.uint8(val[i] & 0xFF);
		this.uint8(0);
	}
    guid(val) {
		var tguid = BigInt(val);
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
		this.array(packGUID.slice(0, size), false);
	}
    buffer() {
		var buffer = new Buffer.alloc(this.dataLength + 2);
		buffer[0] = this.dataLength >> 8;
		buffer[1] = this.dataLength;
		for (var i = 0; i < this.dataLength; ++i)
			buffer[i + 2] = this.data[i];
       // console.log('[DEBUG]'.blue + ' code: ' + this.code + ' length: ' + this.dataLength);
		return buffer;
	}
}
module.exports = SMSG;