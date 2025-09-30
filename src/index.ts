import { Hono } from "hono";
import verifyDiscordRequest from "./middlewares/discord_request";

import { makeDiscordApi, Rule34Client } from "@/apis";

import interactionHandler from "@/handlers";
import { E } from "./types";

const app = new Hono<E>();

app.use(async (c, next) => {
    const apis = {
        discord: makeDiscordApi(c.env.DISCORD_TOKEN),
        rule34: new Rule34Client(c.env.RULE34_API_KEY, c.env.RULE34_USER_ID),
    };
    c.set("apis", apis);
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
