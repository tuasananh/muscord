import { MuscordEnv } from "@/types";
import { DisteractionsFactory } from "disteractions";

export const snakeToCamel = (str: string) =>
    str.replace(/(_\w)/g, (m) => m[1].toUpperCase());

export const factory = new DisteractionsFactory<MuscordEnv>();
