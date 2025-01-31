export type mailbox = {
	name: string,
	address: string
};

export type mailboxValidator = mailbox & {
	accept(): any;
	reject(): any;
};

export interface envelope {
	from: mailbox;
	to: mailbox[];
	subject: string;
}