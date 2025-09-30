import { Command } from "@/interactions/commands";
import { GoogleGenAI } from "@google/genai";

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

const askCommand: Command<{
    question: string;
}> = {
    data: (command) =>
        command
            .setName("ask")
            .setDescription("Ask Gemini 2.5 Flash!")
            .addStringOption((option) =>
                option
                    .setName("question")
                    .setDescription("The question to ask Gemini 2.5 Flash")
                    .setRequired(true)
            ),
    shouldDefer: true,
    run: async (interaction, inputMap) => {
        const { question } = inputMap;

        const ai = new GoogleGenAI({
            apiKey: interaction.env.GEMINI_API_KEY,
        });

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: LLM_PROMPT + question,
            });
            const LENGTH_LIMIT = 2000;

            const response_text = response.text || "";

            const splitted_response = [];
            for (let i = 0; i < response_text.length; i += LENGTH_LIMIT) {
                splitted_response.push(
                    response_text.slice(i, i + LENGTH_LIMIT)
                );
            }

            for (const r of splitted_response) {
                await interaction.followUp(r);
            }
        } catch (e) {
            await interaction.followUp(`Error: ${(e as Error).message}`);
        }
    },
};

export default askCommand;
