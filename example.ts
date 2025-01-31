import { bunSMTP } from ".";

type user = {};

const MSA = bunSMTP<user>({
	host: process.env["MXA_HOST"] ?? "127.0.0.1",
	port: parseInt(process.env["MXA_PORT"] ?? "1587"),
	tls: {
		key: Bun.file(process.env["TLS_KEY"] ?? "/dev/null"),
		cert: Bun.file(process.env["TLS_CRT"] ?? "/dev/null"),
	},
	agent: {
		onConnect(agent) {
			console.log("Connection");
		},
		onRecipient(agent, recipient) {
			recipient.reject();
		},
		onVerify(agent, inbox) {
			return;
		},
		onExpand(agent, group) {
			
		}
	}
});

console.log(`Submission server ${MSA.hostname}:${MSA.port}`);