import type {
  Message,
  ClientEvents,
  ChatInputCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody,
  ContextMenuCommandInteraction,
  BaseInteraction
} from 'discord.js';
import BotClient from '../src/structures/BotClient';

export interface MessageCommnad {
  data: MessageCommandOptions;
  execute: MessageCommandFuntion;
}
export interface Command extends MessageCommnad {
  isSlash?: boolean;
  slash?: SlashCommand;
}

export interface SlashCommand {
  data: SlashCommandData;
  execute: BaseInteractionFunction<ChatInputCommandInteraction<'cached'>>;
  options?: SlashCommandOptions;
  slash?: SlashCommand;
}

export interface MessageCommandOptions {
  name: string;
  description?: string;
  aliases: string[];
}

export type MessageCommandFuntion = (
  client: BotClient,
  message: Message,
  args: string[]
) => Promise<any> | Promise<any>;

export interface SlashCommandOptions {
  name: string;
  isSlash?: boolean;
}

export interface Event {
  name: keyof ClientEvents;
  options?: EventOptions;
  execute: (
    client: BotClient,
    ...args: ClientEvents[keyof ClientEvents]
  ) => Promise<any>;
}

export type EventFunction<E extends keyof ClientEvents> = (
  client: BotClient,
  ...args: ClientEvents[E]
) => Promise<any>;

export interface EventOptions {
  once: boolean;
}
export interface ContextMenu {
  data: SlashCommandData;
  execute: BaseInteractionFunction<ContextMenuCommandInteraction<'cached'>>;
}

export type BaseInteractionFunction<T extends BaseInteraction> = (
  client: BotClient,
  interaction: T
) => Promise<any>;
export type BaseCommandType = 'slash' | 'message' | 'context';
export type BaseCommand = MessageCommnad | SlashCommand | Command | ContextMenu;
export type BaseChatCommand = MessageCommnad | SlashCommand | Command;
export type SlashCommandData = RESTPostAPIApplicationCommandsJSONBody;
