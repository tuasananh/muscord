import chatInputApplicationCommandHandler from "@/handlers/application_command/chat_input";
import ApplicationCommandInteraction from "@/structures/command_interaction";

export default async function applicationCommandHandler(
    interaction: ApplicationCommandInteraction
) {
    if (interaction.isChatInput()) {
        return await chatInputApplicationCommandHandler(interaction);
    }

    return interaction.badRequest();
}
