"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const builders_1 = require("@discordjs/builders");
const Student_1 = require("../../schemas/Student");
exports.default = new Command_1.BaseCommand({
    name: '학생',
    description: '학생 정보를 불러와요!',
    aliases: ['학생', '스튜던트', '가쿠세이', '学生', 'gakusei', 'student']
}, async (client, message, args) => {
    let query = args.join(' ');
    if (!args.length) {
        return message.reply('학생 이름을 입력해주세요!');
    }
    let student = await Student_1.StudentModel.findOne({
        $text: { $search: query }
    }).populate('belong');
    let organization = student?.belong;
    if (!student) {
        return message.reply('해당하는 학생이 없어요.');
    }
    let embed = new Embed_1.default(client, 'default')
        .setTitle(`\`${student.name}\`의 정보에요!`)
        .setDescription(`
        **이름:** ${student.name}
      `)
        .addFields({
        name: '소속',
        value: organization?.name ?? '(없음)'
    })
        .setThumbnail('../../assets/students/shiroko.png');
    message.reply({ embeds: [embed] });
}, {
    data: new builders_1.SlashCommandBuilder()
        .setName('학생')
        .setDescription('학생 정보를 확인합니다.')
        .addStringOption((option) => option.setName('이름').setDescription('학생의 이름').setRequired(true))
        .toJSON(),
    options: {
        name: 'ping',
        isSlash: true
    },
    async execute(client, interaction) {
        let PingEmbed = new Embed_1.default(client, 'success')
            .setTitle('핑 측정')
            .addFields([
            {
                name: '메세지 응답속도',
                value: `${Number(Date.now()) - Number(interaction.createdAt)}ms`,
                inline: true
            },
            {
                name: 'API 반응속도',
                value: `${client.ws.ping}ms`,
                inline: true
            },
            {
                name: '업타임',
                value: `<t:${(Number(client.readyAt) / 1000) | 0}:R>`,
                inline: true
            }
        ]);
        interaction.reply({ embeds: [PingEmbed] });
    }
});
