import {
    ApplicationCommandOptionType,
    InteractionResponseType,
} from "disteractions";
import { factory } from "../../utils";
import { r34PresetsCreate } from "../modals/r34_presets_create";

enum R34PresetAction {
    Create = 0,
    Search = 1,
    Update = 2,
    Delete = 3,
}

export const r34Presets = factory.slashCommand({
    name: "r34_presets",
    description: "Manipulate tag presets for r34 commands",
    arguments: {
        action: {
            type: ApplicationCommandOptionType.Integer,
            description: "The action to do with presets",
            required: true,
            choices: [
                { name: "create", value: R34PresetAction.Create },
                { name: "search", value: R34PresetAction.Search },
                { name: "update", value: R34PresetAction.Update },
                { name: "delete", value: R34PresetAction.Delete },
            ],
        },
        name: {
            type: ApplicationCommandOptionType.String,
            description:
                "The name of the preset to modify, or the prefix for searching",
            required: false,
        },
    },
    runner: async (interaction, inputMap) => {
        const { action, name = "" } = inputMap;
        const actionAsEnum = action as R34PresetAction;

        type Preset = {
            name: string;
            content: string;
        };

        const searchPresetsWithPrefix = async (prefix: string) => {
            const { results } = (await interaction.ctx.hono.env.prod_muscord
                .prepare("SELECT * from r34_presets WHERE name LIKE ? || '%'")
                .bind(prefix)
                .run()) as {
                results: { name: string; content: string }[];
            };

            return results as Preset[];
        };

        if (actionAsEnum === R34PresetAction.Search) {
            let presets = await searchPresetsWithPrefix(name);

            if (presets.length > 10) {
                presets = presets.slice(0, 10);
            }

            let content = name.length
                ? `Presets matching \`${name}\`:\n`
                : `All presets:\n`;

            if (presets.length == 0) {
                content += "No presets found.";
            } else {
                content += presets
                    .map(
                        (preset: { name: string; content: string }) =>
                            `- \`${preset.name}\`: \`${preset.content}\``
                    )
                    .join("\n");
            }

            return interaction.jsonReply(content);
        } else if (actionAsEnum == R34PresetAction.Create) {
            const data = r34PresetsCreate.toAPI({
                component: {
                    name: name,
                    content: "",
                },
            });
            return interaction.ctx.hono.json({
                type: InteractionResponseType.Modal,
                data,
            });
            // return interaction.jsonShowModal(data);
        }

        return interaction.jsonReply("This command is not yet implemented");
    },
});
