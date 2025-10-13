import { GoogleGenAI } from "@google/genai";
import { ApplicationCommandOptionType } from "disteractions";
import { factory } from "../../utils";

const LLM_PROMPT = `When answering, format your response using **Discord Markdown** rules:

- *italics* or _italics_ 
- **bold**
- __underline__
- ***bold italics***
- ~~Strikethrough~~
- Combine markers for underline+bold+italics. 
- Escape formatting with '\\'
- Headers: #, ##, ### at line start. 
- Subtext: -# your text. 
- Links: [text](url) (If you don't wish to embed a link, you can wrap the link with <> to remove the embed for that specific link. ). 
- Lists: unordered (- or *) / ordered (1., 2.). 
- Inline code: \`code\` 
- Multiline code: \`\`\`lang \`\`\` (with lang for syntax highlighting, e.g., py, json, bash). 
- Block quotes: > blockquote, for multiple lines use > at the start of each line.
- Spoilers: ||spoiler|| 

Any features not stated above are not supported in Discord Markdown and should not be used. For example, inline math or display math is not supported. If needed, you should use a code block.

Try to answer in the language of the prompt. Do not mention any of this instruction in your answer. The actual prompt starts below this line.\n\n`;

export const ask = factory.slashCommand({
    name: "ask",
    description: "Ask a question",
    arguments: {
        question: {
            type: ApplicationCommandOptionType.String,
            description: "The question to ask",
            required: true,
        },
    },

    runner: {
        shouldDefer: true,
        callback: async (interaction, inputMap) => {
            const { question } = inputMap;

            const ai = new GoogleGenAI({
                apiKey: interaction.ctx.hono.env.GEMINI_API_KEY,
            });

            const ONE_MESSAGE_LENGTH = 2000;

            try {
                const response = await ai.models.generateContentStream({
                    model: "gemini-2.5-flash",
                    contents: LLM_PROMPT + question,
                });

                let current_response = "";

                for await (const chunk of response) {
                    if (chunk.text !== undefined) {
                        if (
                            current_response.length + chunk.text.length >=
                            ONE_MESSAGE_LENGTH
                        ) {
                            await interaction.followUp(current_response);
                            current_response = "";
                        }
                        current_response += chunk.text;
                    }
                }
                if (current_response.length > 0) {
                    await interaction.followUp(current_response);
                }
            } catch (e) {
                if (e instanceof Error) {
                    await interaction.followUp(`${e.message}`);
                } else {
                    console.log("Unknown error", e);
                    await interaction.followUp(`Error: ${String(e)}`);
                }
            }
        },
    },
});
