import MyContext from "@/types/my_context";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { APIInteractionResponse, ButtonStyle, InteractionResponseType } from "@discordjs/core/http-only";

const RULE34_BASE_URL =
    "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&";

type Rule34Post = {
    preview_url: string;
    sample_url: string;
    file_url: string;
    directory: number;
    hash: string;
    width: number;
    height: number;
    id: number;
    image: string;
    change: number;
    owner: string;
    parent_id: number;
    rating: string;
    sample: boolean;
    sample_height: number;
    sample_width: number;
    score: number;
    tags: string;
    source: string;
    status: string;
    has_notes: boolean;
    comment_count: number;
};

export const fetchPosts = async (c: MyContext, tags: string, limit: number) => {
    const url =
        RULE34_BASE_URL +
        new URLSearchParams({
            limit: limit.toString(),
            tags: tags,
            api_key: c.env.RULE34_API_KEY,
            user_id: c.env.RULE34_USER_ID,
        });
    const response = await fetch(url);
    const posts = (await response.json()) as Rule34Post[];
    return posts;
};

export const fetchPostById = async (c: MyContext, id: string) => {
    const url =
        RULE34_BASE_URL +
        new URLSearchParams({
            id: id,
            api_key: c.env.RULE34_API_KEY,
            user_id: c.env.RULE34_USER_ID,
        });
    const response = await fetch(url);
    const posts = (await response.json()) as Rule34Post[];
    return posts.length > 0 ? posts[0] : null;
};

export const makeOneR34PostResponse = (c: MyContext, data: Rule34Post | null): APIInteractionResponse => {
    if (!data) {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "No results found",
            },
        };
    }
    const { id, file_url, tags, rating, score } = data;
    const original = `https://rule34.xxx/index.php?page=post&s=view&id=${id}`;

    let content = "```tags: " + tags + "\n";
    content += `score: ${score}\nrating: ${rating}`;
    content += "```";
    content += `[link](${file_url})\n`;
    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(
        new ButtonBuilder()
            .setURL(original)
            .setLabel(`Source`)
            .setStyle(ButtonStyle.Link)
    );

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content,
            components: [row.toJSON()],
        },
    };
};