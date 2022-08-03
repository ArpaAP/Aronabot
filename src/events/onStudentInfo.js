"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const clubs_1 = __importDefault(require("../databases/clubs"));
const organizations_1 = __importDefault(require("../databases/organizations"));
const students_1 = __importDefault(require("../databases/students"));
const Event_1 = require("../structures/Event");
const Embed_1 = __importDefault(require("../utils/Embed"));
const GetEmoji_1 = __importDefault(require("../utils/GetEmoji"));
const NumberWithCommas_1 = __importDefault(require("../utils/NumberWithCommas"));
const SkillFormatter_1 = __importDefault(require("../utils/SkillFormatter"));
const getStatsEmbed = (client, student, stars, level, bondLevel) => {
    const starscaleHp = [1, 1.05, 1.12, 1.21, 1.35];
    const starscaleAttack = [1, 1.1, 1.22, 1.36, 1.53];
    const starscaleHealing = [1, 1.075, 1.175, 1.295, 1.445];
    const { stats } = student;
    const levelscale = (level - 1) / 99;
    const health = Math.ceil(parseFloat((parseFloat(Math.round(stats.health1 + (stats.health100 - stats.health1) * levelscale).toFixed(4)) * starscaleHp[stars - 1]).toFixed(4)));
    const attack = Math.ceil(parseFloat((parseFloat(Math.round(stats.attack1 + (stats.attack100 - stats.attack1) * levelscale).toFixed(4)) * starscaleAttack[stars - 1]).toFixed(4)));
    const defense = Math.round(parseFloat((stats.defense1 +
        (stats.defense100 - stats.defense1) * levelscale).toFixed(4)));
    const healing = Math.ceil(parseFloat((parseFloat(Math.round(stats.healing1 + (stats.healing100 - stats.healing1) * levelscale).toFixed(4)) * starscaleHealing[stars - 1]).toFixed(4)));
    const bondStats = {
        health: 0,
        attack: 0,
        defense: 0,
        healing: 0
    };
    Object.entries(student.favorStats).forEach(([stat, values]) => {
        for (let i = 1; i < Math.min(bondLevel, 50); i++) {
            if (i < 20) {
                bondStats[stat] += values[Math.floor(i / 5)];
            }
            else if (i < 50) {
                bondStats[stat] += values[2 + Math.floor(i / 10)];
            }
        }
    });
    return new Embed_1.default(client, 'default')
        .setTitle(`📊 \`${student.name}\`의 능력치에요!`)
        .setDescription(`현재 표시 기준은 ⭐️ **${stars}** | 레벨 **${level}** | 인연 레벨 **${bondLevel}** | 스킬 레벨 **기본** | 장비 **기본** 입니다!`)
        .addFields({
        name: '**🔹 기본**',
        value: `>>> 체력: **${(0, NumberWithCommas_1.default)(health + bondStats['health'])}**${bondStats['health'] ? `(♥️+${bondStats['health']})` : ''}\n` +
            `공격력: **${(0, NumberWithCommas_1.default)(attack + bondStats['attack'])}**${bondStats['attack'] ? `(♥️+${bondStats['attack']})` : ''}\n` +
            `방어력: **${(0, NumberWithCommas_1.default)(defense + bondStats['defense'])}**${bondStats['defense'] ? `(♥️+${bondStats['defense']})` : ''}\n` +
            `치유력: **${(0, NumberWithCommas_1.default)(healing + bondStats['healing'])}**${bondStats['healing'] ? `(♥️+${bondStats['healing']})` : ''}\n`,
        inline: true
    })
        .addFields({
        name: '**🔸 상세**',
        value: `>>> 명중 수치: **${(0, NumberWithCommas_1.default)(stats.hit)}**\n` +
            `회피 수치: **${(0, NumberWithCommas_1.default)(stats.dodge)}**\n` +
            `치명 수치: **${(0, NumberWithCommas_1.default)(stats.critical)}**\n` +
            `치명 저항력: **${(0, NumberWithCommas_1.default)(stats.criticalResistance)}**\n` +
            `치명 대미지: **${(0, NumberWithCommas_1.default)(stats.criticalDamage * 100)}%**\n` +
            `치명 대미지 저항률: **${(0, NumberWithCommas_1.default)(stats.criticalDamageResistance * 100)}%**\n`,
        inline: true
    })
        .addFields({
        name: '** **',
        value: `안정 수치: **${(0, NumberWithCommas_1.default)(stats.stability)}**\n` +
            `사거리: **${(0, NumberWithCommas_1.default)(stats.range)}**\n` +
            `군중 제어 강화력: **${(0, NumberWithCommas_1.default)(stats.crowdControlEnhancement)}**\n` +
            `군중 제어 저항력: **${(0, NumberWithCommas_1.default)(stats.crowdControlResistance)}**\n` +
            `받는 회복 효과 강화율: **${(0, NumberWithCommas_1.default)(stats.recoveryEffectEnhancement * 100)}%**\n`,
        inline: true
    });
};
const getStatsSelectMenu = (student, selected) => {
    return new discord_js_1.SelectMenuBuilder({
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
exports.default = new Event_1.Event('interactionCreate', async (client, interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.user.bot)
            return;
        if (interaction.customId === 'student-info-select') {
            const [id, key] = interaction.values[0].split(':');
            const student = students_1.default.find((s) => s.id === id);
            if (!student)
                return;
            const organization = organizations_1.default.find((o) => o.id === student.belong);
            const club = clubs_1.default.find((c) => c.id === student.belong);
            let embed = null;
            if (key === 'basic') {
                embed = new Embed_1.default(client, 'default')
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
                    .setThumbnail(`https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/avatars/${student.id}.png`);
            }
            if (key === 'introduction') {
                embed = new Embed_1.default(client, 'default')
                    .setTitle(`📒 \`${student.name}\`의 소개에요!`)
                    .setDescription(`**"${student.ments.intro}"**\n\n>>> ${student.description}`)
                    .setThumbnail(`https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/students/standings/${student.id}.png`);
            }
            if (key === 'stats') {
                embed = getStatsEmbed(client, student, student.stars, 1, 1);
            }
            if (key === 'compatibility') {
                const { compatibility } = student;
                const { primaryType, attackType, defenseType, terrains } = compatibility;
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
                embed = new Embed_1.default(client, 'default')
                    .setTitle(`✨ \`${student.name}\`의 상성이에요!`)
                    .addFields({
                    name: '**포지션**',
                    value: `>>> ${(0, GetEmoji_1.default)(`primaryType_${primaryType.toLowerCase()}`)} **${primaryTypeStr}** | ***${compatibility.position}***`,
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
                    value: `>>> ${(0, GetEmoji_1.default)('terrain_street')} 시가지: ${(0, GetEmoji_1.default)(`activity_${terrains.street}`)} | ${(0, GetEmoji_1.default)('terrain_outdoor')} 야외전: ${(0, GetEmoji_1.default)(`activity_${terrains.outdoor}`)} | ${(0, GetEmoji_1.default)('terrain_indoor')} 실내전: ${(0, GetEmoji_1.default)(`activity_${terrains.indoor}`)}`,
                    inline: true
                });
            }
            if (key === 'skills') {
                const { ex: exSkill, primary: primarySkill, reinforce: reinforceSkill, sub: subSkill } = student.skills;
                const exDescription = (0, SkillFormatter_1.default)(exSkill.description, exSkill.variables, 1);
                const primaryDescription = (0, SkillFormatter_1.default)(primarySkill.description, primarySkill.variables, 1);
                const reinforceDescription = (0, SkillFormatter_1.default)(reinforceSkill.description, reinforceSkill.variables, 1);
                const subDescription = (0, SkillFormatter_1.default)(subSkill.description, subSkill.variables, 1);
                embed = new Embed_1.default(client, 'default')
                    .setTitle(`📚 \`${student.name}\`의 스킬이에요!`)
                    .setDescription(`**1레벨 기준으로 표시중입니다!** 변경하려면 **[스킬 레벨 선택]** 버튼을 클릭해주세요.\n\n*[EX]* **${(0, GetEmoji_1.default)(`skill_${student.id}_ex`)} ${exSkill.name}**\n> ***COST*: \`${exSkill.cost[0]}\`**\n${exDescription}\n\n` +
                    `*[기본]* **${(0, GetEmoji_1.default)(`skill_${student.id}_primary`)} ${primarySkill.name}**\n> ${primaryDescription}\n\n` +
                    `*[강화]* **${(0, GetEmoji_1.default)(`skill_${student.id}_reinforce`)} ${reinforceSkill.name}**\n> ${reinforceDescription}\n\n` +
                    `*[서브]* **${(0, GetEmoji_1.default)(`skill_${student.id}_sub`)} ${subSkill.name}**\n> ${subDescription}`);
            }
            if (key === 'weapons') {
                const { name, type, description } = student.uniqueWeapon;
                embed = new Embed_1.default(client, 'default')
                    .setTitle(`🗡 \`${student.name}\`의 무기 및 장비에요!`)
                    .setDescription(`*[${type}]* **${name}**\n\n>>> ${description}`)
                    .setImage(`https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/weapons/weapon_${student.id}.png`);
            }
            await interaction.deferUpdate();
            await interaction.message.edit({
                embeds: embed ? [embed] : undefined,
                components: [
                    ...(key === 'stats'
                        ? [
                            new discord_js_1.ActionRowBuilder({
                                components: [
                                    new discord_js_1.ButtonBuilder({
                                        customId: `${student.id}:student-info-stats-select-level:${student.stars}:1:1`,
                                        label: '별 및 레벨 선택',
                                        emoji: '📈',
                                        style: discord_js_1.ButtonStyle.Primary
                                    }),
                                    new discord_js_1.ButtonBuilder({
                                        customId: `${student.id}:student-info-stats-select-bond-level:${student.stars}:1:1`,
                                        label: '인연 레벨 선택',
                                        emoji: '🤍',
                                        style: discord_js_1.ButtonStyle.Danger
                                    }),
                                    new discord_js_1.ButtonBuilder({
                                        customId: `${student.id}:student-info-stats-select-skills-setting:${student.stars}:1:1`,
                                        label: '스킬 설정',
                                        emoji: '📝',
                                        style: discord_js_1.ButtonStyle.Success
                                    }),
                                    new discord_js_1.ButtonBuilder({
                                        customId: `${student.id}:student-info-stats-select-weapon-setting:${student.stars}:1:1`,
                                        label: '장비 선택',
                                        emoji: '🛡',
                                        style: discord_js_1.ButtonStyle.Secondary
                                    })
                                ]
                            })
                        ]
                        : []),
                    ...(key === 'skills'
                        ? [
                            new discord_js_1.ActionRowBuilder({
                                components: [
                                    new discord_js_1.ButtonBuilder({
                                        customId: `${student.id}:student-info-skills-select-skill-level:${student.stars}:1:1`,
                                        label: '스킬 레벨 선택',
                                        emoji: '📈',
                                        style: discord_js_1.ButtonStyle.Primary
                                    })
                                ]
                            })
                        ]
                        : []),
                    new discord_js_1.ActionRowBuilder({
                        components: [getStatsSelectMenu(student, key)]
                    })
                ]
            });
        }
    }
    if (interaction.isButton()) {
        const [id, customId, _prevStars, _prevLevel, _prevBondLevel] = interaction.customId.split(':');
        const student = students_1.default.find((s) => s.id === id);
        if (!student)
            return;
        if (customId === 'student-info-stats-select-level') {
            const modal = new discord_js_1.ModalBuilder({
                customId: `${id}:student-info-stats-select-level-modal:${_prevStars}:${_prevLevel}:${_prevBondLevel}`,
                title: '학생 별 수 및 레벨 선택',
                components: [
                    new discord_js_1.ActionRowBuilder({
                        components: [
                            new discord_js_1.TextInputBuilder({
                                customId: 'student-info-stats-select-level-modal-stars',
                                label: '학생 별 수 (숫자만 입력하세요)',
                                placeholder: '학생 별 수를 입력하세요! (숫자만 입력하세요)',
                                style: discord_js_1.TextInputStyle.Short,
                                required: true,
                                value: _prevStars,
                                minLength: 1,
                                maxLength: 1
                            })
                        ]
                    }),
                    new discord_js_1.ActionRowBuilder({
                        components: [
                            new discord_js_1.TextInputBuilder({
                                customId: 'student-info-stats-select-level-modal-level',
                                label: '학생 레벨 (최대 75, 숫자만 입력하세요)',
                                placeholder: '학생 레벨을 입력하세요! (숫자만 입력하세요)',
                                style: discord_js_1.TextInputStyle.Short,
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
            const modal = new discord_js_1.ModalBuilder({
                customId: `${id}:student-info-stats-select-bond-level-modal:${_prevStars}:${_prevLevel}:${_prevBondLevel}`,
                title: '학생 인연 레벨 선택',
                components: [
                    new discord_js_1.ActionRowBuilder({
                        components: [
                            new discord_js_1.TextInputBuilder({
                                customId: 'student-info-stats-select-bond-level-modal-bond-level',
                                label: '인연 레벨 (숫자만 입력하세요)',
                                placeholder: '인연 레벨을 입력하세요! (숫자만 입력하세요)',
                                style: discord_js_1.TextInputStyle.Short,
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
        const [id, customId, _prevStars, _prevLevel, _prevBondLevel] = interaction.customId.split(':');
        const student = students_1.default.find((s) => s.id === id);
        if (!student)
            return;
        const pervStars = Number(_prevStars);
        const prevLevel = Number(_prevLevel);
        const prevBondLevel = Number(_prevBondLevel);
        let embed = null;
        let stars = pervStars;
        let level = prevLevel;
        let bondLevel = prevBondLevel;
        if (customId === 'student-info-stats-select-level-modal') {
            stars = Number(interaction.fields.getTextInputValue('student-info-stats-select-level-modal-stars'));
            level = Number(interaction.fields.getTextInputValue('student-info-stats-select-level-modal-level'));
            if (isNaN(stars) || stars < 1 || stars > 5) {
                return interaction.reply({
                    content: '별 수를 잘못 입력하셨어요! 1~5사이의 숫자만 입력해야 해요.',
                    ephemeral: true
                });
            }
            if (isNaN(level) || stars < 1 || stars > 75) {
                return interaction.reply({
                    content: '학생 레벨을 잘못 입력하셨어요! 1~75사이의 숫자만 입력해야 해요.',
                    ephemeral: true
                });
            }
        }
        if (customId === 'student-info-stats-select-bond-level-modal') {
            bondLevel = Number(interaction.fields.getTextInputValue('student-info-stats-select-bond-level-modal-bond-level'));
            if (isNaN(bondLevel) || bondLevel < 1 || bondLevel > 20) {
                return interaction.reply({
                    content: '인연 레벨을 잘못 입력하셨어요! 1~20사이의 숫자만 입력해야 해요.',
                    ephemeral: true
                });
            }
        }
        embed = getStatsEmbed(client, student, stars, level, bondLevel);
        await interaction.deferUpdate();
        await interaction.message?.edit({
            embeds: embed ? [embed] : undefined,
            components: [
                new discord_js_1.ActionRowBuilder({
                    components: [
                        new discord_js_1.ButtonBuilder({
                            customId: `${student.id}:student-info-stats-select-level:${stars}:${level}:${bondLevel}`,
                            label: '별 및 레벨 선택',
                            emoji: '📈',
                            style: discord_js_1.ButtonStyle.Primary
                        }),
                        new discord_js_1.ButtonBuilder({
                            customId: `${student.id}:student-info-stats-select-bond-level:${stars}:${level}:${bondLevel}`,
                            label: '인연 레벨 선택',
                            emoji: '🤍',
                            style: discord_js_1.ButtonStyle.Danger
                        }),
                        new discord_js_1.ButtonBuilder({
                            customId: `${student.id}:student-info-stats-select-skills-setting:${stars}:${level}:${bondLevel}`,
                            label: '스킬 설정',
                            emoji: '📝',
                            style: discord_js_1.ButtonStyle.Success
                        }),
                        new discord_js_1.ButtonBuilder({
                            customId: `${student.id}:student-info-stats-select-weapon-setting:${stars}:${level}:${bondLevel}`,
                            label: '장비 선택',
                            emoji: '🛡',
                            style: discord_js_1.ButtonStyle.Secondary
                        })
                    ]
                }),
                new discord_js_1.ActionRowBuilder({
                    components: [getStatsSelectMenu(student, 'stats')]
                })
            ]
        });
    }
});
