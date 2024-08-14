type linkedListNode<T> = {
	value: T;
	next?: linkedListNode<T>;
	prev?: linkedListNode<T>;
}

export default class linkedList<T> { // Generic Direction Queue
	#root?: linkedListNode<T>;
	#boot?: linkedListNode<T>;
	#count: number = 0;

	get length() {
		return this.#count;
	}

	push(value: T) { // append
		var node: linkedListNode<T> = {
			value: value
		};
		this.#count++;
		if (this.#count == 1) {
			this.#root = node;
			this.#boot = node;
			return;
		}
		var prevBoot = <linkedListNode<T>>this.#boot;
		prevBoot.next = node;
		node.prev = prevBoot;
		this.#boot = node;
	}

	pop() { // remove last
		if (this.#count == 0)
			return null;
		var ret: T = (<linkedListNode<T>>this.#boot).value;
		this.#count--;
		if (this.#count == 0) {
			this.#root = undefined;
			this.#boot = undefined;
			return ret;
		}
		this.#boot = (<linkedListNode<T>>this.#boot).prev;
		(<linkedListNode<T>>this.#boot).next = undefined;
		return ret;
	}

	unshift(value: T) { // prepend
		var node: linkedListNode<T> = {
			value: value
		};
		this.#count++;
		if (this.#count == 1) {
			this.#root = node;
			this.#boot = node;
			return;
		}
		var prevRoot = <linkedListNode<T>>this.#root;
		prevRoot.prev = node;
		node.next = prevRoot;
		this.#root = node;
	}

	shift() { // remove first
		if (this.#count == 0)
			return null;
		var ret: T = (<linkedListNode<T>>this.#root).value;
		this.#count--;
		if (this.#count == 0) {
			this.#root = undefined;
			this.#boot = undefined;
			return ret;
		}
		this.#root = (<linkedListNode<T>>this.#root).next;
		(<linkedListNode<T>>this.#root).prev = undefined;
		return ret;
	}

	toString() {
		var ret = "";
		var current = this.#root;
		for (var i = 0; i < 10; i++) {
			if (!current)
				break;
			ret += `, ${current.value}`;
			current = current.next;
		}
		if (current && current.next)
			ret += ', ...';
		return `{ ${ret.slice(2)} }`;
	}
}