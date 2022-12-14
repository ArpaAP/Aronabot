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
    .setTitle(`???? \`${student.name}\`??? ???????????????!`)
    .setDescription(
      `?????? ?????? ????????? ?????? **${stars}** | ?????? **${level}** | ?????? ?????? **${bondLevel}** | ?????? ?????? **??????** | ?????? **??????** ?????????!`
    )
    .addFields({
      name: '**???? ??????**',
      value:
        `>>> ??????: **${numberWithCommas(health + bondStats['health'])}**${
          bondStats['health'] ? `(??????+${bondStats['health']})` : ''
        }\n` +
        `?????????: **${numberWithCommas(attack + bondStats['attack'])}**${
          bondStats['attack'] ? `(??????+${bondStats['attack']})` : ''
        }\n` +
        `?????????: **${numberWithCommas(defense + bondStats['defense'])}**${
          bondStats['defense'] ? `(??????+${bondStats['defense']})` : ''
        }\n` +
        `?????????: **${numberWithCommas(healing + bondStats['healing'])}**${
          bondStats['healing'] ? `(??????+${bondStats['healing']})` : ''
        }\n`,
      inline: true
    })
    .addFields({
      name: '**???? ??????**',
      value:
        `>>> ?????? ??????: **${numberWithCommas(stats.hit)}**\n` +
        `?????? ??????: **${numberWithCommas(stats.dodge)}**\n` +
        `?????? ??????: **${numberWithCommas(stats.critical)}**\n` +
        `?????? ?????????: **${numberWithCommas(stats.criticalResistance)}**\n` +
        `?????? ?????????: **${numberWithCommas(stats.criticalDamage * 100)}%**\n` +
        `?????? ????????? ?????????: **${numberWithCommas(
          stats.criticalDamageResistance * 100
        )}%**\n`,
      inline: true
    })
    .addFields({
      name: '** **',
      value:
        `?????? ??????: **${numberWithCommas(stats.stability)}**\n` +
        `?????????: **${numberWithCommas(stats.range)}**\n` +
        `?????? ?????? ?????????: **${numberWithCommas(
          stats.crowdControlEnhancement
        )}**\n` +
        `?????? ?????? ?????????: **${numberWithCommas(
          stats.crowdControlResistance
        )}**\n` +
        `?????? ?????? ?????? ?????????: **${numberWithCommas(
          stats.recoveryEffectEnhancement * 100
        )}%**\n`,
      inline: true
    });
};

