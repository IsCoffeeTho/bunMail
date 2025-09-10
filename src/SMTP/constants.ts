export enum SMTPReplyCode {
	SystemStatus = 211,
	HelpMessage = 214,
	
	ServiceReady = 220,
	ServiceClosing = 221,
	ActionCompleted = 250,
	OK = ActionCompleted,
	WarnUserNotLocal = 251,
	CannotVFRYuser = 252,
	
	StartMessage = 354,
	
	ServiceNotAvailable = 421,
	MailboxUnavailableTemporarily = 450,
	LocalError = 451,
	InsufficientStorage = 452,
	CannotFulfillParameters = 455,
	
	CommandUnrecognized = 500,
	ParametersUnrecognized = 501,
	CommandNotImplemented = 502,
	BadSequence = 503,
	ParameterNotImplemented = 504,
	
	MailboxUnavailable = 550,
	UserNotLocal = 551,
	ExceededStorageAllocation = 552,
	MailboxNameNotAllowed = 553,
	TransactionFailed = 554,
	EnvelopeHasBadInfo = 555,
}

export const ReplyCode_std_reply = {
	[SMTPReplyCode.SystemStatus]: "System Status",
	[SMTPReplyCode.HelpMessage]: "Help message",
	
	[SMTPReplyCode.ServiceReady]: "{{domain}} Service Ready",
	[SMTPReplyCode.ServiceClosing]: "{{domain}} Service closing transmission channel",
	[SMTPReplyCode.ActionCompleted]: "OK",
	[SMTPReplyCode.WarnUserNotLocal]: "User not local; will forward to {{forwardPath}}",
	[SMTPReplyCode.CannotVFRYuser]: "Cannot VRFY user, but will accept message and attempt delivery",
	
	[SMTPReplyCode.StartMessage]: "Start mail input; end with <CRLF>.<CRLF>",
	
	[SMTPReplyCode.ServiceNotAvailable]: "{{domain}} Service not available, closing transmission channel",
	[SMTPReplyCode.MailboxUnavailableTemporarily]: "Requested mail action not taken: mailbox unavailable (temporarily)",
	[SMTPReplyCode.LocalError]: "Requested action aborted: local error in processing",
	[SMTPReplyCode.InsufficientStorage]: "Requested action not taken: insufficient system storage",
	[SMTPReplyCode.CannotFulfillParameters]: "Server unable to accomodate parameters",
	
	[SMTPReplyCode.CommandUnrecognized]: "Syntax error, command unrecognized",
	[SMTPReplyCode.ParametersUnrecognized]: "Syntax error in parameters or arguments",
	[SMTPReplyCode.CommandNotImplemented]: "Command not implemented",
	[SMTPReplyCode.BadSequence]: "Bad sequence of commands",
	[SMTPReplyCode.ParameterNotImplemented]: "Command parameter not implemented",
	
	[SMTPReplyCode.MailboxUnavailable]: "Request action not taken: mailbox unavailable",
	[SMTPReplyCode.UserNotLocal]: "User not local; please try {{forwardPath}}",
	[SMTPReplyCode.ExceededStorageAllocation]: "Request action aborted: exceeded storage allocation",
	[SMTPReplyCode.MailboxNameNotAllowed]: "Request action not taken: mailbox nae not allowed",
	[SMTPReplyCode.TransactionFailed]: "Transaction failed",
	[SMTPReplyCode.EnvelopeHasBadInfo]: "MAIL FROM/RCPT TO parameters not recognized or not implemented",
}