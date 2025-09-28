import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["../*"],
							message:
								"Relative imports are not allowed, use absolute imports instead (start with @/ to refer to src/)",
						},
						{
							regex: "@discordjs/core$",
							message:
								"Please import from @discordjs/core/http-only instead",
						},
					],
				},
			],
		},
		languageOptions: { globals: globals.node },
	},
	tseslint.configs.recommended,
]);
