import MyContext from "@/types/MyContext";
import { APIMessageComponentButtonInteraction } from "@discordjs/core/http-only";
import r34ShowOneButton from "./r34_show_one";

export interface Button {
	/**
	 * The name of the button.
	 *
	 * Should be camelCase to save space in `custom_id`.
	 */
	name: string;
	run: (
		c: MyContext,
		interaction: APIMessageComponentButtonInteraction
	) => Promise<void | Response>;
	defer_first?: boolean;
}

export const buttons: Button[] = [r34ShowOneButton];

export const buttonMap = (() => {
	const map = new Map<string, Button>();
	for (const button of buttons) {
		map.set(button.name, button);
	}
	return map;
})();
