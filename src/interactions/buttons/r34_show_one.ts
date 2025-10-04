import { factory } from "@/utils";
import { ButtonStyle } from "disteractions";

const R34_SHOW_ONE_BUTTON_ID = 1;

export const r34ShowOne = factory.reactiveButton({
    id: R34_SHOW_ONE_BUTTON_ID,
    defaultValues: {
        style: ButtonStyle.Primary,
    },
    runner: async (interaction, data) => {
        const id = data;
        console.log("Fetching post by ID:", id);
        try {
            const post = await interaction.ctx
                .get("apis")
                .rule34.fetchPostById(id);

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
                return interaction.jsonReply(`${err}`);
            }
        }
    },
});
