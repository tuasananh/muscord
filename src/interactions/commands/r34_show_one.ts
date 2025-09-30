import { InteractionResponseType } from "@discordjs/core/http-only";
import { Command } from ".";

const r34ShowOne: Command<{
    id?: string;
    tags?: string;
    presets?: string;
}> = {
    data: (c) =>
        c
            .setName("r34-show-one")
            .setDescription("Uh oh!")
            .setNSFW(true)
            .addStringOption((option) =>
                option
                    .setName("id")
                    .setDescription(
                        "The id of the post, random post if not set"
                    )
            )
            .addStringOption((option) =>
                option
                    .setName("tags")
                    .setDescription(
                        "The tags to filter posts, seperated by a space"
                    )
            )
            .addStringOption((option) =>
                option
                    .setName("presets")
                    .setDescription(
                        "List of predefined filters to apply to the tag list, seperated by a space"
                    )
                    .addChoices({
                        name: "basic",
                        value: "basic",
                    })
            ),

    run: async (c, interaction, inputMap) => {
        const id = inputMap.id;
        const tags = inputMap.tags;

        try {
            let post;

            if (id) {
                post = await c.get("r34").fetchPostById(c, id);
            } else if (tags) {
                const whiteSpaceRegex = /\s+/;

                const inputTagsList = Array.from(new Set(tags.split(whiteSpaceRegex)));

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

                const posts = await c.get("r34").fetchPosts(c, queryTags, 1);
                post = posts.length > 0 ? posts[0] : null;
            } else {
                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "Either id or tags must be provided",
                    },
                }
            }

            return c.get('r34').makeOneR34PostResponse(c, post);
        } catch (err) {
            if (
                err instanceof SyntaxError &&
                err.message == "Unexpected end of JSON input"
            ) {
                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "No posts found!",
                    },
                };
            } else {
                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `${err}`,
                    },
                };
            }
        }
    },
};

export default r34ShowOne;
