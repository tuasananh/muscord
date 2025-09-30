import messageComponentButtonHandler from "@/handlers/message_component/button";
import MyContext from "@/types/my_context";
import {
    APIMessageComponentButtonInteraction,
    APIMessageComponentInteraction,
    ComponentType
} from "@discordjs/core/http-only";

export default async function messageComponentHandler(
    c: MyContext,
    interaction: APIMessageComponentInteraction
) {
    console.log("Message component interaction received");
    const data = interaction.data;
    if (data.component_type == ComponentType.Button) {
        return messageComponentButtonHandler(c, interaction as APIMessageComponentButtonInteraction)
    }
}
