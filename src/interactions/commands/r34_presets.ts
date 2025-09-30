import { Command } from ".";

const r34PresetsCommand: Command<{
    action: number;
    name?: string;
}> = {
    data: (c) =>
        c
            .setName("r34_presets")
            .setDescription("Manipulate tag presets for r34 commands")
            .addIntegerOption((option) =>
                // view, add, delete, update
                option
                    .setName("action")
                    .setDescription("The action to do with presets")
                    .setRequired(true)
                    .addChoices([
                        {
                            name: "search",
                            value: 0,
                        },
                        {
                            name: "update",
                            value: 1,
                        },
                        {
                            name: "delete",
                            value: 2,
                        },
                        {
                            name: "append",
                            value: 3,
                        },
                    ])
            )
            .addStringOption((option) =>
                option
                    .setName("name")
                    .setDescription(
                        "The name of the preset to modify, or the prefix for searching"
                    )
            ),

    run: async (interaction, inputMap) => {
        const { action, name = "" } = inputMap;

        type Preset = {
            name: string;
            content: string;
        };

        const searchPresetsWithPrefix = async (prefix: string) => {
            const { results } = (await interaction.sql
                .prepare("SELECT * from r34_presets WHERE name LIKE ? || '%'")
                .bind(prefix)
                .run()) as {
                results: { name: string; content: string }[];
            };

            return results as Preset[];
        };

        if (action === 0) {
            // Searching

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
        }

        return interaction.jsonReply("This command is not yet implemented");
    },
};

export default r34PresetsCommand;
