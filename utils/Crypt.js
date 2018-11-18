const crypto = require('crypto');

class Crypt {
	constructor() {
		this.isARC4 = false;
		this.ServerDecryptionBuf = new Buffer.alloc(0x100);
		this.ServerEncryptionBuf = new Buffer.alloc(0x100);
		this.ServerDecryptionI = 0;
		this.ServerDecryptionJ = 0;
		this.ServerEncryptionI = 0;
		this.ServerEncryptionJ = 0;
	}
	enable(hex) {
		var buffer = new Buffer.alloc(hex.length/2);
		for (var i = 0; i < hex.length/2; ++i)
			buffer[i] = parseInt('0x' + hex[2 * i] + hex[2 * i + 1]);
		
		buffer.reverse();
		
		var KeyDecrypt = crypto.createHmac('sha1', new Buffer([0xC2, 0xB3, 0x72, 0x3C, 0xC6, 0xAE, 0xD9, 0xB5, 0x34, 0x3C, 0x53, 0xEE, 0x2F, 0x43, 0x67, 0xCE])).update(buffer).digest();
		var KeyEncrypt = crypto.createHmac('sha1', new Buffer([0xCC, 0x98, 0xAE, 0x04, 0xE8, 0x97, 0xEA, 0xCA, 0x12, 0xDD, 0xC0, 0x93, 0x42, 0x91, 0x53, 0x57])).update(buffer).digest();
		
		for (var i = 0; i < 0x100; ++i) {
			this.ServerDecryptionBuf[i] = i;
			this.ServerEncryptionBuf[i] = i;
		}
		
		for (var i = 0, j = 0, k = 0; i < 0x100; ++i) {
			
			j = ((j + this.ServerDecryptionBuf[i] + KeyDecrypt[i % KeyDecrypt.length]) % 0x100);
			var tempD = this.ServerDecryptionBuf[i];
			this.ServerDecryptionBuf[i] = this.ServerDecryptionBuf[j];
			this.ServerDecryptionBuf[j] = tempD;
			
			k = ((k + this.ServerEncryptionBuf[i] + KeyEncrypt[i % KeyEncrypt.length]) % 0x100);
			var tempE = this.ServerEncryptionBuf[i];
			this.ServerEncryptionBuf[i] = this.ServerEncryptionBuf[k];
			this.ServerEncryptionBuf[k] = tempE;
		}
		
		this.isARC4 = true;
		this.decrypt(new Buffer.alloc(0x400), true);
		this.encrypt(new Buffer.alloc(0x400), true);
	}
	decrypt(buffer, create = false) {
		if (!this.isARC4)
			return buffer;
		
		var length = (!create) ? 6 : 0x400;
		
		var result = new Buffer(buffer);
		for (var i = 0; i < length; i++) {
			this.ServerDecryptionI = (this.ServerDecryptionI + 1) % 0x100;
			this.ServerDecryptionJ = (this.ServerDecryptionJ + this.ServerDecryptionBuf[this.ServerDecryptionI]) % 0x100;
			
			var sTemp = this.ServerDecryptionBuf[this.ServerDecryptionI];
			this.ServerDecryptionBuf[this.ServerDecryptionI] = this.ServerDecryptionBuf[this.ServerDecryptionJ];
			this.ServerDecryptionBuf[this.ServerDecryptionJ] = sTemp;
			result[i] = this.ServerDecryptionBuf[(this.ServerDecryptionBuf[this.ServerDecryptionI] + this.ServerDecryptionBuf[this.ServerDecryptionJ]) % 0x100] ^ buffer[i];
		}
		return result;
	}
	encrypt(buffer, create = false) {
		if (!this.isARC4)
			return buffer;
		
		var length = (!create) ? 4 : 0x400;
		
		var result = new Buffer(buffer);
		for (var i = 0; i < length; i++) {
			this.ServerEncryptionI = (this.ServerEncryptionI + 1) % 0x100;
			this.ServerEncryptionJ = (this.ServerEncryptionJ + this.ServerEncryptionBuf[this.ServerEncryptionI]) % 0x100;
			
			var sTemp = this.ServerEncryptionBuf[this.ServerEncryptionI];
			this.ServerEncryptionBuf[this.ServerEncryptionI] = this.ServerEncryptionBuf[this.ServerEncryptionJ];
			this.ServerEncryptionBuf[this.ServerEncryptionJ] = sTemp;
			result[i] = this.ServerEncryptionBuf[(this.ServerEncryptionBuf[this.ServerEncryptionI] + this.ServerEncryptionBuf[this.ServerEncryptionJ]) % 0x100] ^ buffer[i];
		}
		return result;
	}
}

module.exports = Crypt;
