import { buttonMap } from "@/interactions/buttons";
import MyContext from "@/types/MyContext";
import {
	APIMessageComponentButtonInteraction,
	InteractionResponseType,
} from "@discordjs/core/http-only";

export default async function messageComponentButtonHandler(
	c: MyContext,
	interaction: APIMessageComponentButtonInteraction
) {
	const buttonId = interaction.data.custom_id.split("@").at(0);
	// const inputs = interaction.data.custom_id.split("@").slice(1);

	if (!buttonId) {
		return c.json({ error: "No button_id provided" }, 400);
	}

	const button = buttonMap.get(buttonId);

	if (!button) {
		return c.notFound();
	}

	if (!button.defer_first) {
		return await button.run(
			c,
			interaction as APIMessageComponentButtonInteraction
		);
	}

	c.executionCtx.waitUntil(
		(async () => {
			while (!c.res.ok) {
				await new Promise<void>((f) => f());
			} // wait for the defer to be finshed

			await button.run(
				c,
				interaction as APIMessageComponentButtonInteraction
			);
		})()
	);
	return c.json({
		type: InteractionResponseType.DeferredChannelMessageWithSource,
	});
}
