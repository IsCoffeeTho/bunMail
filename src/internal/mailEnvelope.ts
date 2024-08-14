import mailAddress from "./address";
import { SMTPLineRegExp } from "../..";
import parseMachine from "./parseMachine";

/** 
 * @see {@link https://datatracker.ietf.org/doc/html/rfc822}
 */
export class rfc822parser {
	raw: string;
	constructor() {
		this.raw = "";
	}

	build() {
		var message = new mailEnvelope();
		var pm = new parseMachine(this.raw);
		while (pm.hasTok()) {
			var line = pm.capture(SMTPLineRegExp);
			if (!line)
				break;
			line = line.slice(0, -2);
			if (line.length == 0)
				break;
			var headerPM = new parseMachine(line);
			var headerName = headerPM.capture(/[^:]+/g);
			if (!headerName)
				continue; // discard header
			headerPM.capture(/:\s*/g); // remove leading whitespace
			message.headers.set(headerName, headerPM.commit().replace(/\r\n(\s)+/g, (g, wsp) => wsp));
		}
		var MIMEType = message.headers.get("Content-Type");
		if (!MIMEType?.startsWith("multipart/alternative;")) {
			message.body = pm.commit();
			return message;
		}
		var boundarySegment = MIMEType.match(/boundary="([^"]+)"/g);
		var boundary = "";
		if (boundarySegment) {
			boundary = boundarySegment[0].slice('boundary="'.length, -1);
		}
		message.body = {};
		message.boundary = boundary;
		var multipart = pm.commit().split(`--${boundary}`);
		multipart.pop();
		multipart.shift();
		for (var part in multipart) {
			var section = multipart[part];
			if (section.startsWith("--"))
				break;
			var messagePart = new mailPart();
			var partPM = new parseMachine(section.slice(2));
			while (partPM.hasTok()) {
				var line = partPM.capture(SMTPLineRegExp);
				if (!line)
					break;
				line = line.slice(0, -2);
				if (line.length == 0)
					break;
				var headerPM = new parseMachine(line);
				var headerName = headerPM.capture(/[^:]+/g);
				if (!headerName)
					continue; // discard header
				headerPM.capture(/:\s*/g); // remove leading whitespace
				messagePart.headers.set(headerName, headerPM.commit().replace(/\r\n(\s)+/g, (g, wsp) => wsp));
			}
			messagePart.content = partPM.commit();
			message.body[(messagePart.headers.get("Content-Type")?.match(/[^;]+/g) ?? ["unknown/undefined"])[0]] = messagePart;
		}
		return message;
	}
}

export class mailPart {
	headers: Map<string, string> = new Map<string, string>();
	content: string = "";

	asEML() {
		var headers = "";
		this.headers.forEach((v, k) => {
			headers += `${k}: ${v}\r\n`;
		})
		return `${headers}\r\n${this.content}`;
	}
}

export class mailEnvelope extends mailPart {
	Recipients: mailAddress[] = [];
	Sender: mailAddress = new mailAddress("null@null");
	body: string | { [_: string]: mailPart } = "";
	boundary?: string;

	constructor() {
		super();
	}

	asEML() {
		var headers = "";
		this.headers.forEach((v, k) => {
			headers += `${k}: ${v}\r\n`;
		})
		if (typeof this.body == "string")
			return `${headers}\r\n${this.body}`;
		var body = "";
		for (var type in this.body) {
			var section = this.body[type];
			body += `\r\n--${this.boundary}\r\n`;
			body += section.asEML();
		}
		return `${headers}${body}\r\n--${this.boundary}--`;
	}
}