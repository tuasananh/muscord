import { DisteractionsFactory } from "disteractions";
import { MuscordEnv } from "../types";

export const factory = new DisteractionsFactory<MuscordEnv>();

export const commaSeparatedQuestionMarks = (length: number) => {
    return Array.from({ length }, () => "?").join(",");
};
