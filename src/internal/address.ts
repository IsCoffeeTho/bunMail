import { MailAddressRegExp } from "../..";

export default class mailAddress {
	localPart: string;
	domain: string;
	constructor(addr: string);
	constructor(local: string, domain: string);
	constructor(a: string, b?:string) {
		if (typeof b == "string") {
			this.localPart = a;
			this.domain = b;
			return;
		}
		if (!a.match(MailAddressRegExp))
			throw new SyntaxError("Address is not MailAddress Like");
		var atIndex = a.lastIndexOf("@");
		this.localPart = a.slice(0, atIndex);
		this.domain = a.slice(atIndex + 1);
	}

	toString() {
		return `${this.localPart}@${this.domain}`;
	}
}
