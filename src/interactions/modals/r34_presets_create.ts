import { ComponentType, TextInputStyle } from "disteractions";
import { factory } from "../../utils";

const R34_PRESETS_CREATE_MODAL_ID = 1;
export const r34PresetsCreate = factory.modal({
    id: R34_PRESETS_CREATE_MODAL_ID,
    title: "Create a new preset",
    fields: {
        name: {
            type: ComponentType.TextInput,
            label: "Preset Name",
            style: TextInputStyle.Short,
            placeholder: "Alphanumeric with underscores and hyphens",
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
                "Multiple tags with search syntax from rule34 seperated by spaces, e.g. 'cute solo score:>=50'",
            required: true,
            maxLength: 4000,
        },
    },

    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            try {
                const name = inputMap.name.trim();
                const content = inputMap.content.trim();
                const description = inputMap.description.trim();

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

                await interaction.ctx.hono.env.prod_muscord
                    .prepare(
                        "INSERT INTO r34_presets (name, description, content, discord_user_id) VALUES (?, ?, ?, ?)"
                    )
                    .bind(name, description, content, userId)
                    .run();
                await interaction.followUp(`Preset \`${name}\` created!`);
            } catch (err) {
                if (err instanceof Error) {
                    if (
                        err.message.includes("UNIQUE constraint failed") &&
                        err.message.includes("r34_presets.name")
                    ) {
                        await interaction.followUp(
                            `A preset with that name already exists! Please choose a different name.`
                        );
                    } else {
                        await interaction.followUp(`${err.message}`);
                    }
                } else {
                    console.log("Unknown error", err);
                    await interaction.followUp(`Error: ${String(err)}`);
                }
            }
        },
    },
});
