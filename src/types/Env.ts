import { Env as Environment } from 'hono';
import { API } from '@discordjs/core/http-only';

export default interface E extends Environment {
	Bindings: Env;
	Variables: {
		api: API;
	};
}
