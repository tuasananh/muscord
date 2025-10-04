import { Rule34Client } from "@/apis";
import { Env as HonoEnv } from "hono";

export interface MuscordEnv extends HonoEnv {
    Bindings: Env;
    Variables: {
        apis: {
            rule34: Rule34Client;
        };
    };
}
