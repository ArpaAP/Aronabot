import { BaseCommand } from '../../structures/Command';
import Embed from '../../utils/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { StudentModel } from '../../schemas/Student';
import { Organization } from '../../schemas/Organization';
import { Club } from '../../schemas/Club';
import { ActionRowBuilder, SelectMenuBuilder } from 'discord.js';

export default new BaseCommand(
  {
    name: '학생',
    description: '학생 정보를 보여줘요!',
    aliases: ['스튜던트', '가쿠세이', '学生', 'gakusei', 'student']
  },
  async (client, message, args) => {
    let query = args.join(' ');

    if (!args.length) {
      return message.reply('학생 이름을 입력해주세요!');
    }

    let student = await StudentModel.findOne({
      $text: { $search: query }
    })
      .populate('belong')
      .populate('club');

    let organization = student?.belong as unknown as Organization | null;
    let club = student?.club as unknown as Club | null;

    if (!student) {
      return message.reply('해당하는 학생이 없어요.');
    }

    let embed = new Embed(client, 'default')
      .setTitle(`\`${student.name}\`의 기본 정보에요!`)
      .setDescription(`${'⭐️'.repeat(student.stars)} | *${student.type}*`)
      .addFields({
        name: '**소속**',
        value: organization
          ? `<:1002795265813655643:1002826373875892304> **${organization.name}**` +
            ` ${student.grade}학년`
          : '*(없음)*',
        inline: true
      })
      .addFields({
        name: '**부활동**',
        value: club ? `**${club.name}**` : '*(없음)*',
        inline: true
      })
      .addFields({
        name: '**나이**',
        value: student.age.toString(),
        inline: true
      })
      .addFields({
        name: '**키**',
        value: `${student.height}cm`,
        inline: true
      })
      .addFields({
        name: '**생일**',
        value: student.birth.replace(/\//g, '월 ') + '일',
        inline: true
      })
      .addFields({
        name: '**취미**',
        value: student.hobby ?? '*(없음)*',
        inline: true
      })
      .addFields({
        name: '**일러스트**',
        value: student.illustrator ?? '*(없음)*',
        inline: true
      })
      .addFields({
        name: '**성우**',
        value: student.voiceActor ?? '*(없음)*',
        inline: true
      })
      .setThumbnail(
        `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/avatars/${student.code}.png` ??
          null
      );

    message.reply({
      embeds: [embed],
      components: [
        new ActionRowBuilder<SelectMenuBuilder>({
          components: [
            new SelectMenuBuilder({
              customId: 'student-info-select',
              placeholder: '상세 정보를 확인하려면 여기를 클릭하세요!',
              options: [
                {
                  label: '기본 정보',
                  value: `${student.id}:basic`,
                  description: '학생의 기본적인 정보를 보여줍니다.',
                  emoji: '📝',
                  default: true
                },
                {
                  label: '학생 소개',
                  value: `${student.id}:introduction`,
                  description: '학생 소개를 보여줍니다.',
                  emoji: '📒'
                },
                {
                  label: '능력치',
                  value: `${student.id}:stats`,
                  description: '학생의 능력치를 보여줍니다.',
                  emoji: '📊'
                },
                {
                  label: '상성 정보',
                  value: `${student.id}:fit`,
                  description: '학생의 상성 정보를 보여줍니다.',
                  emoji: '✨'
                },
                {
                  label: '스킬',
                  value: `${student.id}:skill`,
                  description: '학생의 스킬을 보여줍니다.',
                  emoji: '📚'
                },
                {
                  label: '무기 및 장비',
                  value: `${student.id}:weapon`,
                  description: '학생의 무기 및 장비를 보여줍니다.',
                  emoji: '🗡'
                }
              ]
            })
          ]
        })
      ]
    });
  },
  {
    data: new SlashCommandBuilder()
      .setName('학생')
      .setDescription('학생 정보를 보여줘요!')
      .addStringOption((option) =>
        option.setName('이름').setDescription('학생의 이름').setRequired(true)
      )
      .toJSON(),
    options: {
      name: 'student',
      isSlash: true
    },
    async execute(client, interaction) {
      let query = interaction.options.getString('이름', true);

      let student = await StudentModel.findOne({
        $text: { $search: query }
      })
        .populate('belong')
        .populate('club');

      let organization = student?.belong as unknown as Organization | null;
      let club = student?.club as unknown as Club | null;

      if (!student) {
        return interaction.reply('해당하는 학생이 없어요.');
      }

      let embed = new Embed(client, 'default')
        .setTitle(`\`${student.name}\`의 정보에요!`)
        .setDescription(`${'⭐️'.repeat(student.stars)} | *${student.type}*`)
        .addFields({
          name: '**소속**',
          value: organization
            ? `<:1002795265813655643:1002826373875892304> **${organization.name}**` +
              ` ${student.grade}학년`
            : '*(없음)*',
          inline: true
        })
        .addFields({
          name: '**부활동**',
          value: club ? `**${club.name}**` : '*(없음)*',
          inline: true
        })
        .addFields({
          name: '**나이**',
          value: student.age.toString(),
          inline: true
        })
        .addFields({
          name: '**키**',
          value: `${student.height}cm`,
          inline: true
        })
        .addFields({
          name: '**생일**',
          value: student.birth.replace(/\//g, '월 ') + '일',
          inline: true
        })
        .addFields({
          name: '**취미**',
          value: student.hobby ?? '*(없음)*',
          inline: true
        })
        .addFields({
          name: '**일러스트**',
          value: student.illustrator ?? '*(없음)*',
          inline: true
        })
        .addFields({
          name: '**성우**',
          value: student.voiceActor ?? '*(없음)*',
          inline: true
        })
        .setThumbnail(
          `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/avatars/${student.code}.png` ??
            null
        );

      interaction.reply({
        embeds: [embed],
        components: [
          new ActionRowBuilder<SelectMenuBuilder>({
            components: [
              new SelectMenuBuilder({
                customId: 'student-info-select',
                placeholder: '상세 정보를 확인하려면 여기를 클릭하세요!',
                options: [
                  {
                    label: '기본 정보',
                    value: `${student.id}:basic`,
                    description: '학생의 기본적인 정보를 보여줍니다.',
                    emoji: '📝',
                    default: true
                  },
                  {
                    label: '학생 소개',
                    value: `${student.id}:introduction`,
                    description: '학생 소개를 보여줍니다.',
                    emoji: '📒'
                  },
                  {
                    label: '능력치',
                    value: `${student.id}:stats`,
                    description: '학생의 능력치를 보여줍니다.',
                    emoji: '📊'
                  },
                  {
                    label: '상성 정보',
                    value: `${student.id}:fit`,
                    description: '학생의 상성 정보를 보여줍니다.',
                    emoji: '✨'
                  },
                  {
                    label: '스킬',
                    value: `${student.id}:skill`,
                    description: '학생의 스킬을 보여줍니다.',
                    emoji: '📚'
                  },
                  {
                    label: '무기 및 장비',
                    value: `${student.id}:weapon`,
                    description: '학생의 무기 및 장비를 보여줍니다.',
                    emoji: '🗡'
                  }
                ]
              })
            ]
          })
        ]
      });
    }
  }
);
