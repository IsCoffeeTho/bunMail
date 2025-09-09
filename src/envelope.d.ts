import type { Address } from "./address";
import type { MsgID } from "./identifier";

/* Describes a particular inbox of an individual, group, or system(s) */
export type Mailbox = Address;

/* A string used to indicate the path for which upstream messages are sent. (Back to sender) */
export type reversePath = string;

/** @see {@linkcode envelope.resends} */
export type resentFields = {
	/**
	 * Header: `Resent-Date:`
	 *
	 * Indicates the date and time at which the resent message is dispatched by the resender of the message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 */
	date: Date;

	/**
	 * Header: `Resent-From:`
	 *
	 * Indentical to {@linkcode envelope.from} however it contains the mailbox(es) or address(es) of the group(s) or individual(s) respectfully, doing the resending.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc6854#section-2.2 (RFC6854) Update to RFC 5322 Section.3.6.6. Resent Fields}
	 */
	from: (Mailbox | Address)[];

	/**
	 * Header: `Resent-Sender:`
	 *
	 * Indentical to {@linkcode envelope.sender} however it contains the mailbox or address particular group or individual respectfully, resending the message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc6854#section-2.2 (RFC6854) Update to RFC 5322 Section.3.6.6. Resent Fields}
	 */
	sender?: Mailbox | Address;

	/**
	 * Header: `Resent-To:`
	 *
	 * Indentical to {@linkcode envelope.to} however it contains the Address(es) of the recipients of the resent message and NOT the original recipients.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 */
	to: Address[];

	/**
	 * Header: `Resent-Cc:`
	 *
	 * Indentical to {@linkcode envelope.carbonCopy} however it contains the Address(es) of the recipients of the resent message and NOT the original recipients.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 */
	carbonCopy: Address[];

	/**
	 * Header: `Resent-Bcc:`
	 *
	 * Indentical to {@linkcode envelope.blindCarbonCopy} however it contains the Address(es) of the recipients of the resent message and NOT the original
	 * recipients.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 */
	blindCarbonCopy: Address[];

	/**
	 * Header: `Resent-Message-ID:`
	 *
	 * Indentical to {@linkcode envelope.messageID} however it differs in value to indicate the Message Identifier of the resent message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 */
	messageId: MsgID;
};

/**
 * Contains all necessary information about an email and its delivery. Based on {@link https://datatracker.ietf.org/doc/html/rfc5322 RFC5322}.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc5321 (RFC5321) Simple Mail Transfer Protocol}
 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322 (RFC5322) Internet Message Format}
 * @see {@link https://datatracker.ietf.org/doc/html/rfc6854 (RFC6854) Update to Internet Message Format to Allow Group Syntax in the "From:" and "Sender:" Header Fields}
 */
export interface envelope {
	/**
	 * Header: `From:`
	 *
	 * The author(s) of the message, that is, mailbox(es) of the individuals(s), group(s), or system(s) responsible for the writing of the message
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.2 (RFC5322) Originator Fields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc6854#section-2.1 Replacement of RFC 5322 Section.3.6.2. Originator Fields}
	 **/
	from: (Mailbox | Address)[];

	/**
	 * Header: `Sender:`
	 *
	 * The mailbox of the agent responsible for the actual transmission of the message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.2 (RFC5322) Originator Fields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc6854#section-2.1 Replacement of RFC 5322 Section.3.6.2. Originator Fields}
	 **/
	sender?: Mailbox | Address;
	/**
	 * Header: `Reply-To:`
	 *
	 * Indicates the address(es) to which the author of the message suggest that replies be sent.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.2 (RFC5322) Originator Fields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc6854#section-2.1 Replacement of RFC 5322 Section.3.6.2. Originator Fields}
	 */
	replyTo: Address[];

	/**
	 * Header: `To:`
	 *
	 * Contains the address(es) of the primary recipient(s) of the message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.3 (RFC5322) Destination Address Fields}
	 */
	to: Address[];

	/**
	 * Header: `Cc:`
	 *
	 * Contains the addresses of others who are to receive the message, though the content of the message may not be directed at them.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.3 (RFC5322) Destination Address Fields}
	 */
	carbonCopy: Address[];

