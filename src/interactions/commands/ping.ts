import { factory } from "../../utils";

export const ping = factory.slashCommand({
    name: "ping",
    description: "Replies with Pong!",
    arguments: {},
    // eslint-disable-next-line @typescript-eslint/require-await
    runner: async (interaction) => {
        return interaction.jsonReply("Pong!");
    },
});
