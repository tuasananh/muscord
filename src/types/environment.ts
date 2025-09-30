import * as Rule34Api from "@/utils/rule34/api";
import { API } from "@discordjs/core/http-only";
import { Env as Environment } from "hono";

export default interface E extends Environment {
	Bindings: Env;
	Variables: {
		api: API;
		r34: typeof Rule34Api;
	};
}
