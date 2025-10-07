import { ComponentType, TextInputStyle } from "disteractions";
import { factory } from "../../utils";

const R34_PRESETS_UPDATE_MODAL_ID = 3;
export const r34PresetsUpdate = factory.modal({
    id: R34_PRESETS_UPDATE_MODAL_ID,
    title: "Create a new preset",
    fields: {
        tips: {
            type: ComponentType.TextDisplay,
            content:
                "**TIPS:** You can prefill the content by using the `/r34_presets` command with the `name` option filled.",
        },
        name: {
            type: ComponentType.TextInput,
            label: "Preset Name",
            style: TextInputStyle.Short,
            placeholder: "The name of the preset to update",
            required: true,
            maxLength: 100,
        },
        description: {
            type: ComponentType.TextInput,
            label: "Preset Description",
            style: TextInputStyle.Paragraph,
            placeholder: "A brief description of the preset",
            maxLength: 1000,
        },
        content: {
            type: ComponentType.TextInput,
            label: "Preset Content",
            style: TextInputStyle.Paragraph,
            placeholder:
                "The content of the preset, including multiple tags with syntax from rule34",
            required: true,
            maxLength: 1000,
        },
    },

    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            try {
                const name = inputMap.name.trim();
                const content = inputMap.content.trim();

                const NAME_REGEX = /^[A-Za-z0-9_-]{1,100}$/;
                if (!NAME_REGEX.test(name)) {
                    throw new Error(
                        "Invalid preset name, must be alphanumeric with underscores and hyphens, max 100 characters"
                    );
                }

                const userId = interaction.user?.id;

                if (userId === undefined) {
                    throw new Error("User ID not found");
                }

                const { results } = await interaction.ctx.hono.env.prod_muscord
                    .prepare(
                        "UPDATE r34_presets SET content = ? WHERE name = ? AND discord_user_id = ? RETURNING *"
                    )
                    .bind(content, name, userId)
                    .run();

                if (results.length == 0) {
                    throw new Error(
                        `Cannot find your preset with the name \`${name}\`.`
                    );
                }
                await interaction.followUp(`Preset \`${name}\` updated!`);
            } catch (err) {
                if (err instanceof Error) {
                    await interaction.followUp(`${err.message}`);
                } else {
                    console.log("Unknown error", err);
                    await interaction.followUp(`Error: ${String(err)}`);
                }
            }
        },
    },
});
