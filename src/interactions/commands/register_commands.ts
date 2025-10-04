import { factory } from "@/utils";
import { REST } from "@discordjs/rest";
import { ApplicationCommandOptionType, Routes } from "disteractions";
import { commands } from ".";

export const registerCommands = factory.slashCommand({
    name: "register_commands",
    description: "Register commands",
    ownerOnly: true,
    arguments: {
        guild_id: {
            type: ApplicationCommandOptionType.String,
            description: "The guild ID to register commands in",
        },
    },
    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            const { guild_id: guildId = "" } = inputMap;
            const applicationId = interaction.ctx.env.DISCORD_APPLICATION_ID;

            const rest = new REST({ version: "10" }).setToken(
                interaction.ctx.env.DISCORD_TOKEN
            );

            try {
                // The put method is used to fully refresh all commands in the guild with the current set
                const route =
                    guildId.length != 0
                        ? Routes.applicationGuildCommands(
                              applicationId,
                              guildId
                          )
                        : Routes.applicationCommands(applicationId);
                await rest.put(route, {
                    body: commands.map((command) => command.toAPI()),
                });

                await interaction.followUp(
                    `Successfully reloaded application (/) commands.\n` +
                        commands
                            .map((cmd) => {
                                return `- \`${cmd.name}\`: ${cmd.description}`;
                            })
                            .join("\n")
                );
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                await interaction.followUp(
                    `There was an error while reloading application (/) commands: \`\`\`
                        ${error}
                        \`\`\``
                );
            }
        },
    },
});
