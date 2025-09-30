import MyContext from "@/types/my_context";
import { APIChatInputApplicationCommandInteraction } from "@discordjs/core/http-only";

// base runner: Args is a tuple for the rest parameters (defaults to unknown[])
type Runner<Output, Args extends unknown[] = unknown[]> =
    (c: MyContext,
        interaction: APIChatInputApplicationCommandInteraction,
        ...args: Args) => Promise<Output>;

// --- Examples --------------------

// 1) explicit tuple of two numbers
const runner1: Runner<void, [number, number]> =
    async (c, interaction, arg1, arg2) => {
        // arg1: number, arg2: number
    };

// 2) first param string then any number of numbers
const runner2: Runner<boolean, [string, ...number[]]> =
    async (c, interaction, label, ...values) => {
        // label: string, values: number[]
        return values.length > 0;
    };

// 3) optional arguments
const runner3: Runner<void, [number, number?]> =
    async (c, interaction, a, b) => {
        // a: number, b?: number
    };
