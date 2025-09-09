import bunMail from ".";

type user = {};

const MSA = bunMail.SMTP<user>({
	hostname: process.env["MXA_HOST"] ?? "127.0.0.1",
	port: parseInt(process.env["MXA_PORT"] ?? "1587"),
	domain: "smtp.localhost",
	tls: {
		key: Bun.file(process.env["TLS_KEY"] ?? "/dev/null"),
		cert: Bun.file(process.env["TLS_CRT"] ?? "/dev/null"),
	},
	agent: {
		open(agent) {
			
		},
		command(agent, command) {
			
		},
	}
});

console.log(`Submission server ${MSA.hostname}:${MSA.port}`);