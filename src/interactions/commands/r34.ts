import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "@discordjs/core/http-only";
import { Command } from ".";

const r34: Command<{
	tags?: string;
	limit?: number;
	presets?: string;
}> = {
	data: (c) =>
		c
			.setName("r34")
			.setDescription("Uh oh!")
			.setNSFW(true)
			.addStringOption((option) =>
				option
					.setName("tags")
					.setDescription(
						"The tags to filter posts, seperated by a space"
					)
			)
			.addIntegerOption((option) =>
				option
					.setName("limit")
					.setDescription(
						"The maximum number of posts to fetch, defaults to 15"
					)
					.setMaxValue(100)
					.setMinValue(1)
			)
			.addStringOption((option) =>
				option
					.setName("presets")
					.setDescription(
						"List of tag presets to apply to the tag list, seperated by a space"
					)
			),

	shouldDefer: true,
	run: async (c, interaction, inputMap) => {
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

		await c
			.get("api")
			.interactions.followUp(
				interaction.application_id,
				interaction.token,
				{
					content: `input tags: \`${inputTagsText}\`\nraw tags:\`${
						queryTags.length ? queryTags : "None"
					}\`\ntimes: \`${limit}\``,
				}
			);

		try {
			const data = await c.get("r34").fetchPosts(c, queryTags, limit);
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
						new ButtonBuilder()
							.setStyle(ButtonStyle.Primary)
							.setCustomId("r34ShowOne@" + data[i]["id"])
							.setLabel(`${order}`)
					);

					// we need to specify the function that it runs as well
					// customId = it's like the roots
					// we need to specify handlers for
					cnt--;
					if (cnt) content += "        ";
					i++;
					order++;
				}

				await c
					.get("api")
					.interactions.followUp(
						interaction.application_id,
						interaction.token,
						{
							content,
							components: [row.toJSON(), sendOne.toJSON()],
						}
					);
				await new Promise((f) => setTimeout(f, 500));
			}
		} catch (err) {
			if (
				err instanceof SyntaxError &&
				err.message == "Unexpected end of JSON input"
			) {
				await c
					.get("api")
					.interactions.followUp(
						interaction.application_id,
						interaction.token,
						{
							content: "No posts found!",
						}
					);
			} else {
				await c
					.get("api")
					.interactions.followUp(
						interaction.application_id,
						interaction.token,
						{
							content: `${err}`,
						}
					);
			}
		}
	},
};

export default r34;
