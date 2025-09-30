import { API } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";

export function makeDiscordApi(token: string) {
    const rest = new REST({ version: "10" }).setToken(token);
    return new API(rest);
}
