import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import clubs from '../databases/clubs';
import organizations from '../databases/organizations';
import students from '../databases/students';
import Student from '../schemas/Student';
import { Event } from '../structures/Event';
import Embed from '../utils/Embed';
import getEmoji from '../utils/GetEmoji';
import numberWithCommas from '../utils/NumberWithCommas';
import skillDescriptionFormat from '../utils/SkillFormatter';

const getStatsEmbed = (
  client: Client,
  student: Student,
  stars: number,
  level: number,
  bondLevel: number
) => {
  const starscaleHp = [1, 1.05, 1.12, 1.21, 1.35];
  const starscaleAttack = [1, 1.1, 1.22, 1.36, 1.53];
  const starscaleHealing = [1, 1.075, 1.175, 1.295, 1.445];

  const { stats } = student;

  const levelscale = (level - 1) / 99;
  const health = Math.ceil(
    parseFloat(
      (
        parseFloat(
          Math.round(
            stats.health1 + (stats.health100 - stats.health1) * levelscale
          ).toFixed(4)
        ) * starscaleHp[stars - 1]
      ).toFixed(4)
    )
  );
  const attack = Math.ceil(
    parseFloat(
      (
        parseFloat(
          Math.round(
            stats.attack1 + (stats.attack100 - stats.attack1) * levelscale
          ).toFixed(4)
        ) * starscaleAttack[stars - 1]
      ).toFixed(4)
    )
  );
  const defense = Math.round(
    parseFloat(
      (
        stats.defense1 +
        (stats.defense100 - stats.defense1) * levelscale
      ).toFixed(4)
    )
  );
  const healing = Math.ceil(
    parseFloat(
      (
        parseFloat(
          Math.round(
            stats.healing1 + (stats.healing100 - stats.healing1) * levelscale
          ).toFixed(4)
        ) * starscaleHealing[stars - 1]
      ).toFixed(4)
    )
  );

  const bondStats: { [stat: string]: number } = {
    health: 0,
    attack: 0,
    defense: 0,
    healing: 0
  };

  Object.entries(student.favorStats).forEach(([stat, values]) => {
    for (let i = 1; i < Math.min(bondLevel, 50); i++) {
      if (i < 20) {
        bondStats[stat] += values[Math.floor(i / 5)];
      } else if (i < 50) {
        bondStats[stat] += values[2 + Math.floor(i / 10)];
      }
    }
  });

  return new Embed(client, 'default')
    .setTitle(`📊 \`${student.name}\`의 능력치에요!`)
    .setDescription(
      `현재 표시 기준은 ⭐️ **${stars}** | 레벨 **${level}** | 인연 레벨 **${bondLevel}** | 스킬 레벨 **기본** | 장비 **기본** 입니다!`
    )
    .addFields({
      name: '**🔹 기본**',
      value:
        `>>> 체력: **${numberWithCommas(health + bondStats['health'])}**${
          bondStats['health'] ? `(♥️+${bondStats['health']})` : ''
        }\n` +
        `공격력: **${numberWithCommas(attack + bondStats['attack'])}**${
          bondStats['attack'] ? `(♥️+${bondStats['attack']})` : ''
        }\n` +
        `방어력: **${numberWithCommas(defense + bondStats['defense'])}**${
          bondStats['defense'] ? `(♥️+${bondStats['defense']})` : ''
        }\n` +
        `치유력: **${numberWithCommas(healing + bondStats['healing'])}**${
          bondStats['healing'] ? `(♥️+${bondStats['healing']})` : ''
        }\n`,
      inline: true
    })
    .addFields({
      name: '**🔸 상세**',
      value:
        `>>> 명중 수치: **${numberWithCommas(stats.hit)}**\n` +
        `회피 수치: **${numberWithCommas(stats.dodge)}**\n` +
        `치명 수치: **${numberWithCommas(stats.critical)}**\n` +
        `치명 저항력: **${numberWithCommas(stats.criticalResistance)}**\n` +
        `치명 대미지: **${numberWithCommas(stats.criticalDamage * 100)}%**\n` +
        `치명 대미지 저항률: **${numberWithCommas(
          stats.criticalDamageResistance * 100
        )}%**\n`,
      inline: true
    })
    .addFields({
      name: '** **',
      value:
        `안정 수치: **${numberWithCommas(stats.stability)}**\n` +
        `사거리: **${numberWithCommas(stats.range)}**\n` +
        `군중 제어 강화력: **${numberWithCommas(
          stats.crowdControlEnhancement
        )}**\n` +
        `군중 제어 저항력: **${numberWithCommas(
          stats.crowdControlResistance
        )}**\n` +
        `받는 회복 효과 강화율: **${numberWithCommas(
          stats.recoveryEffectEnhancement * 100
        )}%**\n`,
      inline: true
    });
};

