import { SocketHandler, TLSOptions, Socket } from "bun";
import agent, { SMTPState } from "./agent";
import { EventEmitter } from "events";

export type SMTPOptions<T> = {
	hostname: string;
	port: number;
	domain: string;
	tls: TLSOptions;
	agent: Partial<{
		open(agent: agent<T>): any;
		command(agent: agent<T>, command: string[]): any;
		message(agent: agent<T>, message: Buffer): any;
		error(agent: agent<T>): any;
	}>;
};

export default function serve<T>(opt: SMTPOptions<T>) {
	
	var socketHandler: SocketHandler<agent<T>> = {
		open(socket: Socket<agent<T>>) {
			socket.data = new agent<T>(opt, socket, { tls: opt.tls, socket: socketHandler });
		},
		async data(socket: Socket<agent<T>>, data: Buffer) {
			if (socket.data.state == SMTPState.DATA)
				return;
		},
		close(socket: Socket<agent<T>>) {
			
		}
	};
	
	return Bun.listen<agent<T>>({
		hostname: opt.hostname,
		port: opt.port,
		socket: socketHandler
	});
}
