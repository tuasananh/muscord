import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { APIInteractionResponseCallbackData, ButtonStyle } from "disteractions";

export type Rule34Post = {
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

const RULE34_BASE_URL =
    "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&";

export class Rule34Client {
    api_key: string;
    user_id: string;
    base_url: string;

    constructor(api_key: string, user_id: string) {
        this.api_key = api_key;
        this.user_id = user_id;
        this.base_url =
            RULE34_BASE_URL +
            new URLSearchParams({
                api_key: this.api_key,
                user_id: this.user_id,
            }) +
            "&";
    }

    async fetchPosts(tags: string, limit: number) {
        const url =
            this.base_url +
            new URLSearchParams({
                limit: limit.toString(),
                tags: tags,
            }).toString();
        console.log(url);
        const response = await fetch(url);
        const posts = (await response.json()) as Rule34Post[];
        return posts;
    }

    async fetchPostById(id: string) {
        const url =
            this.base_url +
            new URLSearchParams({
                id: id,
            }).toString();
        const response = await fetch(url);
        const posts = (await response.json()) as Rule34Post[];
        return posts.length > 0 ? posts[0] : null;
    }

    makeSinglePostResponse = (
        data: Rule34Post | null
    ): APIInteractionResponseCallbackData | string => {
        if (!data) {
            return "No results found";
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
            content,
            components: [row.toJSON()],
        };
    };
}
