import bunMail, { mailService } from ".";

const service = new mailService({
	tls: {
		key: Bun.file(process.env["TLS_KEY"] ?? ""),
		cert: Bun.file(process.env["TLS_CRT"] ?? "")
	}
});

service.TransferSMTP.listen(
	process.env["HOST"] ?? "localhost",
	process.env["MTA_PORT"] ?? 25,
);

// service.SubmissionSMTP.listen(
// 	process.env["HOST"] ?? "localhost",
// 	process.env["MSA_PORT"] ?? 587,
// );

// service.pop3.listen(
// 	process.env["HOST"] ?? "localhost",
// 	process.env["POP3_PORT"] ?? 995,
// );

// service.imap.listen(
// 	process.env["HOST"] ?? "localhost",
// 	process.env["IMAP_PORT"] ?? 993,
// );