import { Command } from "@/interactions/commands";

const countdownCommand: Command<{
    seconds: bigint;
}> = {
    data: (data) =>
        data
            .setName("countdown")
            .setDescription("Starts a countdown")
            .addIntegerOption((option) =>
                option
                    .setName("seconds")
                    .setDescription("Number of seconds")
                    .setMinValue(1)
                    .setMaxValue(120)
            ),
    shouldDefer: true,
    run: async (interaction, inputMap) => {
        const { seconds } = inputMap;

        for (let i = seconds; i >= 1; i--) {
            await interaction.editReply(`${i} seconds remaining...`);
            await new Promise((f) => setTimeout(f, 1000));
        }

        await interaction.editReply(`Countdown finished!`);
    },
};

export default countdownCommand;
