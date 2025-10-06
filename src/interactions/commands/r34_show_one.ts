import { ApplicationCommandOptionType } from "disteractions";
import { factory } from "../../utils";

export const r34ShowOne = factory.slashCommand({
    name: "r34_show_one",
    description: "Uh oh!",
    nsfw: true,
    arguments: {
        id: {
            type: ApplicationCommandOptionType.String,
            description: "The id of the post, random post if not set",
            required: false,
        },
        tags: {
            type: ApplicationCommandOptionType.String,
            description: "The tags to filter posts, seperated by a space",
            required: false,
        },
        presets: {
            type: ApplicationCommandOptionType.String,
            description:
                "List of predefined filters to apply to the tag list, seperated by a space",
            required: false,
        },
    },
    runner: async (interaction, inputMap) => {
        const id = inputMap.id;
        const tags = inputMap.tags;

        try {
            let post;

            if (id !== undefined) {
                post = await interaction.ctx.hono
                    .get("apis")
                    .rule34.fetchPostById(id);
            } else if (tags !== undefined) {
                const whiteSpaceRegex = /\s+/;

                const inputTagsList = Array.from(
                    new Set(tags.split(whiteSpaceRegex))
                );

                const tagsList = new Set<string>();
                tagsList.add("sort:random");

                // const filter: string = inputMap.get("filter") || "basic";

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

                const uniqueTagsList = Array.from(tagsList);

                const queryTags = uniqueTagsList.join(" ");

                const posts = await interaction.ctx
                    .get("apis")
                    .rule34.fetchPosts(queryTags, 1);
                post = posts.length > 0 ? posts[0] : null;
            } else {
                return interaction.jsonReply(
                    "Either id or tags must be provided"
                );
            }

            return interaction.jsonReply(
                interaction.ctx.get("apis").rule34.makeSinglePostResponse(post)
            );
        } catch (err) {
            if (
                err instanceof SyntaxError &&
                err.message == "Unexpected end of JSON input"
            ) {
                return interaction.jsonReply("No posts found!");
            } else {
                return interaction.jsonReply(`Error: ${String(err)}`);
            }
        }
    },
});
