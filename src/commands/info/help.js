"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
exports.default = new Command_1.BaseCommand({
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
}, async (client, message, args) => {
    const embed = new Embed_1.default(client, 'default')
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
}, {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('도움말')
        .setDescription('도움말을 보여줍니다.')
        .addBooleanOption((options) => options
        .setDescription('true 로 바꿀시 명령어 리스트를 디엠으로 보냅니다.')
        .setName('디엠'))
        .toJSON(),
    async execute(client, interaction) {
        const embed = new Embed_1.default(client, 'default')
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
        const dmEmbed = new Embed_1.default(client, 'success').setTitle('도움말을 전송했습니다!');
        if (interaction.options.getBoolean('디엠')) {
            try {
                interaction.user.send({
                    embeds: [embed]
                });
                return await interaction.reply({
                    embeds: [dmEmbed]
                });
            }
            catch (error) {
                dmEmbed
                    .setTitle('명령어 리스트를 정상적으로 DM으로 전달하지 못했어요!')
                    .setDescription('DM 전송을 활성화해주세요!')
                    .setType('error');
                return await interaction.reply({
                    embeds: [dmEmbed],
                    ephemeral: true
                });
            }
        }
        return await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
});
