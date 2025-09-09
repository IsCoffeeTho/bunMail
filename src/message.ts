import type { envelope, Mailbox } from "./envelope";
import { MsgID } from "./identifier";

export default class Message implements envelope {
	from = [];
	replyTo = [];
	to = [];
	carbonCopy = [];
	blindCarbonCopy = [];
	messageID = new MsgID();
	inReplyTo = [];
	references = [];
	subject = "";
	keywords = [];
	resends = [];
	returnPath = "";
	received = [];
	authenticationResults = {};
	originDate: Date;
	constructor() {
		this.originDate = new Date();
	}
}