import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  SelectMenuBuilder
} from 'discord.js';
import CommandManager from '../managers/CommandManager';
import ErrorManager from '../managers/ErrorManager';
import { Club } from '../schemas/Club';
import { Organization } from '../schemas/Organization';
import StudentModel from '../schemas/Student';
import { Event } from '../structures/Event';
import Embed from '../utils/Embed';
import getEmoji from '../utils/GetEmoji';
import numberWithCommas from '../utils/NumberWithCommas';
import skillDescriptionFormat from '../utils/SkillFormatter';

export default new Event('interactionCreate', async (client, interaction) => {
  const commandManager = new CommandManager(client);
  const errorManager = new ErrorManager(client);

  if (interaction.isChatInputCommand()) {
    if (interaction.user.bot) return;
    if (interaction.channel?.type === ChannelType.DM)
      return interaction.reply('DM으로는 명령어 사용이 불가능해요');

    const command = commandManager.get(interaction.commandName);
    try {
      if (commandManager.isSlash(command)) {
        command.slash
          ? await command.slash.execute(client, interaction)
          : await command.execute(client, interaction);
      }
      //await interaction.deferReply().catch(() => { })
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true });
    }
  }

  if (interaction.isSelectMenu()) {
    if (interaction.user.bot) return;

    if (interaction.customId === 'student-info-select') {
      const [studentId, key] = interaction.values[0].split(':');
      const student = await StudentModel.findById(studentId)
        .populate('belong')
        .populate('club');

      if (!student) return;

      const organization = student?.belong as unknown as Organization | null;
      const club = student?.club as unknown as Club | null;

      let embed: Embed | null = null;

      if (key === 'basic') {
        embed = new Embed(client, 'default')
          .setTitle(`\`${student.name}\`의 기본 정보에요!`)
          .setDescription(`${'⭐️'.repeat(student.stars)} | *${student.type}*`)
          .addFields({
            name: '**소속**',
            value: organization
              ? `<:1002795265813655643:1002826373875892304> **${organization.name}**\n` +
                ` ${student.grade}학년`
              : '*(없음)*',
            inline: true
          })
          .addFields({
            name: '**부활동**',
            value: club ? `**${club.name}**\n` : '*(없음)*',
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
            `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/avatars/${student.code}.png`
          );
      }

      if (key === 'introduction') {
        embed = new Embed(client, 'default')
          .setTitle(`\`${student.name}\`의 소개에요!`)
          .setDescription(
            `**"${student.ments.intro}"**\n\n>>> ${student.description}`
          )
          .setThumbnail(
            `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/avatars/${student.code}.png`
          );
      }

      if (key === 'stats') {
        embed = new Embed(client, 'default')
          .setTitle(`\`${student.name}\`의 능력치에요!`)
          .setDescription(
            '현재 표시 기준은 ⭐️**x3** | 레벨 **1** | 인연 레벨 **1** | 스킬 레벨 **기본** | 스킬 스탯 **기본** 입니다!'
          )
          .addFields({
            name: '**🔹 기본**',
            value:
              `>>> 체력: **${numberWithCommas(
                student.defaultStats.health
              )}**\n` +
              `공격력: **${numberWithCommas(student.defaultStats.attack)}**\n` +
              `방어력: **${numberWithCommas(
                student.defaultStats.defense
              )}**\n` +
              `치유력: **${numberWithCommas(student.defaultStats.healing)}**\n`,
            inline: true
          })
          .addFields({
            name: '**🔸 상세**',
            value:
              `>>> 명중 수치: **${numberWithCommas(
                student.defaultStats.hit
              )}**\n` +
              `회피 수치: **${numberWithCommas(
                student.defaultStats.dodge
              )}**\n` +
              `치명 수치: **${numberWithCommas(
                student.defaultStats.critical
              )}**\n` +
              `치명 저항력: **${numberWithCommas(
                student.defaultStats.criticalResistance
              )}**\n` +
              `치명 대미지: **${numberWithCommas(
                student.defaultStats.criticalDamage * 100
              )}%**\n` +
              `치명 대미지 저항률: **${numberWithCommas(
                student.defaultStats.criticalDamageResistance * 100
              )}%**\n`,
            inline: true
          })
          .addFields({
            name: '** **',
            value:
              `안정 수치: **${numberWithCommas(
                student.defaultStats.stability
              )}**\n` +
              `사거리: **${numberWithCommas(student.defaultStats.range)}**\n` +
              `군중 제어 강화력: **${numberWithCommas(
                student.defaultStats.crowdControlEnhancement
              )}**\n` +
              `군중 제어 저항력: **${numberWithCommas(
                student.defaultStats.crowdControlResistance
              )}**\n` +
              `받는 회복 효과 강화율: **${numberWithCommas(
                student.defaultStats.recoveryEffectEnhancement * 100
              )}%**\n`,
            inline: true
          });
      }

      if (key === 'compatibility') {
        const { compatibility } = student;
        const { primaryType, attackType, defenseType, terrains } =
          compatibility;

        let primaryTypeStr;
        switch (primaryType) {
          case 'TANK':
            primaryTypeStr = '탱커';
            break;
          case 'DEAL':
            primaryTypeStr = '딜러';
            break;
          case 'HEAL':
            primaryTypeStr = '힐러';
            break;
          case 'SUPPORT':
            primaryTypeStr = '서포터';
            break;
        }

        let attackTypeStr;
        switch (attackType) {
          case 'EXPLOSIVE':
            attackTypeStr = '```diff\n- 폭발\n```';
            break;
          case 'PENETRATING':
            attackTypeStr = '```fix\n관통\n```';
            break;
          case 'MYSTERY':
            attackTypeStr = '```bash\n"신비"\n```';
            break;
        }

        let defenseTypeStr;
        switch (defenseType) {
          case 'LIGHT_ARMOR':
            defenseTypeStr = '```diff\n- 경장갑\n```';
            break;
          case 'HEAVY_ARMOR':
            defenseTypeStr = '```fix\n중장갑\n```';
            break;
          case 'SPECIAL_ARMOR':
            defenseTypeStr = '```bash\n"특수장갑"\n```';
            break;
        }

        embed = new Embed(client, 'default')
          .setTitle(`\`${student.name}\`의 상성이에요!`)
          .addFields({
            name: '**포지션**',
            value: `>>> ${getEmoji(
              `primaryType_${primaryType.toLowerCase()}`
            )} **${primaryTypeStr}** | ***${compatibility.position}***`,
            inline: true
          })
          .addFields({
            name: '**공격 타입**',
            value: `${attackTypeStr}`,
            inline: true
          })
          .addFields({
            name: '**방어 타입**',
            value: `${defenseTypeStr}`,
            inline: true
          })
          .addFields({
            name: '**장소별 전투력**',
            value: `>>> ${getEmoji('terrain_street')} 시가지: ${getEmoji(
              `activity_${terrains.street}`
            )} | ${getEmoji('terrain_outdoor')} 야외전: ${getEmoji(
              `activity_${terrains.outdoor}`
            )} | ${getEmoji('terrain_indoor')} 실내전: ${getEmoji(
              `activity_${terrains.indoor}`
            )}`,
            inline: true
          });
      }

      if (key === 'skills') {
        const {
          ex: exSkill,
          primary: primarySkill,
          reinforce: reinforceSkill,
          sub: subSkill
        } = student.skills;

        const exDescription = skillDescriptionFormat(
          exSkill.description,
          exSkill.variables,
          1
        );
        const primaryDescription = skillDescriptionFormat(
          primarySkill.description,
          primarySkill.variables,
          1
        );
        const reinforceDescription = skillDescriptionFormat(
          reinforceSkill.description,
          reinforceSkill.variables,
          1
        );
        const subDescription = skillDescriptionFormat(
          subSkill.description,
          subSkill.variables,
          1
        );

        embed = new Embed(client, 'default')
          .setTitle(`\`${student.name}\`의 스킬이에요!`)
          .addFields({
            name: `**[EX 스킬] ${exSkill.name}**`,
            value: `>>> ***COST*: \`${exSkill.cost}\`**\n${exDescription}`
          })
          .addFields({
            name: `**[기본 스킬] ${primarySkill.name}**`,
            value: `>>> ${primaryDescription}`
          })
          .addFields({
            name: `**[강화 스킬] ${reinforceSkill.name}**`,
            value: `>>> ${reinforceDescription}`
          })
          .addFields({
            name: `**[서브 스킬] ${subSkill.name}**`,
            value: `>>> ${subDescription}`
          });
      }

      await interaction.deferUpdate();
      await interaction.message.edit({
        embeds: embed ? [embed] : undefined,
        components: [
          ...(key === 'stats'
            ? [
                new ActionRowBuilder<ButtonBuilder>({
                  components: [
                    new ButtonBuilder({
                      customId: 'student-info-stats-select-level',
                      label: '레벨 선택',
                      emoji: '📈',
                      style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                      customId: 'student-info-stats-select-destiny-level',
                      label: '인연 레벨 선택',
                      emoji: '🤍',
                      style: ButtonStyle.Danger
                    }),
                    new ButtonBuilder({
                      customId: 'student-info-stats-select-skills-setting',
                      label: '스킬 설정',
                      emoji: '📝',
                      style: ButtonStyle.Success
                    }),
                    new ButtonBuilder({
                      customId: 'student-info-stats-select-weapon-setting',
                      label: '장비 선택',
                      emoji: '🛡',
                      style: ButtonStyle.Secondary
                    })
                  ]
                })
              ]
            : []),
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
                    default: key === 'basic'
                  },
                  {
                    label: '학생 소개',
                    value: `${student.id}:introduction`,
                    description: '학생 소개를 보여줍니다.',
                    emoji: '📒',
                    default: key === 'introduction'
                  },
                  {
                    label: '능력치',
                    value: `${student.id}:stats`,
                    description: '학생의 능력치를 보여줍니다.',
                    emoji: '📊',
                    default: key === 'stats'
                  },
                  {
                    label: '상성 정보',
                    value: `${student.id}:compatibility`,
                    description: '학생의 상성 정보를 보여줍니다.',
                    emoji: '✨',
                    default: key === 'compatibility'
                  },
                  {
                    label: '스킬',
                    value: `${student.id}:skills`,
                    description: '학생의 스킬을 보여줍니다.',
                    emoji: '📚',
                    default: key === 'skills'
                  },
                  {
                    label: '무기 및 장비',
                    value: `${student.id}:weapon`,
                    description: '학생의 무기 및 장비를 보여줍니다.',
                    emoji: '🗡',
                    default: key === 'weapon'
                  }
                ]
              })
            ]
          })
        ]
      });
    }
  }
});
