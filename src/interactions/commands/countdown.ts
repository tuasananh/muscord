import { ApplicationCommandOptionType } from "disteractions";
import { factory } from "../../utils";

export const countdown = factory.slashCommand({
    name: "countdown",
    description: "Starts a countdown",
    arguments: {
        seconds: {
            type: ApplicationCommandOptionType.Integer,
            description: "Number of seconds",
            required: true,
        },
    },

    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            const { seconds } = inputMap;

            for (let i = seconds; i >= 1; i--) {
                await interaction.editReply(`${i} seconds remaining...`);
                await new Promise((f) => setTimeout(f, 1000));
            }

            await interaction.editReply(`Countdown finished!`);
        },
    },
});
