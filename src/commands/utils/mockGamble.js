"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const builders_1 = require("@discordjs/builders");
exports.default = new Command_1.BaseCommand({
    name: 'gamble',
    description: '학생 모의 모집을 실행합니다.',
    aliases: [
        '모집',
        '모의모집',
        '모의가챠',
        '모의뽑기',
        '가챠',
        '뽑기',
        'gotcha',
        'gamble'
    ]
}, async (client, message, args) => { }, {
    data: new builders_1.SlashCommandBuilder()
        .setName('모의모집')
        .setDescription('학생 모의 모집을 실행합니다.')
        .toJSON(),
    options: {
        name: 'gamble',
        isSlash: true
    },
    async execute(client, interaction) { }
});
