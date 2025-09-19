import { TLSOptions } from "bun";
import agent, { SMTPState } from "./agent";
import { SMTPReplyCode } from "./constants";

export type SMTPListenerOptions<T> = {
	hostname: string;
	port: number;
	name: string;
	tls?: TLSOptions & {
		implicit: boolean;
	};
	agent: {
		open?(agent: agent<T>): any;
		command(agent: agent<T>, command: string[]): any;
		message(agent: agent<T>, message: Buffer): any;
		close?(agent: agent<T>, error?: Error): any;
		error?(agent: agent<T>, error: Error): any;
	};
};

export interface SMTPListener<T> {
	readonly port: number;
	readonly hostname: string;
	stop(closeActiveConnections?: boolean): void;
	ref(): void;
	unref(): void;
}

export default function serve<T = unknown>(
	opt: SMTPListenerOptions<T>,
): SMTPListener<T> {
	async function handleData(agent: agent<T>, buffer: Buffer) {
		if (agent.state == SMTPState.DATA) {
			await opt.agent.message(agent, buffer);
			return;
		}
		var command = buffer.toString().split(" ");
		command[0] = command[0].toUpperCase();
		await opt.agent.command(agent, command);
	}

	var listener = Bun.listen<agent<T>>({
		hostname: opt.hostname,
		port: opt.port,
		socket: {
			async open(socket) {
				var _agent = new agent<T>(opt, socket, {
					tls: <TLSOptions>opt.tls,
					socket: {
						async open(socket) {
							socket.data = _agent;
							_agent.state = SMTPState.UNINITIATED;
							if (opt.agent.open) await opt.agent.open(_agent);
						},
						async data(socket, data) {
							await handleData(socket.data, data);
						},
						async close(socket, err) {
							if (opt.agent.close)
								await opt.agent.close(socket.data, err);
						},
						async error(socket, err) {
							if (opt.agent.error)
								await opt.agent.error(socket.data, err);
						},
					},
				});
				socket.data = _agent;
				if (opt.tls?.implicit)
					return
					
				if (opt.agent.open) await opt.agent.open(socket.data);
			},
			async data(socket, data) {
				console.log(socket.data ? "Agent Present" : "No Agent");
				console.log(data);
				var agent = socket.data;
				if (!agent) return;
				if (agent.secured) return;
				if (agent.state == SMTPState.ENCRYPTING) return;
				await handleData(agent, data);
			},
			async close(socket, err) {
				if (opt.agent.close) await opt.agent.close(socket.data, err);
			},
			async error(socket, err) {
				if (opt.agent.error) await opt.agent.error(socket.data, err);
			},
		},
	});

	return {
		hostname: opt.hostname,
		port: opt.port,
		stop(closeActiveConnections = false) {
			return listener.stop(closeActiveConnections);
		},
		ref() {
			listener.ref();
		},
		unref() {
			listener.unref();
		},
	};
}
