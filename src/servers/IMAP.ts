import mailServer from "../internal/mailserver";
import mailService from "../service";

export default class IMAPServer extends mailServer {
	constructor(service: mailService) {
		super(service);
	}
}