import { BaseCommand } from '../../structures/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../../../config';

export default new BaseCommand(
  {
    name: 'donation',
    description: '후원 링크를 표시합니다.',
    aliases: ['후원', '기부', '도네', '도네이션', '도네이트']
  },
  async (client, message, args) => {
    message.reply(
      `선생님, 이 서비스가 마음에 드셨다면 개발자를 지원해주시는건 어떠신가요! 봇 서버비 지불에 보탬이 되고, 더 나은 서비스를 위해 도움이 됩니다. ${config.donationURL}`
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
        `선생님, 이 서비스가 마음에 드셨다면 개발자를 지원해주시는건 어떠신가요! 봇 서버비 지불에 보탬이 되고, 더 나은 서비스를 위해 도움이 됩니다. ${config.donationURL}`
      );
    }
  }
);
