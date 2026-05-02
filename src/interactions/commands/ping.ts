import { factory } from '../../utils';

export const ping = factory.slashCommand({
  name: 'ping',
  description: 'Replies with Pong!',
  arguments: {},

  runner: (interaction) => {
    // eslint-disable @typescript-eslint/require-await
    return Promise.resolve(interaction.jsonReply('Pong!'));
  },
});
