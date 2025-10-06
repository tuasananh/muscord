import { config } from "dotenv";
config({ path: ".dev.vars" });

import { REST } from "@discordjs/rest";
import { Routes } from "disteractions";
import { commands } from "./interactions/commands";

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */

async function registerCommands(guildId: string = "") {
    const token = process.env.DISCORD_TOKEN;
    const applicationId = process.env.DISCORD_APPLICATION_ID;

    if (token === undefined) {
        throw new Error("The DISCORD_TOKEN environment variable is required.");
    }
    if (applicationId === undefined) {
        throw new Error(
            "The DISCORD_APPLICATION_ID environment variable is required."
        );
    }

    const rest = new REST().setToken(token);

    try {
        console.log(
            `Started refreshing ${
                Object.keys(commands).length
            } application (/) commands.`
        );

        const route =
            guildId.length != 0
                ? Routes.applicationGuildCommands(applicationId, guildId)
                : Routes.applicationCommands(applicationId);
        const data = await rest.put(route, {
            body: commands.map((command) => command.toAPI()),
        });

        console.log(`Successfully reloaded application (/) commands.`);
        console.log(data);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}

registerCommands(process.env.DISCORD_GUILD_ID)
    .then(() => {
        console.log("Done");
    })
    .catch((e) => {
        console.error(e);
    });
