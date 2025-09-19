import bunMail from ".";
import { SMTPState } from "./src/SMTP/agent";
import { SMTPReplyCode } from "./src/SMTP/constants";

type user = {};

const MSA = bunMail.SMTP<user>({
	hostname: process.env["MXA_HOST"] ?? "127.0.0.1",
	port: parseInt(process.env["MXA_PORT"] ?? "1465"),
	name: process.env["DOMAIN"] ?? process.env["HOSTNAME"] ?? "smtp.localhost",
	tls: {
		implicit: true,
		key: Bun.file(process.env["TLS_KEY"] ?? "/dev/null"),
		cert: Bun.file(process.env["TLS_CRT"] ?? "/dev/null"),
	},
	agent: {
		open(agent) {
			console.log("AGENT CONNECTED");
		},
		command(agent, command) {
			console.log(command);
			switch (command.at(0)) {
				case "HELO":
				case "EHLO":
					agent.state = SMTPState.INITIATED;
					agent.send(SMTPReplyCode.OK);
					break;
				default:
					agent.send(SMTPReplyCode.CommandUnrecognized);
					break;
			}
		},
		message(agent, envelope) {
			
		}
	}
});

console.log(`Submission server ${MSA.hostname}:${MSA.port}`);