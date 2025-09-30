import { Hono } from "hono";
import verifyDiscordRequest from "./middlewares/discord_request";

import apiFromToken from "./api";

import interactionHandler from "@/handlers";
import E from "./types/environment";
import * as Rule34Api from "./utils/rule34/api";

const app = new Hono<E>();

app.use(async (c, next) => {
    c.set("api", apiFromToken(c.env.DISCORD_TOKEN));
    c.set("r34", Rule34Api);
    await next();
});

app.get("/", async (c) => {
    const { results } = await c.env.prod_muscord
        .prepare("SELECT * from r34_presets WHERE name LIKE ? || '%'")
        .bind("")
        .run();
    return c.json({ presets: results });
});

app.post("/", verifyDiscordRequest, interactionHandler);

export default app;
