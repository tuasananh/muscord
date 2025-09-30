import MyContext from "@/types/my_context";
import { APIInteractionResponse, APIMessageComponentButtonInteraction } from "@discordjs/core/http-only";
export { buttons } from "./_generated_buttons";

type Runner<Output> = (
    c: MyContext,
    interaction: APIMessageComponentButtonInteraction,
    args: string[]
) => Promise<Output>;

type BaseButton = {
    name: string;
    // ownerOnly?: boolean;
};

type DeferedButton = BaseButton & {
    run: Runner<void>;
    shouldDefer: true;
};

type ImmediateCommand = BaseButton & {
    run: Runner<APIInteractionResponse>;
    shouldDefer?: false;
};

export type Button = DeferedButton | ImmediateCommand;
