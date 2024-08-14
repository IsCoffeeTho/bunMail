import { Server } from "net";
import { mailService } from "../..";

export default class mailServer {
	server : Server;
	service : mailService;
	constructor(service: mailService) {
		this.service = service;
		this.server = new Server();
	}

	listen(host: string, port: number | string, callback?: () => any): any;
	listen(port: string | number, callback?: () => any): any;
	listen(callback?: () => any): any;
	listen(arg_a?: string | number | (() => any), arg_b?: string | number | (() => any), arg_c?: (() => any)) {
		var host = "localhost";
		var port = Math.floor(Math.random() * 38000) + 1000;
		var callback = () => { };
		if (typeof arg_a == "function") {
			callback = <() => any>arg_a;
		} else if (typeof arg_b == "function" || !arg_b) {
			if (arg_b)
				callback = <() => any>arg_b;
			if (typeof arg_a == "string")
				arg_a = parseInt(arg_a);
			port = <number>arg_a;
		} else if (typeof arg_c == "function" || !arg_c) {
			if (arg_c)
				callback = <() => any>arg_c;
			if (typeof arg_b == "string")
				arg_b = parseInt(arg_b);
			port = <number>arg_b;
			host = <string>arg_a;
		}
	}
}