import { Hono, Context } from 'hono';
import verifyDiscordRequest from './middlewares/verifyDiscordRequest';

import apiFromToken from './api';
import {
	APIChatInputApplicationCommandInteraction,
	APIInteraction,
	ApplicationCommandType,
	InteractionResponseType,
	InteractionType,
} from '@discordjs/core/http-only';
import E from './types/Env';
import chatInputApplicationCommandHandler from './handlers/chatInputApplicationCommandHandler';
import modalSubmitHandler from './handlers/modalSubmitHandler';
import messageComponentHandler from './handlers/messageComponentHandler';

const app = new Hono<E>();

app.use(async (c, next) => {
	c.set('api', apiFromToken(c.env.DISCORD_TOKEN));
	await next();
});

app.post('/', verifyDiscordRequest, async (c) => {
	const interaction: APIInteraction = await c.req.json();
	console.log('Interaction type', interaction.type);

	if (interaction.type == InteractionType.Ping) {
		return c.json({
			type: InteractionResponseType.Pong,
		});
	}

	if (
		interaction.type === InteractionType.ApplicationCommand
	) {
		if (
			interaction.data.type ==
			ApplicationCommandType.ChatInput
		) {
			return await chatInputApplicationCommandHandler(
				c,
				interaction as APIChatInputApplicationCommandInteraction
			);
		}
	} else if (
		interaction.type == InteractionType.ModalSubmit
	) {
		return await modalSubmitHandler(c, interaction);
	} else if (
		interaction.type == InteractionType.MessageComponent
	) {
    return await messageComponentHandler(c, interaction);
	}
	return c.json({ error: 'Unknown Type' }, 400);
});

export default app;
