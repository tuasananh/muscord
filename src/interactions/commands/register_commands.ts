import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "@discordjs/core/http-only";
import { Command, commands } from ".";

const registerCommandsCommand: Command<{
    guild_id?: string;
}> = {
    data: (c) =>
        c
            .setName("register_commands")
            .setDescription("Register commands")
            .addStringOption((o) =>
                o
                    .setName("guild_id")
                    .setDescription("Guild ID to register commands to")
            ),
    ownerOnly: true,
    shouldDefer: true,
    run: async (interaction, inputMap) => {
        const { guild_id: guildId = "" } = inputMap;
        const applicationId = interaction.env.DISCORD_APPLICATION_ID;

        const rest = interaction.apis.discord.rest;

        try {
            // The put method is used to fully refresh all commands in the guild with the current set
            const route =
                guildId.length != 0
                    ? Routes.applicationGuildCommands(applicationId, guildId)
                    : Routes.applicationCommands(applicationId);
            await rest.put(route, {
                body: Object.keys(commands).map((key) =>
                    commands[key as keyof typeof commands]
                        .data(new SlashCommandBuilder())
                        .toJSON()
                ),
            });

            await interaction.followUp(
                `Successfully reloaded application (/) commands.\n` +
                    Object.keys(commands)
                        .map((key) => {
                            const cmd = commands[key as keyof typeof commands];
                            return `- \`${
                                cmd.data(new SlashCommandBuilder()).name
                            }\`: ${
                                cmd.data(new SlashCommandBuilder()).description
                            }`;
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
};

export default registerCommandsCommand;
