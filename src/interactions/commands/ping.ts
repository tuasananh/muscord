import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '.';

const ping: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	run: async (c, interaction) => {
		await c
			.get('api')
			.interactions.reply(
				interaction.application_id,
				interaction.token,
				{
					content: 'Pong!',
				}
			);
	},
};

export default ping;