	/**
	 * Header: `Bcc:`
	 *
	 * Contains addresses of recipients of the message whose addresses are not to be revealed to other recipients of the message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.3 (RFC5322) Destination Address Fields}
	 */
	blindCarbonCopy: Address[];

	/**
	 * Header: `Date:`
	 *
	 * The origination date specifies the date and time at which the creator of the message indicated that the message was complete and ready to enter the mail
	 * delivery system.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.1 (RFC5322) The Origination Date Field}
	 */
	originDate: Date;

	/**
	 * Header: `Message-ID:`
	 *
	 * Provides a unique message identifier that refers to a particular version of a particular message. The uniqueness of the message identifier is guaranteed
	 * by the host that generates it.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.4 (RFC5322) Identification Fields}
	 */
	messageID: MsgID;

	/**
	 * Header: `In-Reply-To:`
	 *
	 * Used to identify the message (or messages) to which the new message is a reply.
	 *
	 * Used in conjunction with {@linkcode enveloped.references} when creating a reply to a message. They hold the message identifier of the original message
	 * and the message identifiers of other messages
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.4 (RFC5322) Identification Fields}
	 */
	inReplyTo: MsgID[];

	/**
	 * Header: `References:`
	 *
	 * Used to identify a "thread" of conversation.
	 *
	 * Used in conjunction with {@linkcode enveloped.inReplyTo} when creating a reply to a message. They hold the message identifier of the original message and
	 * the message identifiers of other messages.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.4 (RFC5322) Identification Fields}
	 */
	references: MsgID[];

	/**
	 * Header: `Subject:`
	 *
	 * Contains a short string identifying the topic of the message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.5 (RFC5322) Informational Fields}
	 */
	subject: string;

	/**
	 * Header: `Comments:`
	 *
	 * Contains additional comments on the text of the body of the message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.5 (RFC5322) Informational Fields}
	 */
	comments?: string;

	/**
	 * Header: `Keywords:`
	 *
	 * Contains a list of important words or phrases that might be useful for the recipient.
	 * Understandably used to make searching through emails easier.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.5 (RFC5322) Informational Fields}
	 */
	keywords: string[];

	/**
	 * Header: `Resent-(*):`
	 *
	 * Used to identify a message as having been reintroduced into the transport system by a user. The purpose of using resent fields is to have to the message
	 * appear to the final recipient as if it were sent directly by the original fields remaining the same.
	 *
	 * Informational fields only (NOT to be used in processing the email)
	 * 
	 * @see {@linkcode resentFields type resentFields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.6 (RFC5322) Resent Fields}
	 */
	resends: resentFields[];

	/**
	 * Header: `Return-Path:`
	 *
	 * Provides information about where to send message delivery errors about the current message.
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.7 (RFC5322) Trace Fields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5321#section-4.4 (RFC5321) Trace Information}
	 */
	returnPath: reversePath;

	/**
	 * Header: `Recieved:`
	 *
	 * Contains a list of Mail Exchange Relays and times the message has been relayed to such
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.7 (RFC5322) Trace Fields}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5321#section-4.4 (RFC5321) Trace Information}
	 */
	received: {
		by: string;
		time: Date;
	}[];

	/**
	 * Header: `Authentication-Results:`
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.8 (RFC5322) Optional Fields}
	 *
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc7208 (RFC7208) Sender Policy Framework (SPF) for Authorizing Use of Domains in Email, Version 1}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc7489 (RFC7489) Domain-based Message Authentication, Reporting and Conformance (DMARC)}
	 * @see {@link https://datatracker.ietf.org/doc/html/rfc6376 (RFC6376) DomainKeys Identified Mail (DKIM) Signatures}
	 */
	authenticationResults?: {
		/** @see {@link https://datatracker.ietf.org/doc/html/rfc7208 (RFC7208) Sender Policy Framework (SPF) for Authorizing Use of Domains in Email, Version 1} */
		spf?: string;
		/** @see {@link https://datatracker.ietf.org/doc/html/rfc6376 (RFC6376) DomainKeys Identified Mail (DKIM) Signatures} */
		dkim?: string;
		/** @see {@link https://datatracker.ietf.org/doc/html/rfc7489 (RFC7489) Domain-based Message Authentication, Reporting and Conformance (DMARC)} */
		dmarc?: string;
	};
}
