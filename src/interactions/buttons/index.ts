import MessageComponentButtonInteraction from "@/structures/message_component_button_interaction";
import { APIInteractionJsonResponse } from "@/types";
export { buttons } from "./_generated_buttons";

type Runner<Output> = (
    interaction: MessageComponentButtonInteraction,
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
    run: Runner<APIInteractionJsonResponse>;
    shouldDefer?: false;
};

export type Button = DeferedButton | ImmediateCommand;
