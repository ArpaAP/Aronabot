"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const builders_1 = require("@discordjs/builders");
exports.default = new Command_1.BaseCommand({
    name: 'molu',
    description: '핑을 측정합니다.',
    aliases: ['몰루', '몰?루', '루몰', '몰!루']
}, async (client, message, args) => {
    message.reply('https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/molu.gif');
}, {
    data: new builders_1.SlashCommandBuilder()
        .setName('몰루')
        .setDescription('몰?루겠어요..')
        .toJSON(),
    options: {
        name: 'molu',
        isSlash: true
    },
    async execute(client, interaction) {
        interaction.reply('https://cdn.jsdelivr.net/gh/ArpaAP/Aronabot/assets/molu.gif');
    }
});
