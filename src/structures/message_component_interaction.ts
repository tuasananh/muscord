import Interaction from "@/structures/interaction";
import MessageComponentButtonInteraction from "@/structures/message_component_button_interaction";
import { MyContext } from "@/types";
import {
    APIMessageComponentInteraction,
    ComponentType,
} from "@discordjs/core/http-only";

export default class MessageComponentInteraction extends Interaction {
    data: APIMessageComponentInteraction;

    constructor(ctx: MyContext, data: APIMessageComponentInteraction) {
        super(ctx, data);
        this.data = data;
    }

    isButton(): this is MessageComponentButtonInteraction {
        return this.data.data.component_type === ComponentType.Button;
    }
}
