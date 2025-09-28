import chatInputApplicationCommandHandler from "@/handlers/application_command/chat_input";
import MyContext from "@/types/my_context";
import {
	APIApplicationCommandInteraction,
	APIChatInputApplicationCommandInteraction,
	ApplicationCommandType,
} from "@discordjs/core/http-only";

export default async function applicationCommandHandler(
	c: MyContext,
	interaction: APIApplicationCommandInteraction
) {
	switch (interaction.data.type) {
		case ApplicationCommandType.ChatInput:
			return await chatInputApplicationCommandHandler(
				c,
				interaction as APIChatInputApplicationCommandInteraction
			);
		default:
			return c.json({ error: "Unknown Application Command Type" }, 400);
	}
}
