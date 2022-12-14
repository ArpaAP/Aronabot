import { BaseCommand } from '../../structures/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../../../config';

export default new BaseCommand(
  {
    name: 'support',
    description: '서포트 서버 초대 링크를 표시합니다.',
    aliases: [
      '서포트',
      '서폿섭',
      '문의',
      '건의',
      '문의서버',
      '서포트서버',
      '서폿서버'
    ]
  },
  async (client, message, args) => {
    message.reply(
      `서포트 서버에서 공지와 개발소식을 확인하고, 문의 및 건의를 진행할 수 있습니다! ${config.supportURL}`
    );
  },
  {
    data: new SlashCommandBuilder()
      .setName('서포트서버')
      .setDescription(
        '공지 및 개발소식 확인, 문의와 건의 등을 위한 서포트 서버 초대 링크를 표시합니다.'
      )
      .toJSON(),
    options: {
      name: 'ping',
      isSlash: true
    },
    async execute(client, interaction) {
      interaction.reply(
        `서포트 서버에서 공지와 개발소식을 확인하고, 문의 및 건의를 진행할 수 있습니다! ${config.supportURL}`
      );
    }
  }
);
