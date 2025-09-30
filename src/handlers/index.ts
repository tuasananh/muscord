import applicationCommandHandler from "@/handlers/application_command";
import messageComponentHandler from "@/handlers/message_component";
import modalSubmitHandler from "@/handlers/modal_submit";
import MyContext from "@/types/my_context";
import {
    APIInteraction,
    InteractionResponseType,
    InteractionType,
} from "@discordjs/core/http-only";

export default async function interactionHandler(c: MyContext) {
    const interaction: APIInteraction = await c.req.json();

    switch (interaction.type) {
        case InteractionType.Ping:
            return c.json({
                type: InteractionResponseType.Pong,
            });
        case InteractionType.ApplicationCommand:
            return await applicationCommandHandler(c, interaction);
        case InteractionType.ModalSubmit:
            return await modalSubmitHandler(c, interaction);
        case InteractionType.MessageComponent:
            return await messageComponentHandler(c, interaction);
        default:
            return c.json({ error: "Unknown Interaction Type" }, 400);
    }
}
