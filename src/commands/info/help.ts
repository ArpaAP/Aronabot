import { SlashCommandBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/Command';
import Embed from '../../utils/Embed';

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
    const embed = new Embed(client, 'default')
      .setTitle('📃 아로나의 명령어에요, 선생님!')
      .addFields({
        name: '**학생 명령어**',
        value: `\`?학생 (이름)\`: 학생의 정보를 보여줘요!`,
        inline: true
      })
      .addFields({
        name: '**재미 명령어**',
        value: `\`?몰루\`: 몰?루 움짤을 보내요!`,
        inline: true
      });

    message.reply({
      embeds: [embed]
    });
  },
  {
    data: new SlashCommandBuilder()
      .setName('도움말')
      .setDescription('도움말을 보여줍니다.')
      .toJSON(),
    async execute(client, interaction) {
      const embed = new Embed(client, 'default')
        .setTitle('📃 아로나의 명령어에요, 선생님!')
        .addFields({
          name: '**학생 명령어**',
          value: `\`?학생 (이름)\`: 학생의 정보를 보여줘요!`,
          inline: true
        })
        .addFields({
          name: '**재미 명령어**',
          value: `\`?몰루\`: 몰?루 움짤을 보내요!`,
          inline: true
        });

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }
  }
);