const getStatsSelectMenu = (student: Student, selected: string) => {
  return new SelectMenuBuilder({
    customId: 'student-info-select',
    placeholder: '상세 정보를 확인하려면 여기를 클릭하세요!',
    options: [
      {
        label: '기본 정보',
        value: `${student.id}:basic`,
        description: '학생의 기본적인 정보를 보여줍니다.',
        emoji: '📝',
        default: selected === 'basic'
      },
      {
        label: '학생 소개',
        value: `${student.id}:introduction`,
        description: '학생 소개를 보여줍니다.',
        emoji: '📒',
        default: selected === 'introduction'
      },
      {
        label: '능력치',
        value: `${student.id}:stats`,
        description: '학생의 능력치를 보여줍니다.',
        emoji: '📊',
        default: selected === 'stats'
      },
      {
        label: '상성 정보',
        value: `${student.id}:compatibility`,
        description: '학생의 상성 정보를 보여줍니다.',
        emoji: '✨',
        default: selected === 'compatibility'
      },
      {
        label: '스킬',
        value: `${student.id}:skills`,
        description: '학생의 스킬을 보여줍니다.',
        emoji: '📚',
        default: selected === 'skills'
      },
      {
        label: '무기 및 장비',
        value: `${student.id}:weapons`,
        description: '학생의 무기 및 장비를 보여줍니다.',
        emoji: '🗡',
        default: selected === 'weapons'
      }
    ]
  });
};

