import { Socket } from "net";
import mailServer from "../internal/mailserver";
import mailService from "../service";

export class ProtocolWrapper {
	constructor(service: mailService, socket: Socket) {

	}

	send(code: number, ...msg: string[]) {
		var packet = msg.map((v, i, a) => {
			return `${code}${(i < (a.length-1)) ? "-" : " "}${v}`;
		});

		console.log(packet);
	}
}