import { Socket } from "bun";
import bunSMTP, { SMTPServerAgentHandlers } from "./SMTP";
import { envelope } from "./envelope";
import { EventEmitter } from "events";

export enum SMTPState {
	welcoming,
	welcome,
	envelope,
	
};

const SMTPReplyCodeLUT: {[_:number]:string} = {
	211: "Status not implemented",
	214: "Help not implemented",
	220: "Service Ready",
	221: "Service closing transmission channel",
	250: "OK",
	251: "User not local",
	252: "Cannot VRFY user, but will accept message and attempt delivery",
	354: "Start mail input; end with <CRLF>.<CRLF>",
	421: "Service Not available; closing transmission channel",
	450: "Requested mail action not taken: mailbox unavailable",
	451: "Requested action aborted: local error in processing",
	452: "Requested action not taken: insufficient system storage",
	455: "Server unable to accommodate parameters",
	500: "Syntax Error, command unrecognized",
	501: "Syntax Error in paramters or arguments",
	502: "Command not implemented",
	503: "Bad Sequence of commandss",
	504: "Command parameter not implemented",
	550: "Requested action not taken: mailbox unavailable",
	551: "User not local; please send message to other server",
	552: "Requested mail action aborted: exceeded storage allocation",
	553: "Requested action not taken: mailbox name not allowed",
	554: "Transaction failed",
	555: "MAIL FROM/RCPT TO parameters not recognized or not implemented"
};

export default class SMTPAgent<user_type = any> {
	envelope: envelope = {
		from: {
			name: "",
			address: ""
		},
		to: [],
		subject: ""
	};
	user?: user_type;
	_command: ((command: string[]) => any) = (_) => {};
	
	state: SMTPState = SMTPState.welcoming;
	
	#socket: Socket<SMTPAgent<user_type>>;
	constructor(agentHandler: SMTPServerAgentHandlers<user_type>, socket: Socket<SMTPAgent<user_type>>) {
		this.#socket = socket;
	}
	
	reply(code: number, message?:string, ...lines:string[]) {
		if (!message)
			message = (SMTPReplyCodeLUT[code]) ?? "Custom Reply";
		lines.unshift(message);
		return lines.flatMap((v, i, a) => {
			return `${code.toString().padStart(3, "000")}${(i < (a.length - 1) ? '-' : ' ')}${v}`
		})
	}
}
