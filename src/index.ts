import { Hono } from "hono";
import verifyDiscordRequest from "./middlewares/discord_request";

import {
	APIInteraction,
	InteractionResponseType,
	InteractionType,
} from "@discordjs/core/http-only";
import apiFromToken from "./api";

import applicationCommandHandler from "./handlers/application_command";
import messageComponentHandler from "./handlers/message_component";
import modalSubmitHandler from "./handlers/modal_submit";
import E from "./types/Env";

const app = new Hono<E>();

app.use(async (c, next) => {
	c.set("api", apiFromToken(c.env.DISCORD_TOKEN));
	await next();
});

app.post("/", verifyDiscordRequest, async (c) => {
	const interaction: APIInteraction = await c.req.json();

	if (interaction.type == InteractionType.Ping) {
		return c.json({
			type: InteractionResponseType.Pong,
		});
	}

	switch (interaction.type) {
		case InteractionType.ApplicationCommand:
			return await applicationCommandHandler(c, interaction);
		case InteractionType.ModalSubmit:
			return await modalSubmitHandler(c, interaction);
		case InteractionType.MessageComponent:
			return await messageComponentHandler(c, interaction);
		default:
			return c.json({ error: "Unknown Interaction Type" }, 400);
	}
});

export default app;
