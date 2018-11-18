class Bit {
	constructor() {
		this.bit = 0n;
	}
	set(pos) {
		this.bit |= (1n << BigInt(pos)); 
	}
	get(pos) {
		return ((this.bit & (1n << BigInt(pos))) === (1n << BigInt(pos))) ? true : false;
	}
	buffer() {
		var buffer = [];
		var size = 0;
		for (var i = 0n; i < 168n; ++i) {
			var bit = this.bit >> (i * 8n);
			if (bit === 0n)
				break;
			buffer[size] = parseInt( bit & BigInt(0xFF));
			++size;
		}
		switch(buffer.length%4) {
			case 1: buffer[size] = 0; buffer[size+1] = 0; buffer[size+2] = 0; break;
			case 2: buffer[size] = 0; buffer[size+1] = 0; break;
			case 3: buffer[size] = 0; break;
		}
		this.bit = 0n;
		return new Buffer(buffer);
	}
}

module.exports = Bit;
