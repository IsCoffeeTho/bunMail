import { TLSOptions, TCPSocketListener, Socket } from "bun";
import SMTPAgent from "./agent";
import { envelope, mailbox, mailboxValidator } from "./envelope";

import pkg from "../../package.json";

export type bunSMTPAuthMethods = "PLAIN" | "LOGIN" | "GSSAPI";

export type PartAsync<T> = Promise<T> | T;

export type SMTPServerAgentHandlers<T> = {
	onConnect?(agent: SMTPAgent<T>): PartAsync<any>;
	onSecure?(agent: SMTPAgent<T>): PartAsync<any>;
	onAuthenticate?(agent: SMTPAgent<T>): PartAsync<boolean>;
	onCommand?(
		agent: SMTPAgent<T>,
		command: string,
		args: string[],
	): PartAsync<any>;
	onVerify?(
		agent: SMTPAgent<T>,
		inbox: string,
	): PartAsync<mailbox[] | mailbox | void | null | undefined>;
	onExpand?(
		agent: SMTPAgent<T>,
		group: string,
	): PartAsync<mailbox[] | void | null | undefined>;
	onRecipient?(
		agent: SMTPAgent<T>,
		recipient: mailboxValidator,
	): PartAsync<any>;
	onSender?(agent: SMTPAgent<T>, sender: mailbox): PartAsync<any>;
	onMail?(agent: SMTPAgent<T>, envelope: envelope): PartAsync<any>;
	onClose?(agent: SMTPAgent<T>): PartAsync<any>;
};

export type bunSMTPOptions<T> = {
	hostname?: string;
	host?: string;
	port?: number;
	tls: TLSOptions;
	tlsImplied?: boolean;
	agent: SMTPServerAgentHandlers<T>;
};

type clearTextHandler = {
	data(data: Buffer): any;
	close(_?: Buffer | string): void;
};

const CRLF = Uint8Array.from([0x0d, 0x0a]);

export default function BunSMTP<user_type = any>(
	opt: bunSMTPOptions<user_type>,
): TCPSocketListener<any> {
	var hostname = opt.hostname ?? process.env["HOSTNAME"] ?? "localhost";

	var abstractUnixSocket = `\0${`.`.repeat(32).replace(/./g, () => {
		var bucket =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		return bucket[Math.floor(Math.random() * bucket.length)];
	})}`; // Avoid clashing with another SMTP server run at same times

	var secureServerOptions: any = {
		unix: abstractUnixSocket,
	};
	var facadeServerOptions: any = {
		hostname: opt.host,
		port: opt.port,
	};
	if (opt.tlsImplied) secureServerOptions = facadeServerOptions;

	/** @TODO catch possible abstract unix socket name clashes */

	var secureServer = Bun.listen<SMTPAgent<user_type>>({
		...secureServerOptions,
		tls: opt.tls,
		socket: {
			open(socket) {
				socket.data = new SMTPAgent<user_type>(opt.agent, socket);
				socket.data._command = (command) => {
					command[0];
				};
				socket.data.reply(
					220,
					`${hostname} ESMTP bunMail v${pkg.version}`,
				);
			},
			data(socket, data) {
				var text = data.toString();
				if (!text.endsWith("\r\n"))
					return socket.write(`500 Missing CRLF\r\n`);
				var command = text.slice(0, -2).match(/"(\\"|[^"])*"|[^ ]+/g);
				if (command == null)
					return socket.write(`500 umm... what?\r\n`);
				if (command[0] == "QUIT") return socket.end(`221 OK\r\n`);
				if (command[0] == "NOOP") return socket.write(`250 OK\r\n`);
				socket.data._command(command);
			},
		},
	});
	var facadeServer = opt.tlsImplied
		? secureServer
		: Bun.listen<clearTextHandler>({
				...facadeServerOptions,
				socket: {
					open(socket) {
						
						function transformCommand(data: Buffer) {
							var text = data.toString();
							if (!text.endsWith("\r\n"))
								return <void><unknown>socket.write(`500 Missing CRLF\r\n`);
							var command = text.slice(0, -2).split(" ");
							if (command[0] == "QUIT")
								return <void><unknown>socket.end(`221 OK\r\n`);
							if (command[0] == "NOOP")
								return <void><unknown>socket.write(`250 OK\r\n`);
							return command;
						}
						
						function awaitEHLO(data: Buffer) {
							var command = transformCommand(data);
							if (!command)
								return;
							if (command[0] == "HELO")
								return socket.write(`523 Expected EHLO.\r\n`);
							if (command[0] != "EHLO")
								return socket.write(`503 No Hello?\r\n`);
							socket.write(
								`250-Hello ${command[1]}\r\n250 STARTTLS\r\n`,
							);
							socket.data.data = awaitSTARTTLS;
						}
						async function awaitSTARTTLS(data: Buffer) {
							var command = transformCommand(data);
							if (!command)
								return;
							if (command[0] != "STARTTLS") {
								return socket.write(
									`503 Expecting STARTTLS.\r\n`,
								);
							}

							Bun.connect<Socket<clearTextHandler>>({
								unix: abstractUnixSocket,
								socket: {
									open(upgraded) {
										upgraded.data = socket;
										socket.data.data = (data) => {
											upgraded.write(data);
										};
										socket.write(
											`220 Ready to STARTTLS.\r\n`,
										);
									},
									data(upgraded, data) {
										upgraded.data.write(data);
									},
									close(upgraded) {
										upgraded.data.end();
									},
									error(upgraded, error) {
										console.error(
											"Upgraded Server:",
											error,
										);
										upgraded.data.end();
									},
								},
							});
						}

						socket.data = {
							data: awaitEHLO,
							close() {},
						};

						socket.write(
							`220 ${hostname} ESMTP bunMail v${pkg.version}\r\n`,
						);
					},
					data(socket, data) {
						socket.data.data(data);
					},
					close(socket) {
						socket.data.close();
					},
					error(socket, error) {
						console.error("ClearText Server:", error);
						socket.data.close();
					},
				},
			});

	return facadeServer;
}
