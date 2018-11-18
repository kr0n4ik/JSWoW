class CMSG {
	constructor(buffer) {
		this.readPos = 6;
		this.data = new Uint8Array(buffer);
		this.view = new DataView(this.data.buffer);
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
		return this.uint32() | (this.uint32() << 32);
	}
	uint8() {
		var val = this.view.getUint8(this.readPos, true);
		this.readPos += 1;
		return val;
	}
	string(){
		var startPos = this.readPos;
		while (this.uint8());
		var strArray = this.data.subarray(startPos, this.readPos - 1);
		return String.fromCharCode.apply(null, strArray);
	}
}
module.exports = CMSG;