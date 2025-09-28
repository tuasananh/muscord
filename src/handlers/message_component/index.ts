import { buttonMap } from "@/interactions/buttons";
import MyContext from "@/types/my_context";
import {
	APIMessageComponentButtonInteraction,
	APIMessageComponentInteraction,
	ComponentType,
	InteractionResponseType,
} from "@discordjs/core/http-only";

export default async function messageComponentHandler(
	c: MyContext,
	interaction: APIMessageComponentInteraction
) {
	const data = interaction.data;
	if (data.component_type == ComponentType.Button) {
		const whatWeHave = data.custom_id.split("@").at(0);
		if (!whatWeHave) {
			return c.notFound();
		}
		const button = buttonMap.get(whatWeHave);
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
}