const getStatsSelectMenu = (student: Student, selected: string) => {
  return new SelectMenuBuilder({
    customId: 'student-info-select',
    placeholder: '?????? ????????? ??????????????? ????????? ???????????????!',
    options: [
      {
        label: '?????? ??????',
        value: `${student.id}:basic`,
        description: '????????? ???????????? ????????? ???????????????.',
        emoji: '????',
        default: selected === 'basic'
      },
      {
        label: '?????? ??????',
        value: `${student.id}:introduction`,
        description: '?????? ????????? ???????????????.',
        emoji: '????',
        default: selected === 'introduction'
      },
      {
        label: '?????????',
        value: `${student.id}:stats`,
        description: '????????? ???????????? ???????????????.',
        emoji: '????',
        default: selected === 'stats'
      },
      {
        label: '?????? ??????',
        value: `${student.id}:compatibility`,
        description: '????????? ?????? ????????? ???????????????.',
        emoji: '???',
        default: selected === 'compatibility'
      },
      {
        label: '??????',
        value: `${student.id}:skills`,
        description: '????????? ????????? ???????????????.',
        emoji: '????',
        default: selected === 'skills'
      },
      {
        label: '?????? ??? ??????',
        value: `${student.id}:weapons`,
        description: '????????? ?????? ??? ????????? ???????????????.',
        emoji: '????',
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
          .setTitle(`\`${student.name}\`??? ?????? ????????????!`)
          .setDescription(`${'??????'.repeat(student.stars)} | *${student.type}*`)
          .addFields({
            name: '**??????**',
            value: organization
              ? `<:1002795265813655643:1002826373875892304> **${organization.name}**\n` +
                ` ${student.grade}??????`
              : '*(??????)*',
            inline: true
          })
          .addFields({
            name: '**?????????**',
            value: club ? `**${club.name}**\n` : '*(??????)*',
            inline: true
          })
          .addFields({
            name: '**??????**',
            value: student.age.toString(),
            inline: true
          })
          .addFields({
            name: '**???**',
            value: `${student.height}cm`,
            inline: true
          })
          .addFields({
            name: '**??????**',
            value: student.birth.replace(/\//g, '??? ') + '???',
            inline: true
          })
          .addFields({
            name: '**??????**',
            value: student.hobby ?? '*(??????)*',
            inline: true
          })
          .addFields({
            name: '**????????????**',
            value: student.illustrator ?? '*(??????)*',
            inline: true
          })
          .addFields({
            name: '**??????**',
            value: student.voiceActor ?? '*(??????)*',
            inline: true
          })
          .setThumbnail(
            `https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/avatars/${student.id}.png`
          );
      }

      if (key === 'introduction') {
        embed = new Embed(client, 'default')
          .setTitle(`???? \`${student.name}\`??? ????????????!`)
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
            primaryTypeStr = '??????';
            break;
          case 'DEAL':
            primaryTypeStr = '??????';
            break;
          case 'HEAL':
            primaryTypeStr = '??????';
            break;
          case 'SUPPORT':
            primaryTypeStr = '?????????';
            break;
        }

        let attackTypeStr;
        switch (attackType) {
          case 'EXPLOSIVE':
            attackTypeStr = '```diff\n- ??????\n```';
            break;
          case 'PENETRATING':
            attackTypeStr = '```fix\n??????\n```';
            break;
          case 'MYSTERY':
            attackTypeStr = '```bash\n"??????"\n```';
            break;
        }

        let defenseTypeStr;
        switch (defenseType) {
          case 'LIGHT_ARMOR':
            defenseTypeStr = '```diff\n- ?????????\n```';
            break;
          case 'HEAVY_ARMOR':
            defenseTypeStr = '```fix\n?????????\n```';
            break;
          case 'SPECIAL_ARMOR':
            defenseTypeStr = '```bash\n"????????????"\n```';
            break;
        }

        embed = new Embed(client, 'default')
          .setTitle(`??? \`${student.name}\`??? ???????????????!`)
          .addFields({
            name: '**?????????**',
            value: `>>> ${getEmoji(
              `primaryType_${primaryType.toLowerCase()}`
            )} **${primaryTypeStr}** | ***${compatibility.position}***`,
            inline: true
          })
          .addFields({
            name: '**?????? ??????**',
            value: `${attackTypeStr}`,
            inline: true
          })
          .addFields({
            name: '**?????? ??????**',
            value: `${defenseTypeStr}`,
            inline: true
          })
          .addFields({
            name: '**????????? ?????????**',
            value: `>>> ${getEmoji('terrain_street')} ?????????: ${getEmoji(
              `activity_${terrains.street}`
            )} | ${getEmoji('terrain_outdoor')} ?????????: ${getEmoji(
              `activity_${terrains.outdoor}`
            )} | ${getEmoji('terrain_indoor')} ?????????: ${getEmoji(
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
          .setTitle(`???? \`${student.name}\`??? ???????????????!`)
          .setDescription(
            `**1?????? ???????????? ??????????????????!** ??????????????? **[?????? ?????? ??????]** ????????? ??????????????????.\n\n*[EX]* **${getEmoji(
              `skill_${student.id}_ex`
            )} ${exSkill.name}**\n> ***COST*: \`${
              exSkill.cost[0]
            }\`**\n${exDescription}\n\n` +
              `*[??????]* **${getEmoji(`skill_${student.id}_primary`)} ${
                primarySkill.name
              }**\n> ${primaryDescription}\n\n` +
              `*[??????]* **${getEmoji(`skill_${student.id}_reinforce`)} ${
                reinforceSkill.name
              }**\n> ${reinforceDescription}\n\n` +
              `*[??????]* **${getEmoji(`skill_${student.id}_sub`)} ${
                subSkill.name
              }**\n> ${subDescription}`
          );
      }

      if (key === 'weapons') {
        const { name, type, description } = student.uniqueWeapon;

        embed = new Embed(client, 'default')
          .setTitle(`???? \`${student.name}\`??? ?????? ??? ????????????!`)
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
                      label: '??? ??? ?????? ??????',
                      emoji: '????',
                      style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                      customId: `${student.id}:student-info-stats-select-bond-level:${student.stars}:1:1`,
                      label: '?????? ?????? ??????',
                      emoji: '????',
                      style: ButtonStyle.Danger
                    }),
                    new ButtonBuilder({
                      customId: `${student.id}:student-info-stats-select-skills-setting:${student.stars}:1:1`,
                      label: '?????? ??????',
                      emoji: '????',
                      style: ButtonStyle.Success
                    }),
                    new ButtonBuilder({
                      customId: `${student.id}:student-info-stats-select-weapon-setting:${student.stars}:1:1`,
                      label: '?????? ??????',
                      emoji: '????',
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
                      label: '?????? ?????? ??????',
                      emoji: '????',
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
        title: '?????? ??? ??? ??? ?????? ??????',
        components: [
          new ActionRowBuilder<ModalActionRowComponentBuilder>({
            components: [
              new TextInputBuilder({
                customId: 'student-info-stats-select-level-modal-stars',
                label: '?????? ??? ??? (????????? ???????????????)',
                placeholder: '?????? ??? ?????? ???????????????! (????????? ???????????????)',
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
                label: '?????? ?????? (?????? 75, ????????? ???????????????)',
                placeholder: '?????? ????????? ???????????????! (????????? ???????????????)',
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
        title: '?????? ?????? ?????? ??????',
        components: [
          new ActionRowBuilder<ModalActionRowComponentBuilder>({
            components: [
              new TextInputBuilder({
                customId:
                  'student-info-stats-select-bond-level-modal-bond-level',
                label: '?????? ?????? (????????? ???????????????)',
                placeholder: '?????? ????????? ???????????????! (????????? ???????????????)',
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
          content: '??? ?????? ?????? ??????????????????! 1~5????????? ????????? ???????????? ??????.',
          ephemeral: true
        });
      }
      if (isNaN(level) || stars < 1 || stars > 75) {
        return interaction.reply({
          content:
            '?????? ????????? ?????? ??????????????????! 1~75????????? ????????? ???????????? ??????.',
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
            '?????? ????????? ?????? ??????????????????! 1~20????????? ????????? ???????????? ??????.',
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
              label: '??? ??? ?????? ??????',
              emoji: '????',
              style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
              customId: `${student.id}:student-info-stats-select-bond-level:${stars}:${level}:${bondLevel}`,
              label: '?????? ?????? ??????',
              emoji: '????',
              style: ButtonStyle.Danger
            }),
            new ButtonBuilder({
              customId: `${student.id}:student-info-stats-select-skills-setting:${stars}:${level}:${bondLevel}`,
              label: '?????? ??????',
              emoji: '????',
              style: ButtonStyle.Success
            }),
            new ButtonBuilder({
              customId: `${student.id}:student-info-stats-select-weapon-setting:${stars}:${level}:${bondLevel}`,
              label: '?????? ??????',
              emoji: '????',
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
