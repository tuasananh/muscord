import { InteractionResponseType } from "@discordjs/core/http-only";
import { Button } from ".";

const r34ShowOneButton: Button = {
    name: "r34ShowOne",
    run: async (c, interaction, inputs) => {
        const id = inputs.at(0);
        if (id) {
            try {
                const post = await c.get('r34').fetchPostById(c, id);

                return c.get("r34").makeOneR34PostResponse(c, post);
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
        } else {
            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "No id provided",
                },
            }
        }
    },
};

export default r34ShowOneButton;
