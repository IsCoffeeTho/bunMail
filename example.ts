import { bunSMTP } from ".";

const MXA = new bunSMTP({
	tls: {
		key: Bun.file(process.env["TLS_KEY"] ?? "/dev/null"),
		cert: Bun.file(process.env["TLS_CRT"] ?? "/dev/null"),
	}
});