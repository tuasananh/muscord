import { Command, commands } from "@/interactions/commands";
import MyContext from "@/types/my_context";
import {
    APIChatInputApplicationCommandInteraction,
    ApplicationCommandOptionType,
    InteractionResponseType,
} from "@discordjs/core/http-only";

export default async function chatInputApplicationCommandHandler(
    c: MyContext,
    interaction: APIChatInputApplicationCommandInteraction
) {
    const name = interaction.data.name.toLowerCase();

    if (!Object.prototype.hasOwnProperty.call(commands, name)) {
        return c.json({ error: "Unknown Command" }, 400);
    }

    const command = commands[name as keyof typeof commands] as unknown as Command;

    const invoked_user = interaction.member?.user ?? interaction.user;

    if (
        !invoked_user ||
        (command.ownerOnly &&
            invoked_user.id != c.env.DISCORD_APPLICATION_OWNER_ID)
    ) {
        return c.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Permissions denied!",
            },
        });
    }

    const options = interaction.data.options || [];

    const inputMap: Record<string, unknown> = {};

    for (const opt of options) {
        switch (opt.type) {
            case ApplicationCommandOptionType.Subcommand:
            case ApplicationCommandOptionType.SubcommandGroup:
                // we will never do this
                break;
            default:
                inputMap[opt.name] = opt.value;
                break;
        }
    }

    if (!command.shouldDefer) {
        return c.json(await command.run(c, interaction, inputMap));
    }

    c.executionCtx.waitUntil(
        (async () => {
            while (!c.res.ok) {
                await new Promise<void>((f) => f());
            } // wait for the defer to be finshed

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await command.run(c, interaction, inputMap as any);
        })()
    );

    return c.json({
        type: InteractionResponseType.DeferredChannelMessageWithSource,
    });
}
