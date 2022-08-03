import { type Client, EmbedBuilder, type EmbedData } from 'discord.js';
import { EmbedType } from '../../typings';

export default class Embed extends EmbedBuilder {
  constructor(client: Client, type: EmbedType, showFooter = true) {
    if (!client.isReady()) return;

    if (showFooter) {
      const EmbedJSON: EmbedData = {
        timestamp: new Date().toISOString(),
        footer: {
          iconURL: client.user.avatarURL() ?? undefined,
          text: client.user.username
        }
      };

      super(EmbedJSON);
    } else super();

    if (type === 'success') this.setColor('#57F287');
    else if (type === 'error') this.setColor('#ED4245');
    else if (type === 'warn') this.setColor('#FEE75C');
    else if (type === 'info') this.setColor('#007FFF');
    else if (type === 'default') this.setColor('#007FFF');
  }

  setType(type: EmbedType) {
    if (type === 'success') this.setColor('#57F287');
    else if (type === 'error') this.setColor('#ED4245');
    else if (type === 'warn') this.setColor('#FEE75C');
    else if (type === 'info') this.setColor('#007FFF');
    else if (type === 'default') this.setColor('#007FFF');
  }
}
