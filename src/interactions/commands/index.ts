import ChatInputApplicationCommandInteraction from "@/structures/chat_input_command_interaction";
import { APIInteractionJsonResponse } from "@/types";
import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
} from "@discordjs/builders";
export { commands } from "./_generated_commands";

type Runner<Args extends Record<string, unknown>, Output> = (
    interaction: ChatInputApplicationCommandInteraction,
    args: Args
) => Promise<Output>;

type BaseCommand = {
    data: (c: SlashCommandBuilder) => SlashCommandOptionsOnlyBuilder;
    ownerOnly?: boolean;
};

type DeferedCommand<Args extends Record<string, unknown>> = BaseCommand & {
    run: Runner<Args, void>;
    shouldDefer: true;
};

type ImmediateCommand<Args extends Record<string, unknown>> = BaseCommand & {
    run: Runner<Args, APIInteractionJsonResponse>;
    shouldDefer?: false;
};

export type Command<
    Args extends Record<string, unknown> = Record<string, unknown>
> = DeferedCommand<Args> | ImmediateCommand<Args>;
