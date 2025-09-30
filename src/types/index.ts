import { MyContext } from "@/types/my_context";
import { APIInteractionResponse } from "@discordjs/core/http-only";

export * from "./environment";
export * from "./my_context";

let _context: MyContext;

export type APIInteractionJsonResponse = ReturnType<
    typeof _context.json<APIInteractionResponse>
>;
