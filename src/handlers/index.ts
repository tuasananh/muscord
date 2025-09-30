import applicationCommandHandler from "@/handlers/application_command";
import messageComponentHandler from "@/handlers/message_component";
import modalSubmitHandler from "@/handlers/modal_submit";
import Interaction from "@/structures/interaction";
import { MyContext } from "@/types/my_context";
import { InteractionType } from "@discordjs/core/http-only";

export default async function interactionHandler(c: MyContext) {
    const interaction = new Interaction(c, await c.req.json());

    if (interaction.type === InteractionType.Ping) {
        return interaction.jsonPong();
    }

    if (interaction.isApplicationCommand()) {
        return await applicationCommandHandler(interaction);
    }

    if (interaction.isModalSubmit()) {
        return await modalSubmitHandler(interaction.ctx, interaction.data);
    }

    if (interaction.isMessageComponent()) {
        return await messageComponentHandler(interaction);
    }

    return c.json({ error: "Unknown Interaction Type" }, 400);
}
