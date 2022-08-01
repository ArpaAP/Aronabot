import { Client, SlashCommandBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/Command';
import Embed from '../../utils/Embed';

const getHelpEmbed = (client: Client) => {
  return new Embed(client, 'default')
    .setTitle('📃 아로나의 명령어에요, 선생님!')
    .addFields({
      name: '**학생 명령어**',
      value: `>>> \`?학생 (이름)\`: 학생의 정보를 보여줘요!`,
      inline: true
    })
    .addFields({
      name: '**재미 명령어**',
      value: `>>> \`?몰루\`: 몰?루 움짤을 보내요!`,
      inline: true
    })
    .addFields({
      name: '**일반 명령어**',
      value: `>>> \`?핑\`: 봇의 지연시간과 상태를 보여줘요!\n`
    });
};

export default new BaseCommand(
  {
    name: 'help',
    description: '도움말을 보여줘요!',
    aliases: [
      '도움말',
      '도움',
      '도움말보기',
      '도움말보기',
      'ehdna',
      'ㅗ디ㅔ',
      '명령어'
    ]
  },
  async (client, message, args) => {
    message.reply({
      embeds: [getHelpEmbed(client)]
    });
  },
  {
    data: new SlashCommandBuilder()
      .setName('도움말')
      .setDescription('도움말을 보여줍니다.')
      .toJSON(),
    async execute(client, interaction) {
      interaction.reply({
        embeds: [getHelpEmbed(client)],
        ephemeral: true
      });
    }
  }
);
