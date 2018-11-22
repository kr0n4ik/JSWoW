class CMSG {
	constructor(buffer) {
		this.readPos = 6;
		this.data = new Uint8Array(buffer);
		this.view = new DataView(this.data.buffer);
        this.code = buffer[3] << 8 | buffer[2];
        this.size = buffer[0] << 8 | buffer[1];
	}
    uint8() {
		var val = this.view.getUint8(this.readPos, true);
		this.readPos += 1;
		return val;
	}
	uint16() {
		var val = this.view.getUint16(this.readPos, true);
		this.readPos += 2;
		return val;
	}
	uint32() {
		var val = this.view.getUint32(this.readPos, true);
		this.readPos += 4;
		return val;
	}
	uint64() {
		return BigInt(this.uint32()) | (BigInt(this.uint32()) << 32n);
	}
    float() {
        var val = this.view.getFloat32(this.readPos, true);
		this.readPos += 4;
		return val;
    }
    array(len = 1, rev = false) {
        var arr = this.data.subarray(this.readPos, this.readPos + len);
        if (rev)
            arr.reverse();
        this.readPos += len;
        return new Buffer(arr);
    }
	string(){
        var strArray = [];
        for (var i = 0; i < 255; ++i) {
            var code = this.uint8();
            if (code == 0)
                break;
            strArray.push(code);
        }
        return new Buffer(strArray).toString();
	}
    guid() {
        var guid = 0n; 
        var guidmark = this.uint8();
        for (var i = 0; i < 8; ++i) {
            if (guidmark & (1 << i)) {
                var b = this.uint8();
                guid |= (BigInt(b) << BigInt(i * 8)); 
            }
        }
        return guid;
    }
}
module.exports = CMSG;