"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Logger_1 = __importDefault(require("../utils/Logger"));
const config_1 = __importDefault(require("../../config"));
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const EventManager_1 = __importDefault(require("../managers/EventManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const DatabaseManager_1 = __importDefault(require("../managers/DatabaseManager"));
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
const logger = new Logger_1.default('bot');
class BotClient extends discord_js_1.Client {
    VERSION;
    BUILD_NUMBER;
    config = config_1.default;
    commands = new discord_js_1.Collection();
    events = new discord_js_1.Collection();
    errors = new discord_js_1.Collection();
    db = new mongoose_1.Connection();
    schemas = new discord_js_1.Collection();
    command = new CommandManager_1.default(this);
    event = new EventManager_1.default(this);
    error = new ErrorManager_1.default(this);
    database = new DatabaseManager_1.default(this);
    presenceIndex = 0;
    constructor(options) {
        super(options);
        (0, dotenv_1.config)();
        logger.info('Loading config data...');
        this.VERSION = config_1.default.BUILD_VERSION;
        this.BUILD_NUMBER = config_1.default.BUILD_NUMBER;
    }
    async start(token = config_1.default.bot.token) {
        logger.info('Logging in bot...');
        await this.login(token);
        await this.setStatus();
        setInterval(async () => {
            await this.setStatus();
            this.presenceIndex++;
        }, 12000);
    }
    async setStatus(status = 'online', name = '점검중...') {
        if (status.includes('dev')) {
            logger.warn('Changed status to Developent mode');
            this.user?.setPresence({
                activities: [
                    { name: `${this.config.bot.prefix}도움 | ${this.VERSION} : ${name}` }
                ],
                status: 'dnd'
            });
        }
        else if (status.includes('online')) {
            let presence;
            if (this.presenceIndex % 4 === 0) {
                presence = `${this.config.bot.prefix}도움을 입력해보세요!`;
            }
            if (this.presenceIndex % 4 === 1) {
                presence = `${this.config.bot.prefix}도움 | ${this.VERSION}`;
            }
            if (this.presenceIndex % 4 === 2) {
                presence = `${this.config.bot.prefix}도움 | ${this.guilds.cache.size} 서버`;
            }
            if (this.presenceIndex % 4 === 3) {
                presence = `${this.config.bot.prefix}도움 | ${this.users.cache.size} 사용자`;
            }
            this.user?.setPresence({
                activities: [{ name: presence }],
                status: 'online'
            });
        }
    }
}
exports.default = BotClient;
