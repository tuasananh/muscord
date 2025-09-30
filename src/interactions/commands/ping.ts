import { Command } from ".";

const pingCommand: Command = {
    data: (command) =>
        command.setName("ping").setDescription("Replies with Pong!"),
    run: async (interaction) => {
        return interaction.jsonReply("Pong!");
    },
};

export default pingCommand;
