import { Socket, TLSUpgradeOptions } from "bun";
import { SMTPOptions } from "./server";
import { ReplyCode_std_reply, SMTPReplyCode } from "./constants";

export enum SMTPState {
	UNINITIATED,
	DATA,
}

export default class agent<T> {
	#connection: Socket<this>;
	#opt: SMTPOptions<this>;
	#upgrade: TLSUpgradeOptions<this>;
	#secured = false;

	state: SMTPState = SMTPState.UNINITIATED;
	
	forwardPath?: string;
	constructor(
		opt: SMTPOptions<T>,
		connection: Socket<agent<T>>,
		upgradeInfo: TLSUpgradeOptions<agent<T>>,
	) {
		this.#opt = opt;
		this.#connection = <Socket<this>>connection;
		this.#upgrade = <TLSUpgradeOptions<this>>upgradeInfo;
	}

	send(code: SMTPReplyCode, ...message: string[]) {
		if (message.length == 0)
			message = [
				(ReplyCode_std_reply[code] ?? "Custom reply code").replace(
					/\{\{domain\}\}/g,
					this.#opt.domain ?? process.env['HOSTNAME'] ?? "localhost"
				).replace(
					/\{\{forwardPath\}\}/g,
					this.forwardPath ?? "<forward-path>"
				),
			];

		message = message.map((v) => v.split("\n")).flat();

		message = message.map((v, i, a) => {
			if (a.length - 1 == i) return `${code} ${v}`;
			return `${code}-${v}`;
		});

		this.#connection.write(`${message.join("\r\n")}\r\n`);
	}

	acceptData() {
		// if (this.state != ) // pre DATA state check
		this.state = SMTPState.DATA;
		this.send(SMTPReplyCode.StartMessage);
	}

	startTls() {
		if (this.#secured)
			throw new Error("Connection tried to double up on TLS connection");
		this.#connection = <Socket<this>>(
			this.#connection.upgradeTLS(this.#upgrade)[1]
		);
		this.#secured = true;
		this.state = SMTPState.UNINITIATED;
	}
}
