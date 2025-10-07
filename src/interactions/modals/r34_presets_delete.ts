import { ComponentType, TextInputStyle } from "disteractions";
import { factory } from "../../utils";

const R34_PRESETS_DELETE_MODAL_ID = 2;
export const r34PresetsDelete = factory.modal({
    id: R34_PRESETS_DELETE_MODAL_ID,
    title: "Delete a preset",
    fields: {
        name: {
            type: ComponentType.TextInput,
            label: "Preset Name",
            style: TextInputStyle.Short,
            placeholder: "The preset to delete",
            required: true,
            maxLength: 100,
        },
        areyousure: {
            type: ComponentType.TextDisplay,
            content:
                "**Warning:** This action is irreversible!\nAre you **sure** to delete this preset? Select `DELETE` to confirm.",
        },
        comfirmation: {
            type: ComponentType.StringSelect,
            label: "Confirmation",
            style: TextInputStyle.Short,
            required: true,
            defaultOptions: [
                {
                    label: "DELETE",
                    value: "DELETE",
                },
                {
                    label: "CANCEL",
                    value: "CANCEL",
                    default: true,
                },
            ],
        },
    },

    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            try {
                const name = inputMap.name.trim();
                const confirmation = inputMap.comfirmation;

                if (confirmation.length === 0 || confirmation[0] !== "DELETE") {
                    throw new Error("You must choose 'DELETE' to confirm.");
                }

                const userId = interaction.user?.id;

                if (userId === undefined) {
                    throw new Error("User ID not found");
                }

                const { results } = await interaction.ctx.hono.env.prod_muscord
                    .prepare(
                        "DELETE FROM r34_presets WHERE name = ? AND discord_user_id = ? RETURNING *"
                    )
                    .bind(name, userId)
                    .run();
                if (results.length === 0) {
                    throw new Error(
                        `Cannot find your preset with the name \`${name}\`.`
                    );
                } else {
                    await interaction.followUp(`Preset \`${name}\` deleted!`);
                }
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
