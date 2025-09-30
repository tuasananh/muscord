import { InteractionResponseType } from "@discordjs/core/http-only";
import { Command } from ".";

const pingCommand: Command = {
    data: (command) =>
        command.setName("ping").setDescription("Replies with Pong!"),
    run: async () => {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Pong!",
            },
        };
    },
};

export default pingCommand;
