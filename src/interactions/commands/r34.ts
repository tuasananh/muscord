import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, ButtonStyle } from "disteractions";
import { factory } from "../../utils";
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
        },
        limit: {
            type: ApplicationCommandOptionType.Integer,
            description: "The maximum number of posts to fetch, defaults to 15",
            required: false,
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
            let { tags, limit } = inputMap;

            tags = tags ?? "";
            limit = limit ?? 15;

            const inputTagsList = Array.from(new Set(tags.split(/\s+/)));

            const tagsList = new Set();

            // // eslint-disable-next-line @typescript-eslint/no-explicit-any
            // const filters: any =
            // 	(await c.env.KV_STORE.get("filters", "json")) || {};

            // for (const appliedFilter of filter.split(whiteSpaceRegex)) {
            // 	const toAppend = filters[appliedFilter];
            // 	if (toAppend) {
            // 		for (const item of toAppend.split(whiteSpaceRegex)) {
            // 			tagsList.push(item);
            // 		}
            // 	}
            // }

            for (const item of inputTagsList) {
                tagsList.add(item);
            }

            const queryTags = Array.from(tagsList).join(" ");

            const inputTagsText = inputTagsList.join(" ").length
                ? inputTagsList.join(" ")
                : "None";

            await interaction.followUp(
                `input tags: \`${inputTagsText}\`\nraw tags:\`${
                    queryTags.length ? queryTags : "None"
                }\`\ntimes: \`${limit}\``
            );

            try {
                const data = await interaction.ctx
                    .get("apis")
                    .rule34.fetchPosts(queryTags, limit);
                console.log(data.length);
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

                        console.log(i, data[i]["id"]);
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
                    await new Promise((f) => setTimeout(f, 500));
                }
            } catch (err) {
                if (
                    err instanceof SyntaxError &&
                    err.message == "Unexpected end of JSON input"
                ) {
                    await interaction.followUp("No posts found!");
                } else {
                    await interaction.followUp(`${err}`);
                }
            }
        },
    },
});
