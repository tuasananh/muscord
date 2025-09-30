import { MyContext } from "@/types";
import { APIUser } from "@discordjs/core/http-only";

export default class User {
    ctx: MyContext;
    data: APIUser;

    constructor(ctx: MyContext, data: APIUser) {
        this.ctx = ctx;
        this.data = data;
    }

    get id() {
        return this.data.id;
    }
}
