import { Button, buttons } from "@/interactions/buttons";
import MessageComponentButtonInteraction from "@/structures/message_component_button_interaction";

export default async function messageComponentButtonHandler(
    interaction: MessageComponentButtonInteraction
) {
    const splitted = interaction.custom_id.split("@");

    const name = splitted.at(0);

    if (!name) {
        return interaction.badRequest();
    }

    const inputs = splitted.slice(1);

    if (!Object.prototype.hasOwnProperty.call(buttons, name)) {
        return interaction.badRequest();
    }

    const button = buttons[name as keyof typeof buttons] as unknown as Button;

    if (!button.shouldDefer) {
        return await button.run(interaction, inputs);
    }

    interaction.ctx.executionCtx.waitUntil(
        (async () => {
            while (!interaction.ctx.res.ok) {
                await new Promise<void>((f) => f());
            } // wait for the defer to be finshed

            await button.run(interaction, inputs);
        })()
    );

    return interaction.jsonDefer();
}
