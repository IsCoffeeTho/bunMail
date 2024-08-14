# bunSMTP

Runs a very minimal SMTP server on bun.

```ts
// example.ts
import bunMail, { mailService } from ".";

const service = new mailService({
	tls: {
		...
	}
});

```

```ts
// example.ts (cont)
service.TransferSMTP.listen(
	process.env["HOST"] ?? "::1",
	process.env["MTA_PORT"] ?? 25,
);

service.SubmissionSMTP.listen(
	process.env["HOST"] ?? "::1",
	process.env["MSA_PORT"] ?? 587,
);

service.pop3.listen(
	process.env["HOST"] ?? "::1",
	process.env["POP3_PORT"] ?? 110,
);

service.imap.listen(
	process.env["HOST"] ?? "::1",
	process.env["IMAP_PORT"] ?? 143,
);
```

## Usage

see [Email Agent (Infrastructure) &mdash; Wikipedia](https://en.wikipedia.org/wiki/Email_agent_(infrastructure))

```bash
bun install bunSMTP
``` 