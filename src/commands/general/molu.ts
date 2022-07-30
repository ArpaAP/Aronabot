import { BaseCommand } from '../../structures/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

export default new BaseCommand(
  {
    name: 'molu',
    description: '핑을 측정합니다.',
    aliases: ['몰루', '몰?루', '루몰', '몰!루']
  },
  async (client, message, args) => {
    message.reply({
      embeds: [
        new EmbedBuilder({
          image: {
            url: 'https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/molu-128.gif'
          }
        })
      ]
    });
  },
  {
    data: new SlashCommandBuilder()
      .setName('몰루')
      .setDescription('몰?루겠어요..')
      .toJSON(),
    options: {
      name: 'molu',
      isSlash: true
    },
    async execute(client, interaction) {
      interaction.reply({
        embeds: [
          new EmbedBuilder({
            image: {
              url: 'https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/molu-128.gif'
            }
          })
        ]
      });
    }
  }
);
