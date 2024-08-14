import mailServer from "../internal/mailserver";
import mailService from "../service";

export default class POP3Server extends mailServer {
	constructor(service: mailService) {
		super(service);
	}
}