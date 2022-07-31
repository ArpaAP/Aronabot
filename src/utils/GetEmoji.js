"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emojis_1 = __importDefault(require("../datas/emojis"));
const getEmoji = (name) => {
    const emojiData = emojis_1.default.find((e) => e.name === name);
    return emojiData ? `<:${emojiData.guildId}:${emojiData.id}>` : null;
};
exports.default = getEmoji;
