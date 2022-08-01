import { IConfig } from './typings';
import fs from 'fs';

let BUILD_NUMBER: string | null = fs
  .readFileSync(process.env.PWD + '/.git/HEAD')
  .toString()
  .trim();

if (BUILD_NUMBER?.indexOf(':') === -1) {
  BUILD_NUMBER;
} else {
  try {
    BUILD_NUMBER = fs
      .readFileSync(process.env.PWD + '/.git/' + BUILD_NUMBER?.substring(5))
      .toString()
      .trim()
      .substring(0, 7);
  } catch (e) {
    BUILD_NUMBER = null;
  }
}

const config: IConfig = {
  BUILD_NUMBER,
  BUILD_VERSION: '1.0.0',
  githubToken: '',
  supportURL: '',
  IOChannels: { production: [''], development: [''] },
  koreanbotsToken: '',
  bot: {
    sharding: false,
    options: {
      intents: [130815],
      allowedMentions: { parse: ['users', 'roles'], repliedUser: false }
    },
    token: '',
    owners: [],
    prefix: '??',
    cooldown: 2000
  },
  report: {
    /**
     * @type {'webhook', 'text'}
     */
    type: 'webhook',
    webhook: {
      url: ''
    },
    text: {
      guildID: '',
      channelID: ''
    }
  },
  database: {
    /**
     * @type {'mongodb'|'sqlite'|'quick.db'}
     */
    type: 'mongodb',
    url: 'mongodb://localhost:27017/',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  logger: {
    level: 'chat',
    dev: false
  }
};

export default config;
