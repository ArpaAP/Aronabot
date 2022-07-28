"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const child_process_1 = require("child_process");
const package_json_1 = require("../../../package.json");
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.MessageCommand({
    name: 'update',
    description: '최신 업데이트 내용을 확인합니다.',
    aliases: ['업데이트', 'djqepdlxm', '촏차', 'check']
}, async (client, message, args) => {
    if (!client.config.bot.owners.includes(message.author.id))
        return message.reply(`해당 명령어는 ${client.user?.username}의 주인이 사용할 수 있는 명령어입니다.`);
    let LoadingEmbed = new Embed_1.default(client, 'warn')
        .setTitle('잠시만 기다려주십시요')
        .setDescription('최신 업데이트 내용을 불러오는 중입니다...');
    const msg = await message.reply({ embeds: [LoadingEmbed] });
    if (package_json_1.repository?.includes('Your github url') || !package_json_1.repository) {
        LoadingEmbed.setTitle('이런...')
            .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: package.json에 `repository` 값이 없습니다.')
            .setType('error');
        await msg.edit({ embeds: [LoadingEmbed] });
    }
    let repo = package_json_1.repository.replaceAll('https://github.com/', '');
    const res = await (0, node_fetch_1.default)(`https://api.github.com/repos/${repo}/commits`, {
        headers: {
            Authorization: client.config.githubToken
                ? `token ${client.config.githubToken}`
                : ''
        }
    });
    if (!res.ok && res.status === 400) {
        LoadingEmbed.setTitle('이런...')
            .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: `package.json`에 있는 `repository` 에 있는 주소를 찾을수 없습니다.')
            .setType('error');
        return msg.edit({ embeds: [LoadingEmbed] });
    }
    let json = await res.json();
    if (json[0].sha.trim().substring(0, 7) === client.BUILD_NUMBER) {
        let SuccessEmbed = new Embed_1.default(client, 'success')
            .setTitle('확인 완료!')
            .setDescription('현재 최신 버전을 이용중입니다!')
            .addFields([
            {
                name: '현재 버전',
                value: `v${client.VERSION}`,
                inline: true
            },
            {
                name: '현재 빌드 번호',
                value: `${client.BUILD_NUMBER}`,
                inline: true
            }
        ]);
        return msg.edit({ embeds: [SuccessEmbed] });
    }
    for (let count = 0; count < json.length; count++) {
        const commit = json[count];
        if (commit.sha.trim().substring(0, 7) === client.BUILD_NUMBER) {
            let NewUpdateEmbed = new Embed_1.default(client, 'success')
                .setTitle('최신 업데이트가 있습니다!')
                .setDescription(`최신 업데이트된 ${count}개의 내용이 있습니다. 지금 업데이트 하시겠습니까?`)
                .addFields([
                {
                    name: '현재 버전',
                    value: `v${client.VERSION}`,
                    inline: true
                },
                {
                    name: '현재 빌드 번호',
                    value: `${client.BUILD_NUMBER}`,
                    inline: true
                },
                {
                    name: '최신 빌드 번호',
                    value: `${json[0].sha.trim().substring(0, 6)}`,
                    inline: true
                }
            ]);
            let buttonData = new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Success)
                .setLabel('업데이트 하기')
                .setEmoji('✅')
                .setCustomId('update.run');
            let components = new discord_js_1.ActionRowBuilder().addComponents([buttonData]);
            let collector = msg.channel.createMessageComponentCollector({
                time: 10 * 1000
            });
            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'update.run') {
                    collector.stop();
                    try {
                        (0, child_process_1.execSync)(`git pull https://username:${client.config.githubToken}@github.com/${repo}`);
                    }
                    catch (e) {
                        (0, child_process_1.execSync)('git fetch --all');
                        (0, child_process_1.execSync)('git reset --hard HEAD');
                        (0, child_process_1.execSync)('git merge @{u}');
                    }
                    await interaction.reply('업데이트가 완료되었습니다!');
                }
                else if (interaction.user.id !== message.author.id) {
                    interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 업데이트할 수 있습니다.`);
                }
            });
            msg.edit({
                embeds: [NewUpdateEmbed],
                components: [components]
            });
            break;
        }
        else if (count > 0) {
            let BranchErrorEmbed = new Embed_1.default(client, 'error')
                .setTitle('뭔가 잘못된거 같아요...')
                .setDescription('업데이트를 정보를 찾을수 없습니다. 브랜치가 다른걸수도 있습니다.\n기본 브랜치를 바꿔보는건 어떨까요?');
            msg.edit({ embeds: [BranchErrorEmbed], components: [] });
        }
    }
});
