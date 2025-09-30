import { Button, buttons } from "@/interactions/buttons";
import MyContext from "@/types/my_context";
import {
    APIMessageComponentButtonInteraction,
    InteractionResponseType,
} from "@discordjs/core/http-only";

export default async function messageComponentButtonHandler(
    c: MyContext,
    interaction: APIMessageComponentButtonInteraction
) {

    const splitted = interaction.data.custom_id.split("@");

    const name = splitted.at(0);


    if (!name) {
        return c.json({ error: "No button_id provided" }, 400);
    }

    const inputs = interaction.data.custom_id.split("@").slice(1);

    if (!Object.prototype.hasOwnProperty.call(buttons, name)) {
        return c.json({ error: "Unknown Command" }, 400);
    }

    const button = buttons[name as keyof typeof buttons] as unknown as Button;

    if (!button.shouldDefer) {
        return c.json(await button.run(
            c,
            interaction as APIMessageComponentButtonInteraction,
            (inputs)
        ));
    }

    c.executionCtx.waitUntil(
        (async () => {
            while (!c.res.ok) {
                await new Promise<void>((f) => f());
            } // wait for the defer to be finshed

            await button.run(
                c,
                interaction as APIMessageComponentButtonInteraction,
                inputs
            );
        })()
    );
    return c.json({
        type: InteractionResponseType.DeferredChannelMessageWithSource,
    });
}
