import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, ButtonStyle } from "disteractions";
import { commaSeparatedQuestionMarks, factory } from "../../utils";
import { r34ShowOne } from "../buttons/r34_show_one";

export const r34 = factory.slashCommand({
    name: "r34",
    description: "Uh oh!",
    nsfw: true,
    arguments: {
        tags: {
            type: ApplicationCommandOptionType.String,
            description: "The tags to filter posts, seperated by a space",
            required: false,
            autocomplete: true,
            autocompleteCallback: async (interaction, value) => {
                // Last word of the current value
                const words = value.split(/\s+/);
                const last_word = words.at(-1) ?? "";
                if (words.length) words.pop();
                const prefix = words.join(" ");
                const tags = await interaction.ctx
                    .get("apis")
                    .rule34.fetchAutocompleteTags(last_word);
                return tags.map((tag) => ({
                    name: prefix + (prefix.length ? " " : "") + tag.value,
                    value: prefix + (prefix.length ? " " : "") + tag.value,
                }));
            },
        },
        limit: {
            type: ApplicationCommandOptionType.Integer,
            description: "The maximum number of posts to fetch, defaults to 15",
            required: false,
            choices: Array.from({ length: 6 }, (e, i) => (i + 1) * 5).map(
                (v) => {
                    return {
                        name: v.toString(),
                        value: v,
                    };
                }
            ),
        },
        presets: {
            type: ApplicationCommandOptionType.String,
            description:
                "List of tag presets to apply to the tag list, seperated by a space",
            required: false,
        },
    },
    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            const { tags = "", limit = 15 } = inputMap;

            const inputTags = tags.trim();

            const presets = (inputMap.presets ?? "").split(/\s+/);

            const selectString = `SELECT content FROM r34_presets WHERE name IN (${commaSeparatedQuestionMarks(
                presets.length
            )})`;

            const { results } = (await interaction.ctx.env.prod_muscord
                .prepare(selectString)
                .bind(...presets)
                .run()) as {
                results: { content: string }[];
            };

            const queryTags = (
                inputTags +
                " " +
                results.map((r) => r.content).join(" ")
            ).trim();

            await interaction.followUp({
                content: `input tags: \`${
                    inputTags.length ? inputTags : "None"
                }\`\nraw tags:\`${
                    queryTags.length ? queryTags : "None"
                }\`\ntimes: \`${limit}\``,
            });

            try {
                const data = await interaction.ctx
                    .get("apis")
                    .rule34.fetchPosts(queryTags, limit);
                const NUMBER_OF_POSTS_PER_MESSAGE = 5;
                for (let i = 0; i < data.length; ) {
                    let cnt = NUMBER_OF_POSTS_PER_MESSAGE;
                    let content = "";
                    let order = 1;
                    const row = new ActionRowBuilder<ButtonBuilder>();
                    const sendOne = new ActionRowBuilder<ButtonBuilder>();
                    while (cnt > 0 && i < data.length) {
                        const original = `https://rule34.xxx/index.php?page=post&s=view&id=${data[i]["id"]}`;
                        content += `[flink${order}](`;
                        content += data[i]["file_url"];
                        content += ")";
                        row.addComponents(
                            new ButtonBuilder()
                                .setURL(original)
                                .setLabel(`${order}`)
                                .setStyle(ButtonStyle.Link)
                        );

                        sendOne.addComponents(
                            new ButtonBuilder(
                                r34ShowOne.toAPI({
                                    label: `${order}`,
                                    data: data[i]["id"].toString(),
                                })
                            )
                        );

                        // we need to specify the function that it runs as well
                        // customId = it's like the roots
                        // we need to specify handlers for
                        cnt--;
                        if (cnt) content += "        ";
                        i++;
                        order++;
                    }

                    await interaction.followUp({
                        content,
                        components: [row.toJSON(), sendOne.toJSON()],
                    });
                }
            } catch (err) {
                if (
                    err instanceof SyntaxError &&
                    err.message == "Unexpected end of JSON input"
                ) {
                    await interaction.followUp("No posts found!");
                } else {
                    await interaction.followUp(`${String(err)}`);
                }
            }
        },
    },
});
