import { respondWithOneR34Post } from "@/utils";
import { InteractionResponseType } from "@discordjs/core/http-only";
import { Button } from ".";

const r34ShowOneButton: Button = {
	name: "r34ShowOne",
	run: async (c, interaction) => {
		const id = interaction.data.custom_id.split("@").at(1);
		if (id) {
			const baseUrl =
				"https://api.rule34.xxx/index.php?page=dapi&s=post&q=index";

			const searchParams = new URLSearchParams({
				page: "dapi",
				s: "post",
				q: "index",
				json: "1",
				limit: "1",
				// tags: queryTags,
			});

			searchParams.append("id", id);
			const url = baseUrl + searchParams.toString();

			try {
				const posts = await fetch(url);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const data = ((await posts.json()) as any[])[0];
				return respondWithOneR34Post(c, data);
			} catch (err) {
				if (
					err instanceof SyntaxError &&
					err.message == "Unexpected end of JSON input"
				) {
					return c.json({
						type: InteractionResponseType.ChannelMessageWithSource,
						data: {
							content: "No posts found!",
						},
					});
				} else {
					return c.json({
						type: InteractionResponseType.ChannelMessageWithSource,
						data: {
							content: `${err}`,
						},
					});
				}
			}
		}
	},
};

export default r34ShowOneButton;
