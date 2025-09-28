import { Context } from "hono";
import E from "./Env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
type MyContext = Context<E, any, {}>;

export default MyContext;
