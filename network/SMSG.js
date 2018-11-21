const zlib = require('zlib');
class SMSG {
    constructor(code) {
        this.code = code;
		this.dataLength = 0;
		this.data = new Uint8Array(8096000);
		this.view = new DataView(this.data.buffer);
       // this.uint16(code);
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
        if (this.code == 0x0A9 && this.dataLength > 100) {
            this.code = 0x01F6; 
            var buffer = new Buffer.alloc(this.dataLength);
            for (var i = 0; i < this.dataLength; ++i)
                buffer[i] = this.data[i];
            var zip = zlib.deflateSync(buffer, {level: zlib.Z_NO_COMPRESSION});
            this.dataLength = 0;
            this.uint32(zip.length);
            this.array(zip, false); 
        }
		var buffer = new Buffer.alloc(this.dataLength + 4);
		buffer[0] = ((this.dataLength + 2) >> 8) & 0xFF;
		buffer[1] = (this.dataLength + 2) & 0xFF;
        buffer[2] = this.code & 0xFF;
        buffer[3] = (this.code >> 8) & 0xFF;
		for (var i = 0; i < this.dataLength; ++i)
			buffer[i + 4] = this.data[i];
        console.log('[DEBUG]'.blue + ' code: ' + this.code.toString(16) + ' length: ' + this.dataLength);
		return buffer;
	}
}
module.exports = SMSG;