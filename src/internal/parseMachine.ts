export default class parseMachine {
	i: number;
	#s: string;
	constructor(s: string) {
		this.i = 0
		this.#s = s;
	}

	adv() {
		this.i++;
	}

	hasTok() {
		return (this.i < this.#s.length);
	}

	tok() {
		return this.#s[this.i];
	}

	capture(regex: RegExp) {
		if (!regex.source.startsWith("^"))
			regex = new RegExp(`^${regex.source}`);
		var matchList = this.#s.slice(this.i).match(regex);
		if (!matchList || matchList.length == 0)
			return null;
		this.i += matchList[0].length;
		return matchList[0];
	}

	commit() {
		return this.#s.slice(this.i);
	}
}