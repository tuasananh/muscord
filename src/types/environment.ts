import { Rule34Client } from "@/apis";
import { API } from "@discordjs/core/http-only";
import { Env as Environment } from "hono";

export interface E extends Environment {
    Bindings: Env;
    Variables: {
        apis: {
            discord: API;
            rule34: Rule34Client;
        };
    };
}
