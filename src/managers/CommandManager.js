"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rest_1 = require("@discordjs/rest");
const Command_1 = require("../structures/Command");
class CommandManager extends BaseManager_1.default {
    logger = new Logger_1.default('CommandManager');
    commands;
    constructor(client) {
        super(client);
        this.commands = client.commands;
    }
    load(commandPath = path_1.default.join(__dirname, '../commands')) {
        this.logger.debug('Loading commands...');
        const commandFolder = fs_1.default.readdirSync(commandPath);
        try {
            commandFolder.forEach((folder) => {
                if (!fs_1.default.lstatSync(path_1.default.join(commandPath, folder)).isDirectory())
                    return;
                try {
                    const commandFiles = fs_1.default.readdirSync(path_1.default.join(commandPath, folder));
                    commandFiles.forEach((commandFile) => {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            const command = require(`../commands/${folder}/${commandFile}`).default;
                            if (!command.data.name ?? !command.name)
                                return this.logger.debug(`Command ${commandFile} has no name. Skipping.`);
                            this.commands.set(command.data.name ?? command.name, command);
                            this.logger.debug(`Loaded command ${command.data.name}`);
                        }
                        catch (error) {
                            this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack);
                        }
                        finally {
                            this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`);
                            // eslint-disable-next-line no-unsafe-finally
                            return this.commands;
                        }
                    });
                }
                catch (error) {
                    this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack);
                }
            });
        }
        catch (error) {
            this.logger.error('Error fetching folder list.\n' + error.stack);
        }
    }
    get(commandName) {
        let command = this.commands.get(commandName);
        command =
            command ??
                this.commands
                    .filter((c) => this.isMessageCommand(c) && c.data.aliases?.includes(commandName))
                    .first();
        return command;
    }
    reload(commandPath = path_1.default.join(__dirname, '../commands')) {
        this.logger.debug('Reloading commands...');
        this.commands.clear();
        try {
            this.load(commandPath);
        }
        finally {
            this.logger.debug('Succesfully reloaded commands.');
            // eslint-disable-next-line no-unsafe-finally
            return {
                message: '[200] Succesfully reloaded commands.'
            };
        }
    }
    isContext(command) {
        return command instanceof Command_1.ContextMenu;
    }
    isSlash(command) {
        //return command?.options.slash ?? false
        return command?.slash
            ? true
            : command?.options?.isSlash
                ? true
                : false;
    }
    isMessageCommand(command) {
        return command instanceof Command_1.MessageCommand
            ? true
            : command instanceof Command_1.BaseCommand
                ? true
                : false;
    }
    async slashCommandSetup(guildID) {
        this.logger.scope = 'CommandManager: SlashSetup';
        const rest = new rest_1.REST().setToken(this.client.token);
        const slashCommands = [];
        this.client.commands.forEach((command) => {
            if (this.isSlash(command)) {
                slashCommands.push(command.slash ? command.slash?.data : command.data);
            }
            else if (this.isContext(command)) {
                slashCommands.push(command.data);
            }
        });
        if (!guildID) {
            this.logger.warn('guildID not gived switching global command...');
            this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`);
            await rest
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                .put(discord_js_1.Routes.applicationCommands(this.client.application?.id), {
                body: slashCommands
            })
                .then(() => this.logger.info(`Successfully registered application global commands.`));
        }
        else {
            this.logger.info(`Slash Command requesting ${guildID}`);
            await rest
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                .put(discord_js_1.Routes.applicationGuildCommands(this.client.application.id, guildID), {
                body: slashCommands
            })
                .then(() => this.logger.info(`Successfully registered server ${guildID} server commands.`));
            return slashCommands;
        }
    }
}
exports.default = CommandManager;
