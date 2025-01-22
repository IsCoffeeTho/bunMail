import { TLSOptions } from "bun";
import { EventEmitter } from "events";

export type bunSMTPOptions = {
	hostname?: string;
	tls: TLSOptions;
	tlsImplied?: boolean;
};

export default class bunSMTP extends EventEmitter {
	#tls: TLSOptions;
	constructor(opt: bunSMTPOptions) {
		super();
		this.#tls = opt.tls;
		
	}
	
	listen(callback?: () => any): void;
	listen(port:number, callback?: () => any): void;
	listen(address: string, port: number, callback?: () => any): void;
	listen(...args: any) {
		var address = "127.0.0.1";
		var port = 1587;
		var callback = () => {};
		if (typeof args[args.length - 1] == "function")
			callback = args.pop();
		if (typeof args[args.length - 1] == "number")
			port = args.pop();
		if (typeof args[args.length - 1] == "string")
			address = args.pop();
		Bun.listen({
			hostname: address,
			port,
			socket: {
				
			}
		});
		callback();
	}
}