"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed extends discord_js_1.EmbedBuilder {
    constructor(client, type, showFooter = true) {
        if (!client.isReady())
            return;
        if (showFooter) {
            const EmbedJSON = {
                timestamp: new Date().toISOString(),
                footer: {
                    iconURL: client.user.avatarURL() ?? undefined,
                    text: client.user.username
                }
            };
            super(EmbedJSON);
        }
        else
            super();
        if (type === 'success')
            this.setColor('#57F287');
        else if (type === 'error')
            this.setColor('#ED4245');
        else if (type === 'warn')
            this.setColor('#FEE75C');
        else if (type === 'info')
            this.setColor('#007FFF');
        else if (type === 'default')
            this.setColor('#007FFF');
    }
    setType(type) {
        if (type === 'success')
            this.setColor('#57F287');
        else if (type === 'error')
            this.setColor('#ED4245');
        else if (type === 'warn')
            this.setColor('#FEE75C');
        else if (type === 'info')
            this.setColor('#007FFF');
        else if (type === 'default')
            this.setColor('#007FFF');
    }
}
exports.default = Embed;
