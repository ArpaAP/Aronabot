import { ApplicationCommandDataResolvable, Routes } from 'discord.js';
import type {
  BaseCommand,
  Command,
  SlashCommand
} from '../../typings/structures';

import Logger from '../utils/Logger';
import BaseManager from './BaseManager';
import fs from 'fs';
import path from 'path';
import BotClient from '../structures/BotClient';
import { REST } from '@discordjs/rest';
import {
  BaseCommand as IBaseCommand,
  ContextMenu,
  MessageCommand
} from '../structures/Command';

export default class CommandManager extends BaseManager {
  private logger = new Logger('CommandManager');
  private commands: BotClient['commands'];

  public constructor(client: BotClient) {
    super(client);

    this.commands = client.commands;
  }

  public load(commandPath: string = path.join(__dirname, '../commands')): void {
    this.logger.debug('Loading commands...');

    const commandFolder = fs.readdirSync(commandPath);

    try {
      commandFolder.forEach((folder) => {
        if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory()) return;

        try {
          const commandFiles = fs.readdirSync(path.join(commandPath, folder));

          commandFiles.forEach((commandFile) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const command =
                require(`../commands/${folder}/${commandFile}`).default;

              if (!command.data.name ?? !command.name)
                return this.logger.debug(
                  `Command ${commandFile} has no name. Skipping.`
                );

              this.commands.set(command.data.name ?? command.name, command);

              this.logger.debug(`Loaded command ${command.data.name}`);
            } catch (error: any) {
              this.logger.error(
                `Error loading command '${commandFile}'.\n` + error.stack
              );
            } finally {
              this.logger.debug(
                `Succesfully loaded commands. count: ${this.commands.size}`
              );
              // eslint-disable-next-line no-unsafe-finally
              return this.commands;
            }
          });
        } catch (error: any) {
          this.logger.error(
            `Error loading command folder '${folder}'.\n` + error.stack
          );
        }
      });
    } catch (error: any) {
      this.logger.error('Error fetching folder list.\n' + error.stack);
    }
  }

  public get(commandName: string): BaseCommand | undefined {
    let command = this.commands.get(commandName);

    command =
      command ??
      this.commands
        .filter(
          (c) =>
            this.isMessageCommand(c) && c.data.aliases?.includes(commandName)
        )
        .first();

    return command;
  }

  public reload(commandPath: string = path.join(__dirname, '../commands')) {
    this.logger.debug('Reloading commands...');

    this.commands.clear();
    try {
      this.load(commandPath);
    } finally {
      this.logger.debug('Succesfully reloaded commands.');
      // eslint-disable-next-line no-unsafe-finally
      return {
        message: '[200] Succesfully reloaded commands.'
      };
    }
  }

  public isContext(command?: BaseCommand): command is ContextMenu {
    return command instanceof ContextMenu;
  }
  public isSlash(command?: BaseCommand): command is SlashCommand {
    //return command?.options.slash ?? false
    return (command as Command)?.slash
      ? true
      : (command as SlashCommand)?.options?.isSlash
      ? true
      : false;
  }
  public isMessageCommand(command?: BaseCommand): command is MessageCommand {
    return command instanceof MessageCommand
      ? true
      : command instanceof IBaseCommand
      ? true
      : false;
  }

  public async slashCommandSetup(
    guildID: string
  ): Promise<ApplicationCommandDataResolvable[] | undefined> {
    this.logger.scope = 'CommandManager: SlashSetup';
    const rest = new REST().setToken(this.client.token!);

    const slashCommands: any[] = [];
    this.client.commands.forEach((command: BaseCommand) => {
      if (this.isSlash(command)) {
        slashCommands.push(command.slash ? command.slash?.data : command.data);
      } else if (this.isContext(command)) {
        slashCommands.push(command.data);
      }
    });

    if (!guildID) {
      this.logger.warn('guildID not gived switching global command...');
      this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`);

      await rest
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        .put(Routes.applicationCommands(this.client.application?.id!), {
          body: slashCommands
        })
        .then(() =>
          this.logger.info(
            `Successfully registered application global commands.`
          )
        );
    } else {
      this.logger.info(`Slash Command requesting ${guildID}`);

      await rest
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        .put(
          Routes.applicationGuildCommands(this.client.application!.id, guildID),
          {
            body: slashCommands
          }
        )
        .then(() =>
          this.logger.info(
            `Successfully registered server ${guildID} server commands.`
          )
        );

      return slashCommands;
    }
  }
}
