export class Address {
	localpart: string;
	domain: string;
	
	constructor();
	constructor(address: string);
	constructor(localPart: string, domain: string);
	constructor(a?: string, b?: string) {
		if (!b) {
			if (!a)
				a = "@";
			[a, b] = a.split("@");
		}
		this.localpart = <string>a;
		this.domain = <string>b;
	}
	
	equals(other: Address) {
		return (this.localpart == other.localpart) && (this.domain == other.domain);
	}
}

Address.prototype.toString = function () {
	return `${this.localpart}@${this.domain}`
}