export default new Event('interactionCreate', async (client, interaction) => {
  if (interaction.isSelectMenu()) {
    if (interaction.user.bot) return;

    if (interaction.customId === 'student-info-select') {
      const [id, key] = interaction.values[0].split(':');
      const student = students.find((s) => s.id === id);

      if (!student) return;

      const organization = organizations.find((o) => o.id === student.belong);
      const club = clubs.find((c) => c.id === student.belong);

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
            `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/avatars/${student.id}.png`
          );
      }

      if (key === 'introduction') {
        embed = new Embed(client, 'default')
          .setTitle(`📒 \`${student.name}\`의 소개에요!`)
          .setDescription(
            `**"${student.ments.intro}"**\n\n>>> ${student.description}`
          )
          .setThumbnail(
            `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/standings/${student.id}.png`
          );
      }

      if (key === 'stats') {
        embed = getStatsEmbed(client, student, student.stars, 1, 1);
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
          .setTitle(`✨ \`${student.name}\`의 상성이에요!`)
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
          .setTitle(`📚 \`${student.name}\`의 스킬이에요!`)
          .setDescription(
            `**1레벨 기준으로 표시중입니다!** 변경하려면 **[스킬 레벨 선택]** 버튼을 클릭해주세요.\n\n*[EX]* **${getEmoji(
              `skill_${student.id}_ex`
            )} ${exSkill.name}**\n> ***COST*: \`${
              exSkill.cost[0]
            }\`**\n${exDescription}\n\n` +
              `*[기본]* **${getEmoji(`skill_${student.id}_primary`)} ${
                primarySkill.name
              }**\n> ${primaryDescription}\n\n` +
              `*[강화]* **${getEmoji(`skill_${student.id}_reinforce`)} ${
                reinforceSkill.name
              }**\n> ${reinforceDescription}\n\n` +
              `*[서브]* **${getEmoji(`skill_${student.id}_sub`)} ${
                subSkill.name
              }**\n> ${subDescription}`
          );
      }

      if (key === 'weapons') {
        const { name, type, description } = student.uniqueWeapon;

        embed = new Embed(client, 'default')
          .setTitle(`🗡 \`${student.name}\`의 무기 및 장비에요!`)
          .setDescription(`*[${type}]* **${name}**\n\n>>> ${description}`)
          .setImage(
            `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/weapons/weapon_${student.id}.png`
          );
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
                      customId: `${student.id}:student-info-stats-select-level:${student.stars}:1:1`,
                      label: '별 및 레벨 선택',
                      emoji: '📈',
                      style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                      customId: `${student.id}:student-info-stats-select-bond-level:${student.stars}:1:1`,
                      label: '인연 레벨 선택',
                      emoji: '🤍',
                      style: ButtonStyle.Danger
                    }),
                    new ButtonBuilder({
                      customId: `${student.id}:student-info-stats-select-skills-setting:${student.stars}:1:1`,
                      label: '스킬 설정',
                      emoji: '📝',
                      style: ButtonStyle.Success
                    }),
                    new ButtonBuilder({
                      customId: `${student.id}:student-info-stats-select-weapon-setting:${student.stars}:1:1`,
                      label: '장비 선택',
                      emoji: '🛡',
                      style: ButtonStyle.Secondary
                    })
                  ]
                })
              ]
            : []),
          ...(key === 'skills'
            ? [
                new ActionRowBuilder<ButtonBuilder>({
                  components: [
                    new ButtonBuilder({
                      customId: `${student.id}:student-info-skills-select-skill-level:${student.stars}:1:1`,
                      label: '스킬 레벨 선택',
                      emoji: '📈',
                      style: ButtonStyle.Primary
                    })
                  ]
                })
              ]
            : []),
          new ActionRowBuilder<SelectMenuBuilder>({
            components: [getStatsSelectMenu(student, key)]
          })
        ]
      });
    }
  }

  if (interaction.isButton()) {
    const [id, customId, _prevStars, _prevLevel, _prevBondLevel] =
      interaction.customId.split(':');

    const student = students.find((s) => s.id === id);

    if (!student) return;

    if (customId === 'student-info-stats-select-level') {
      const modal = new ModalBuilder({
        customId: `${id}:student-info-stats-select-level-modal:${_prevStars}:${_prevLevel}:${_prevBondLevel}`,
        title: '학생 별 수 및 레벨 선택',
        components: [
          new ActionRowBuilder<ModalActionRowComponentBuilder>({
            components: [
              new TextInputBuilder({
                customId: 'student-info-stats-select-level-modal-stars',
                label: '학생 별 수 (숫자만 입력하세요)',
                placeholder: '학생 별 수를 입력하세요! (숫자만 입력하세요)',
                style: TextInputStyle.Short,
                required: true,
                value: _prevStars,
                minLength: 1,
                maxLength: 1
              })
            ]
          }),
          new ActionRowBuilder<ModalActionRowComponentBuilder>({
            components: [
              new TextInputBuilder({
                customId: 'student-info-stats-select-level-modal-level',
                label: '학생 레벨 (최대 75, 숫자만 입력하세요)',
                placeholder: '학생 레벨을 입력하세요! (숫자만 입력하세요)',
                style: TextInputStyle.Short,
                required: true,
                value: _prevLevel,
                minLength: 1,
                maxLength: 2
              })
            ]
          })
        ]
      });

      await interaction.showModal(modal);
    }

    if (customId === 'student-info-stats-select-bond-level') {
      const modal = new ModalBuilder({
        customId: `${id}:student-info-stats-select-bond-level-modal:${_prevStars}:${_prevLevel}:${_prevBondLevel}`,
        title: '학생 인연 레벨 선택',
        components: [
          new ActionRowBuilder<ModalActionRowComponentBuilder>({
            components: [
              new TextInputBuilder({
                customId:
                  'student-info-stats-select-bond-level-modal-bond-level',
                label: '인연 레벨 (숫자만 입력하세요)',
                placeholder: '인연 레벨을 입력하세요! (숫자만 입력하세요)',
                style: TextInputStyle.Short,
                required: true,
                value: _prevBondLevel,
                minLength: 1,
                maxLength: 2
              })
            ]
          })
        ]
      });

      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit()) {
    const [id, customId, _prevStars, _prevLevel, _prevBondLevel] =
      interaction.customId.split(':');

    const student = students.find((s) => s.id === id);
    if (!student) return;

    const pervStars = Number(_prevStars);
    const prevLevel = Number(_prevLevel);
    const prevBondLevel = Number(_prevBondLevel);

    let embed: Embed | null = null;
    let stars = pervStars;
    let level = prevLevel;
    let bondLevel = prevBondLevel;

    if (customId === 'student-info-stats-select-level-modal') {
      stars = Number(
        interaction.fields.getTextInputValue(
          'student-info-stats-select-level-modal-stars'
        )
      );
      level = Number(
        interaction.fields.getTextInputValue(
          'student-info-stats-select-level-modal-level'
        )
      );

      if (isNaN(stars) || stars < 1 || stars > 5) {
        return interaction.reply({
          content: '별 수를 잘못 입력하셨어요! 1~5사이의 숫자만 입력해야 해요.',
          ephemeral: true
        });
      }
      if (isNaN(level) || stars < 1 || stars > 75) {
        return interaction.reply({
          content:
            '학생 레벨을 잘못 입력하셨어요! 1~75사이의 숫자만 입력해야 해요.',
          ephemeral: true
        });
      }
    }

    if (customId === 'student-info-stats-select-bond-level-modal') {
      bondLevel = Number(
        interaction.fields.getTextInputValue(
          'student-info-stats-select-bond-level-modal-bond-level'
        )
      );

      if (isNaN(bondLevel) || bondLevel < 1 || bondLevel > 20) {
        return interaction.reply({
          content:
            '인연 레벨을 잘못 입력하셨어요! 1~20사이의 숫자만 입력해야 해요.',
          ephemeral: true
        });
      }
    }

    embed = getStatsEmbed(client, student, stars, level, bondLevel);

    await (interaction as any).deferUpdate();
    await interaction.message?.edit({
      embeds: embed ? [embed] : undefined,
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              customId: `${student.id}:student-info-stats-select-level:${stars}:${level}:${bondLevel}`,
              label: '별 및 레벨 선택',
              emoji: '📈',
              style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
              customId: `${student.id}:student-info-stats-select-bond-level:${stars}:${level}:${bondLevel}`,
              label: '인연 레벨 선택',
              emoji: '🤍',
              style: ButtonStyle.Danger
            }),
            new ButtonBuilder({
              customId: `${student.id}:student-info-stats-select-skills-setting:${stars}:${level}:${bondLevel}`,
              label: '스킬 설정',
              emoji: '📝',
              style: ButtonStyle.Success
            }),
            new ButtonBuilder({
              customId: `${student.id}:student-info-stats-select-weapon-setting:${stars}:${level}:${bondLevel}`,
              label: '장비 선택',
              emoji: '🛡',
              style: ButtonStyle.Secondary
            })
          ]
        }),
        new ActionRowBuilder<SelectMenuBuilder>({
          components: [getStatsSelectMenu(student, 'stats')]
        })
      ]
    });
  }
});
