import { Command, commands } from "@/interactions/commands";
import ChatInputApplicationCommandInteraction from "@/structures/chat_input_command_interaction";
import { snakeToCamel } from "@/utils";
import { ApplicationCommandOptionType } from "@discordjs/core/http-only";

export default async function chatInputApplicationCommandHandler(
    interaction: ChatInputApplicationCommandInteraction
) {
    const name = snakeToCamel(interaction.commandName);

    if (!Object.prototype.hasOwnProperty.call(commands, name)) {
        return interaction.badRequest();
    }

    const command = commands[
        name as keyof typeof commands
    ] as unknown as Command;

    const invoked_user = interaction.user;

    if (
        !invoked_user ||
        (command.ownerOnly &&
            invoked_user.id != interaction.env.DISCORD_APPLICATION_OWNER_ID)
    ) {
        return interaction.jsonReply("Permissions denied.");
    }

    const inputMap: Record<string, unknown> = {};

    for (const opt of interaction.options) {
        switch (opt.type) {
            case ApplicationCommandOptionType.Subcommand:
            case ApplicationCommandOptionType.SubcommandGroup:
                // we will never do this
                break;
            case ApplicationCommandOptionType.Boolean:
                inputMap[opt.name] = Boolean(opt.value);
                break;
            case ApplicationCommandOptionType.Integer:
                inputMap[opt.name] = Number(opt.value);
                break;
            case ApplicationCommandOptionType.Number:
                inputMap[opt.name] = Number(opt.value);
                break;
            case ApplicationCommandOptionType.String:
                inputMap[opt.name] = String(opt.value);
                break;
            case ApplicationCommandOptionType.User:
                console.log("User", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Channel:
                console.log("Channel", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Role:
                console.log("Role", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Mentionable:
                console.log("Mentionable", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Attachment:
                console.log("Attachment", opt.value);
                inputMap[opt.name] = opt.value;
                break;
        }
    }

    if (!command.shouldDefer) {
        return await command.run(interaction, inputMap);
    }

    interaction.ctx.executionCtx.waitUntil(
        (async () => {
            while (!interaction.ctx.res.ok) {
                await new Promise<void>((f) => f());
            } // wait for the defer to be finshed

            await command.run(interaction, inputMap);
        })()
    );

    return interaction.jsonDefer();
}
