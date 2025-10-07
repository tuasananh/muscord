import { ApplicationCommandOptionType } from "disteractions";
import { factory } from "../../utils";
import { r34PresetsCreate } from "../modals/r34_presets_create";
import { r34PresetsDelete } from "../modals/r34_presets_delete";
import { r34PresetsUpdate } from "../modals/r34_presets_update";

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
        try {
            const { action, name } = inputMap;
            const actionAsEnum = action as R34PresetAction;

            type Preset = {
                name: string;
                content: string;
                description: string;
            };

            const searchPresetsWithPrefix = async (prefix: string) => {
                const { results } = (await interaction.ctx.hono.env.prod_muscord
                    .prepare(
                        "SELECT * from r34_presets WHERE name LIKE ? || '%'"
                    )
                    .bind(prefix)
                    .run()) as {
                    results: Preset[];
                };

                return results;
            };

            if (actionAsEnum === R34PresetAction.Search) {
                let presets = await searchPresetsWithPrefix(name ?? "");

                if (presets.length > 10) {
                    presets = presets.slice(0, 10);
                }

                let content =
                    name !== undefined && name.length
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
                    },
                });
                return interaction.jsonShowModal(data);
            } else if (actionAsEnum === R34PresetAction.Delete) {
                // Delete preset
                const data = r34PresetsDelete.toAPI({
                    component: {
                        name: name,
                    },
                });

                return interaction.jsonShowModal(data);
            } else if (actionAsEnum === R34PresetAction.Update) {
                let toSendContent = "";
                let toSendDescription = "";

                if (name !== undefined && name.length) {
                    const userId = interaction.user?.id;

                    if (userId === undefined) {
                        throw new Error("User ID not found");
                    }

                    const { results } =
                        (await interaction.ctx.hono.env.prod_muscord
                            .prepare(
                                "SELECT * from r34_presets WHERE name = ? AND discord_user_id = ?"
                            )
                            .bind(name, interaction.user?.id)
                            .run()) as {
                            results: Preset[];
                        };

                    if (results.length === 0) {
                        throw new Error(
                            `Cannot find your preset with the name \`${name}\`.`
                        );
                    }

                    toSendContent = results[0].content;
                    toSendDescription = results[0].description;
                }

                const data = r34PresetsUpdate.toAPI({
                    component: {
                        name: name,
                        description: toSendDescription,
                        content: toSendContent,
                    },
                });

                return interaction.jsonShowModal(data);
            }

            return interaction.jsonReply("This command is not yet implemented");
        } catch (e) {
            if (e instanceof Error) {
                return interaction.jsonReply(`${e.message}`);
            } else {
                console.log("Unknown error", e);
                return interaction.jsonReply(`Error: ${String(e)}`);
            }
        }
    },
});
