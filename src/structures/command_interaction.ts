import ChatInputApplicationCommandInteraction from "@/structures/chat_input_command_interaction";
import Interaction from "@/structures/interaction";
import { MyContext } from "@/types";
import {
    APIApplicationCommandInteraction,
    ApplicationCommandType,
} from "@discordjs/core/http-only";

export default class ApplicationCommandInteraction extends Interaction {
    data: APIApplicationCommandInteraction;

    constructor(ctx: MyContext, data: APIApplicationCommandInteraction) {
        super(ctx, data);
        this.data = data;
    }

    get commandType() {
        return this.data.data.type;
    }

    get commandName() {
        return this.data.data.name;
    }

    isChatInput(): this is ChatInputApplicationCommandInteraction {
        return this.commandType === ApplicationCommandType.ChatInput;
    }
}
