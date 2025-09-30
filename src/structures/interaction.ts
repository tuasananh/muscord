import ApplicationCommandInteraction from "@/structures/command_interaction";
import Message from "@/structures/message";
import MessageComponentInteraction from "@/structures/message_component_interaction";
import ModalSubmitInteraction from "@/structures/modal_submit_interaction";
import User from "@/structures/user";
import { MyContext } from "@/types";
import {
    APIInteraction,
    APIInteractionResponseCallbackData,
    APIInteractionResponseChannelMessageWithSource,
    APIInteractionResponseDeferredChannelMessageWithSource,
    InteractionResponseType,
    InteractionType,
} from "@discordjs/core/http-only";

export default class Interaction {
    ctx: MyContext;
    data: APIInteraction;

    constructor(ctx: MyContext, data: APIInteraction) {
        this.ctx = ctx;
        this.data = data;
    }

    get type() {
        return this.data.type;
    }

    get apis() {
        return this.ctx.get("apis");
    }

    get env() {
        return this.ctx.env;
    }

    get sql() {
        return this.ctx.env.prod_muscord;
    }

    get json() {
        return this.ctx.json;
    }

    get user() {
        const api_user = this.data.member?.user ?? this.data.user;
        return api_user ? new User(this.ctx, api_user) : null;
    }

    isApplicationCommand(): this is ApplicationCommandInteraction {
        return this.data.type === InteractionType.ApplicationCommand;
    }

    isModalSubmit(): this is ModalSubmitInteraction {
        return this.data.type === InteractionType.ModalSubmit;
    }

    isMessageComponent(): this is MessageComponentInteraction {
        return this.data.type === InteractionType.MessageComponent;
    }

    badRequest() {
        return this.ctx.json({ error: "Bad Request" }, 400);
    }

    jsonPong() {
        return this.ctx.json({ type: InteractionResponseType.Pong });
    }

    jsonDefer(options: Pick<APIInteractionResponseCallbackData, "flags"> = {}) {
        return this.ctx.json<APIInteractionResponseDeferredChannelMessageWithSource>(
            {
                type: InteractionResponseType.DeferredChannelMessageWithSource,
                data: options,
            }
        );
    }

    jsonReply(options: APIInteractionResponseCallbackData | string) {
        if (typeof options === "string") {
            options = { content: options };
        }
        return this.ctx.json<APIInteractionResponseChannelMessageWithSource>({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: options,
        });
    }

    async followUp(options: APIInteractionResponseCallbackData | string) {
        return new Message(
            this.ctx,
            await this.apis.discord.interactions.followUp(
                this.data.application_id,
                this.data.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }

    async editReply(options: APIInteractionResponseCallbackData | string) {
        return new Message(
            this.ctx,
            await this.apis.discord.interactions.editReply(
                this.data.application_id,
                this.data.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }
}
