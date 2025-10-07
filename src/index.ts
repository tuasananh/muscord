import { Hono } from "hono";

import {
    Button,
    ChatInputApplicationCommand,
    interactionHandler,
    Modal,
} from "disteractions";
import { Rule34Client } from "./apis";
import { buttons } from "./interactions/buttons";
import { commands } from "./interactions/commands";
import { modals } from "./interactions/modals";
import { MuscordEnv } from "./types";

const app = new Hono<MuscordEnv>();

app.use(async (c, next) => {
    const apis = {
        rule34: new Rule34Client(c.env.RULE34_API_KEY, c.env.RULE34_USER_ID),
    };
    c.set("apis", apis);
    await next();
});

app.post("/", async (c) => {
    return await interactionHandler({
        hono: c,
        discordToken: c.env.DISCORD_TOKEN,
        discordPublicKey: c.env.DISCORD_PUBLIC_KEY,
        ownerId: c.env.DISCORD_APPLICATION_OWNER_ID,
        commands:
            commands as unknown[] as ChatInputApplicationCommand<MuscordEnv>[],
        buttons: buttons as unknown[] as Button<MuscordEnv>[],
        modals: modals as unknown[] as Modal<MuscordEnv>[],
    });
});

export default app;
