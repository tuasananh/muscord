import { MyContext } from "@/types";
import { APIMessage } from "@discordjs/core/http-only";

export default class Message {
    ctx: MyContext;
    data: APIMessage;

    constructor(ctx: MyContext, data: APIMessage) {
        this.ctx = ctx;
        this.data = data;
    }
}
