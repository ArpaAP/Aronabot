import { Client, ClientOptions, ClientEvents, Collection } from 'discord.js';
import Logger from '../utils/Logger';

import { BaseCommand, Event } from '../../typings/structures';
import config from '../../config';
import CommandManager from '../managers/CommandManager';
import EventManager from '../managers/EventManager';
import ErrorManager from '../managers/ErrorManager';
import DatabaseManager from '../managers/DatabaseManager';
import { Connection, Model } from 'mongoose';
import { config as dotenvConfig } from 'dotenv';
import { Koreanbots } from 'koreanbots';

const logger = new Logger('bot');

export default class BotClient extends Client {
  public readonly VERSION: string;
  public readonly BUILD_NUMBER: string | null;
  public readonly config = config;

  public commands: Collection<string, BaseCommand> = new Collection();
  public events: Collection<keyof ClientEvents, Event> = new Collection();
  public errors: Collection<string, string> = new Collection();
  public db: Connection = new Connection();
  public schemas: Collection<string, Model<any>> = new Collection();
  public command: CommandManager = new CommandManager(this);
  public event: EventManager = new EventManager(this);
  public error: ErrorManager = new ErrorManager(this);
  public database: DatabaseManager = new DatabaseManager(this);

  private presenceIndex = 0;

  public constructor(options: ClientOptions) {
    super(options);
    dotenvConfig();

    logger.info('Loading config data...');

    this.VERSION = config.BUILD_VERSION;
    this.BUILD_NUMBER = config.BUILD_NUMBER;
  }

  public async start(token: string = config.bot.token): Promise<void> {
    logger.info('Logging in bot...');
    await this.login(token);

    this.setStatus();

    setInterval(async () => {
      this.setStatus();
      this.presenceIndex++;
    }, 12000);

    if (process.env.NODE_ENV === 'production') {
      await this.updateKoreanbotsServers();
      setInterval(this.updateKoreanbotsServers, 60000);
    }
  }

  public async setStatus(
    status: 'dev' | 'online' = 'online',
    name = '?????????...'
  ) {
    if (status.includes('dev')) {
      logger.warn('Changed status to Developent mode');
      await this.user?.setPresence({
        activities: [
          { name: `${this.config.bot.prefix}?????? | ${this.VERSION} : ${name}` }
        ],
        status: 'dnd'
      });
    } else if (status.includes('online')) {
      let presence;

      if (this.presenceIndex % 3 === 0) {
        presence = `${this.config.bot.prefix}????????? ??????????????????!`;
      }
      if (this.presenceIndex % 3 === 1) {
        presence = `${this.config.bot.prefix}?????? | ${this.VERSION}`;
      }
      if (this.presenceIndex % 3 === 2) {
        presence = `${this.config.bot.prefix}?????? | ${this.guilds.cache.size} ??????`;
      }

      await this.user?.setPresence({
        activities: [{ name: presence }],
        status: 'online'
      });
    }
  }

  public async updateKoreanbotsServers() {
    if (!config.koreanbotsToken) return;

    const koreanbots = new Koreanbots({
      api: {
        token: config.koreanbotsToken
      },
      clientID: this.user!.id
    });

    await koreanbots.mybot
      .update({
        servers: this.guilds.cache.size,
        shards: this.shard?.count
      })
      .then(() =>
        logger.info(`Koreanbots servers updated: ${this.guilds.cache.size}`)
      )
      .catch(logger.error);
  }
}
