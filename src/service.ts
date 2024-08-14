import bunMail from "..";
import mailServer from "./internal/mailserver";
import IMAPServer from "./servers/IMAP";
import POP3Server from "./servers/POP3";
import SMTPSubmissionServer from "./servers/SMTPSubmission";
import SMTPTransferServer from "./servers/SMTPTransfer";

export default class mailService {
	#MailSubmissionAgent: SMTPSubmissionServer;
	#MailTransferAgent: SMTPTransferServer;
	#POP3: POP3Server;
	#IMAP: IMAPServer;
	constructor(opt: bunMail.mailServiceOptions) {
		this.#MailSubmissionAgent = new SMTPSubmissionServer(this);
		this.#MailTransferAgent = new SMTPTransferServer(this);
		this.#POP3 = new POP3Server(this);
		this.#IMAP = new IMAPServer(this);
	}

	get SubmissionSMTP() { return this.#MailSubmissionAgent; }
	get TransferSMTP() { return this.#MailTransferAgent; }
	get pop3() { return this.#POP3; }
	get imap() { return this.#IMAP; }


}