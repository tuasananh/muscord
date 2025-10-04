import { Env as HonoEnv } from "hono";
import { Rule34Client } from "../apis";

export interface MuscordEnv extends HonoEnv {
    Bindings: Env;
    Variables: {
        apis: {
            rule34: Rule34Client;
        };
    };
}
