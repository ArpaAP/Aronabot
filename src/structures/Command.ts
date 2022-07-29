import {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction
} from 'discord.js';
import {
  MessageCommandFuntion,
  MessageCommandOptions,
  SlashCommandData,
  BaseInteractionFunction,
  SlashCommandOptions,
  ContextMenu as IContextMenu
} from '../../typings/structures';

export class SlashCommand {
  constructor(
    public data: SlashCommandData,
    public execute: BaseInteractionFunction<
      ChatInputCommandInteraction<'cached'>
    >,
    public options?: SlashCommandOptions
  ) {}
}

export class MessageCommand {
  constructor(
    public data: MessageCommandOptions,
    public execute: MessageCommandFuntion
  ) {}
}

export class BaseCommand extends MessageCommand {
  constructor(
    public data: MessageCommandOptions,
    public execute: MessageCommandFuntion,
    public slash?: SlashCommand | undefined
  ) {
    super(data, execute);
  }
}

export class ContextMenu implements IContextMenu {
  constructor(
    public data: SlashCommandData,
    public execute: BaseInteractionFunction<
      ContextMenuCommandInteraction<'cached'>
    >
  ) {}
}
