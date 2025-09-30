import ApplicationCommandInteraction from "@/structures/command_interaction";
import { MyContext } from "@/types";
import { APIChatInputApplicationCommandInteraction } from "@discordjs/core/http-only";

export default class ChatInputApplicationCommandInteraction extends ApplicationCommandInteraction {
    data: APIChatInputApplicationCommandInteraction;

    constructor(
        ctx: MyContext,
        data: APIChatInputApplicationCommandInteraction
    ) {
        super(ctx, data);
        this.data = data;
    }

    get options() {
        return this.data.data.options || [];
    }
}
