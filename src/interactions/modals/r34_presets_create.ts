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
            placeholder:
                "Only alphanumeric characters, underscores and hyphens are allowed",
        },
        content: {
            type: ComponentType.TextInput,
            label: "Preset Content",
            style: TextInputStyle.Paragraph,
        },
    },

    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            const name = inputMap.name.trim();
            const content = inputMap.content.trim();

            const NAME_REGEX = /^[A-Za-z0-9_-]{1,100}$/;
            if (!NAME_REGEX.test(name)) {
                await interaction.followUp("Invalid preset name!");
            }

            const userId = interaction.user?.id;

            if (userId === undefined) {
                await interaction.followUp("User ID not found!");
                return;
            }

            try {
                await interaction.ctx.hono.env.prod_muscord
                    .prepare(
                        "INSERT INTO r34_presets (name, discord_user_id, content) VALUES (?, ?, ?)"
                    )
                    .bind(name, interaction.user?.id, content)
                    .run();
            } catch (err) {
                console.log(err);
                await interaction.followUp(`Error: ${String(err)}`);
            }
        },
    },
});
