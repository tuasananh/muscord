import Interaction from "@/structures/interaction";
import { MyContext } from "@/types";
import { APIModalSubmitInteraction } from "@discordjs/core/http-only";

export default class ModalSubmitInteraction extends Interaction {
    data: APIModalSubmitInteraction;

    constructor(ctx: MyContext, data: APIModalSubmitInteraction) {
        super(ctx, data);
        this.data = data;
    }
}
