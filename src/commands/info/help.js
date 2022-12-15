"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const getHelpEmbed = (client) => {
    return new Embed_1.default(client, 'default')
        .setTitle('📃 아로나의 명령어에요, 선생님!')
        .setDescription('* 빗금 (/) 명령어도 지원한답니다.')
        .addFields({
        name: '**🔹 학생 관련**',
        value: `> \`?학생 (이름)\`: 학생의 프로필, 소개, 스탯, 상성, 스킬, 무기 및 장비 등 정보를 보여줘요!\n`
    })
        .addFields({
        name: '**🔹 시뮬레이션**',
        value: `> \`?모의모집\`: 인게임에서와 완전히 동일한 확률에서 모의로 학생을 모집해볼 수 있어요!\n` +
            `> \`?상점\`: 상점의 전체 아이템과, 구매에 필요한 재화를 확인할 수 있어요!\n`
    })
        .addFields({
        name: '**🔹 재화 계산**',
        value: `> \`?재화 레벨\`: 선생님의 레벨업에 필요한 재화를 계산해요!\n` +
            `> \`?재화 학생레벨\`: 학생 레벨업에 필요한 재화를 계산해요!\n` +
            `> \`?재화 스킬\`: 스킬 레벨업에 필요한 재화를 계산해요!\n` +
            `> \`?재화 장비\`: 장비 레벨업에 필요한 재화를 계산해요!\n`
    })
        .addFields({
        name: '**🔹 일정 및 알림**',
        value: `> \`?캘린더\`: 학생의 생일을 정리해서 보여드려요!\n` +
            `> \`?픽업\`: 픽업 일정을 보여드려요!\n` +
            `> \`?이벤트\`: 이벤트 일정을 보여드려요!\n` +
            `> \`?알림 생일\`: 학생의 생일이 가까워지면 알림을 보내는 기능을 설정해요!\n` +
            `> \`?알림 유튜브\`: 블루 아카이브 공식 유튜브의 새 영상을 알려요!\n` +
            `> \`?알림 트위터\`: 블루 아카이브 공식 트위터의 새 게시글을 알려요!\n`
    })
        .addFields({
        name: '**🔹 재미**',
        value: `> \`?몰루\`: 몰?루 움짤을 보내요!\n`
    })
        .addFields({
        name: '**🔹 일반**',
        value: `> \`?핑\`: 봇의 지연시간과 상태를 보여줘요!\n` +
            `> \`?서포트서버\`: 공지와 개발소식을 확인하고, 문의 및 건의 처리를 도와드리는 서버 링크를 표시해요!\n`
    });
};
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
    message.reply({
        embeds: [getHelpEmbed(client)]
    });
}, {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('도움말')
        .setDescription('도움말을 보여줍니다.')
        .toJSON(),
    async execute(client, interaction) {
        interaction.reply({
            embeds: [getHelpEmbed(client)],
            ephemeral: true
        });
    }
});
