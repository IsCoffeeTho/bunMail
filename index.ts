import type { TLSOptions } from "bun";
import type { mailEnvelope } from "./src/internal/mailEnvelope";
import type mailAddress from "./src/internal/address";
import mailService from "./src/service";

export default bunMail;
export { mailService }

export const MailAddressRegExp = /([A-Za-z0-9.!#$%&'*+\-/=?^_`{|}~]+|"[^ "]+")@([A-Za-z0-9\-\.]+|\[(\d+\.\d+\.\d+\.\d+|IPv6(:[a-fA-F0-9]{0,4}){2,8})\])/g;
export const SMTPLineRegExp = /[^\r]*\r\n([ \t][^\r]*\r\n)*/g;

declare namespace bunMail {
	export type mailServiceOptions = {
		tls: TLSOptions
	};

	export type SMTPAuthContext = {
		type: "OAUTHBEARER",
		accessToken: string
	} | {
		type: "OAUTH10A"
	} | {
		type: "CRAM-MD5"
	} | {
		type: "MD5"
	} | {
		type: "DIGEST-MD5"
	} | {
		type: "LOGIN",
		username: string,
		password: string
	} | {
		type: "PLAIN",
		content: string
	};

	export type SMTPAuthMethod = SMTPAuthContext["type"];
}