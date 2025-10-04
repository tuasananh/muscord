import * as fs from "fs";
import { snakeToCamel } from "../utils";

export function generate(folder: string) {
    const folderPath = `src/interactions/${folder}`;

    const files = fs
        .readdirSync(folderPath)
        .filter((f) => !f.startsWith("index.ts") && !f.startsWith("_"));

    const lines = [];

    lines.push("// Auto-generated — do not edit");

    for (const f of files) {
        const filenameNoExtension = f.replace(/\.\w+$/, "");
        const camelCased = snakeToCamel(filenameNoExtension);
        lines.push(`import { ${camelCased} } from './${filenameNoExtension}';`);
    }
    lines.push("");
    lines.push(`export const ${folder} = [`);
    for (const f of files) {
        const filenameNoExtension = f.replace(/\.\w+$/, "");
        const camelCased = snakeToCamel(filenameNoExtension);
        lines.push(`  ${camelCased},`);
    }
    lines.push("];");

    // Check if file exists and content is the same
    const outputPath = folderPath + `/_generated_${folder}.ts`;
    const newContent = lines.join("\n");

    if (
        fs.existsSync(outputPath) &&
        fs.readFileSync(outputPath, "utf-8") == newContent
    ) {
        console.log(`File ${outputPath} content is already up to date`);
    } else {
        fs.writeFileSync(outputPath, lines.join("\n"));
    }
}
