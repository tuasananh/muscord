import MyContext from "@/types/my_context";
import { SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { APIChatInputApplicationCommandInteraction } from "@discordjs/core/http-only";
import { commands } from "./_generated_commands";
export { commands } from "./_generated_commands";

export interface Command {
	data: SlashCommandOptionsOnlyBuilder;
	run: (
		c: MyContext,
		interaction: APIChatInputApplicationCommandInteraction,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		inputMap: Map<string, any>
	) => Promise<void | Response>;
	owner_only?: boolean;
	defer_first?: boolean;
}

export const commandMap = new Map<string, Command>();

for (const command of commands) {
	commandMap.set(command.data.name, command);
}
