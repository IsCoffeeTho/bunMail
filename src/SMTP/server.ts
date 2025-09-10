import { SocketHandler, TLSOptions, Socket } from "bun";
import agent, { SMTPState } from "./agent";
import { SMTPReplyCode } from "./constants";

export type SMTPOptions<T> = {
	hostname: string;
	port: number;
	domain: string;
	tls: TLSOptions;
	agent: {
		open(agent: agent<T>): any;
		command(agent: agent<T>, command: string[]): any;
		message(agent: agent<T>, message: Buffer): any;
		error?(agent: agent<T>, error: any): any;
	};
};

export default function serve<T>(opt: SMTPOptions<T>) {
	
	var socketHandler: SocketHandler<agent<T>> = {
		open(socket: Socket<agent<T>>) {
			socket.data = new agent<T>(opt, socket, { tls: opt.tls, socket: socketHandler });
			opt.agent.open(socket.data);
			socket.data.send(SMTPReplyCode.ServiceReady, "{{domain}} Service Available.");
		},
		async data(socket: Socket<agent<T>>, data: Buffer) {
			var _agent = socket.data;
			try {
				if (_agent.state == SMTPState.DATA) {
					return;
				}
				var packet = data.toString();
				if (!packet.endsWith('\r\n'))
					return _agent.send(SMTPReplyCode.CommandUnrecognized, "Syntax Error, end packets with <CRLF>");
				
				var args = packet.slice(0, -2).split(" ");
				var command = args.shift();
				
				if (!command)
					return _agent.send(SMTPReplyCode.CommandUnrecognized, "Syntax Error, missing command");
				
				await opt.agent.command(_agent, [command.toUpperCase(), ...args]);
				
			} catch (err: any) {
				if (opt.agent.error)
					await opt.agent.error(_agent, err);
			}
			
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
