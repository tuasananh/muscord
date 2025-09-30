import MessageComponentInteraction from "@/structures/message_component_interaction";
import { MyContext } from "@/types";
import { APIMessageComponentButtonInteraction } from "@discordjs/core/http-only";

export default class MessageComponentButtonInteraction extends MessageComponentInteraction {
    data: APIMessageComponentButtonInteraction;

    constructor(ctx: MyContext, data: APIMessageComponentButtonInteraction) {
        super(ctx, data);
        this.data = data;
    }

    get custom_id() {
        return this.data.data.custom_id;
    }
}
