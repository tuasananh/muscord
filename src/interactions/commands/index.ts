import MyContext from "@/types/my_context";
import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
} from "@discordjs/builders";
import {
    APIChatInputApplicationCommandInteraction,
    APIInteractionResponse,
} from "@discordjs/core/http-only";
export { commands } from "./_generated_commands";

type Runner<Args extends Record<string, unknown>, Output> = (
    c: MyContext,
    interaction: APIChatInputApplicationCommandInteraction,
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
    run: Runner<Args, APIInteractionResponse>;
    shouldDefer?: false;
};

export type Command<Args extends Record<string, unknown> = Record<string, unknown>> =
    | DeferedCommand<Args>
    | ImmediateCommand<Args>;
