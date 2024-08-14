import mailServer from "../internal/mailserver";
import mailService from "../service";

export default class SMTPSubmissionServer extends mailServer {
	constructor(service: mailService) {
		super(service);
	}
}