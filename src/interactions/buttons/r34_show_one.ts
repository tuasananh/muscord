import { Button } from ".";

const r34ShowOneButton: Button = {
    name: "r34ShowOne",
    run: async (interaction, inputs) => {
        const id = inputs.at(0);
        if (id) {
            try {
                const post = await interaction.apis.rule34.fetchPostById(id);

                return interaction.jsonReply(
                    interaction.apis.rule34.makeSinglePostResponse(post)
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
        } else {
            return interaction.jsonReply("No id provided");
        }
    },
};

export default r34ShowOneButton;
