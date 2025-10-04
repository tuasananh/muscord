import { factory } from "../../utils";

export const ping = factory.slashCommand({
    name: "ping",
    description: "Replies with Pong!",
    arguments: {},
    runner: async (interaction) => {
        return interaction.jsonReply("Pong!");
    },
});
