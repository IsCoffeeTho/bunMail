import mailServer from "../internal/mailserver";
import mailService from "../service";

export default class SMTPTransferServer extends mailServer {
	constructor(service: mailService) {
		super(service);
	}
}