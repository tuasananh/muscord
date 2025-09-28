// npm i glob fs-extra
import * as fs from "fs";

export function generateCommands() {
	const commandsPath = "src/interactions/commands";

	const files = fs
		.readdirSync(commandsPath)
		.filter(
			(f) =>
				!f.startsWith("index.ts") &&
				!f.startsWith("_generated_commands.ts")
		);

	const lines = [];

	lines.push("// Auto-generated — do not edit");

	for (const f of files) {
		const filenameNoExtension = f.replace(/\.\w+$/, "");
		const camelCased = filenameNoExtension.replace(/-([a-z])/g, (g) =>
			g[1].toUpperCase()
		);
		lines.push(`import ${camelCased} from './${filenameNoExtension}';`);
	}
	lines.push("");
	lines.push("export const commands = [");
	for (const f of files) {
		const filenameNoExtension = f.replace(/\.\w+$/, "");
		const camelCased = filenameNoExtension.replace(/-([a-z])/g, (g) =>
			g[1].toUpperCase()
		);
		lines.push(`  ${camelCased},`);
	}
	lines.push("];");

	// Check if file exists and content is the same
	const outputPath = commandsPath + "/_generated_commands.ts";
	const newContent = lines.join("\n");

	if (
		fs.existsSync(outputPath) &&
		fs.readFileSync(outputPath, "utf-8") == newContent
	) {
		console.log("File content is already up to date");
	} else {
		fs.writeFileSync(outputPath, lines.join("\n"));
	}
}
