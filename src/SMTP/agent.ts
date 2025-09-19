import { Socket, TLSUpgradeOptions } from "bun";
import { SMTPListenerOptions } from "./server";
import { ReplyCode_std_reply, SMTPReplyCode } from "./constants";

export enum SMTPState {
	UNINITIATED,
	ENCRYPTING,
	INITIATED,
	DATA,
}

export default class agent<T> {
	#connection: Socket<this>;
	#opt: SMTPListenerOptions<this>;
	#upgrade: TLSUpgradeOptions<this>;
	#secured = false;

	get secured() {
		return this.#secured;
	}

	state: SMTPState = SMTPState.UNINITIATED;

	forwardPath?: string;
	constructor(
		opt: SMTPListenerOptions<T>,
		connection: Socket<agent<T>>,
		upgradeInfo: TLSUpgradeOptions<agent<T>>,
	) {
		this.#opt = opt;
		this.#connection = <Socket<this>>connection;
		this.#upgrade = <TLSUpgradeOptions<this>>upgradeInfo;

		if (opt.tls?.implicit) this.#upgradeTLS();
	}

	send(code: SMTPReplyCode, ...message: string[]) {
		if (message.length == 0)
			message = [
				(ReplyCode_std_reply[code] ?? "Custom reply code")
					.replace(
						/\{\{domain\}\}/g,
						this.#opt.name ??
							process.env["HOSTNAME"] ??
							"localhost",
					)
					.replace(
						/\{\{forwardPath\}\}/g,
						this.forwardPath ?? "<forward-path>",
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
		// if (this.state != SMTPState.) // pre DATA state check
		this.state = SMTPState.DATA;
		this.send(SMTPReplyCode.StartMessage);
	}

	async startTls(message = "START TLS; see you on the other side") {
		if (this.#secured)
			throw new Error("Cannot STARTTLS on encrypted connection");
		this.send(SMTPReplyCode.ActionCompleted, message);
		if (!(await this.#upgradeTLS()))
			throw new Error("Socket failed to START TLS");
		// this.state = SMTPState.UNINITIATED;
		return true;
	}

	async #upgradeTLS() {
		if (this.#secured)
			throw new Error("Connection tried to double up on TLS connection");
		this.state = SMTPState.ENCRYPTING;
		var [cleartext, encrypted] = this.#connection.upgradeTLS(this.#upgrade);
		if (encrypted) {
			encrypted.data = this;
			this.#connection = <Socket<this>>encrypted;
			this.#secured = true;
		}
		return this.#secured;
	}
}
