const base64bucket = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64decode(str: string) {
	var accumulator = 0;
	var offset = 0;
	var output = "";
	for (var i = 0; i < str.length; i++) {
		var value = 0;
		if (str[i] != '=')
			value = base64bucket.indexOf(str[i]);
		if (value < 0)
			throw new Error("Invalid Characters in base64 String");
		accumulator <<= 6;
		accumulator |= value;
		if (offset > 0) { output += String.fromCharCode((accumulator >> (6 - offset)) & 0xff); }
		offset += 2;
		offset %= 8;
	}
	if (offset != 0)
		throw new Error("Invalid Padding");
	return output;
}

function base64encode(str: string) {
	var output = "";
	var accumulator = 0;
	var accumOffset = 0;
	for (var i = 0; i < str.length; i++) {
		accumulator |= str.charCodeAt(i) << (((2 - i) % 3) * 8);
		accumOffset += 8;
		if ((i % 3) != 2) continue;

		for (var j = 6; j <= 24; j += 6) {
			var k = 24 - j;
			var v = (accumulator >> k) & 63;
			output += base64bucket[v];
		}
		accumulator = 0;
		accumOffset = 0;
	}
	if (accumOffset > 0) {
		for (var j = 6; j <= 24; j += 6) {
			var k = 24 - j;
			if ((j - 6) > accumOffset) {
				output += "=";
				continue;
			}
			var v = (accumulator >> k) & 63;
			output += base64bucket[v];
		}
	}
	return output;
}

export default {
	decode: base64decode,
	encode: base64encode
};