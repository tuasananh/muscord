import messageComponentButtonHandler from "@/handlers/message_component/button";
import MessageComponentInteraction from "@/structures/message_component_interaction";

export default async function messageComponentHandler(
    interaction: MessageComponentInteraction
) {
    console.log("Message component interaction received");
    if (interaction.isButton()) {
        return await messageComponentButtonHandler(interaction);
    }
}
