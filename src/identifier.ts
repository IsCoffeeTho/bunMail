export class MsgID {
	UID: string;
	domain: string;
	
	constructor();
	constructor(msgId: string);
	constructor(uid: string, domain: string);
	constructor(a?: string, b?: string) {
		if (!b) {
			if (!a)
				a = "<@>";
			if (!a.startsWith("<") || !a.endsWith(">"))
				throw new Error("MsgID must be wrapped in Angled Brackets '<' & '>'");
			[a, b] = a.slice(1,-1).split("@");
		}
		this.UID = <string>a;
		this.domain = <string>b;
	}
	
	equals(other: MsgID) {
		return (this.UID == other.UID) && (this.domain == other.domain);
	}
}

MsgID.prototype.toString = function () {
	return `<${this.UID}@${this.domain}>`
}