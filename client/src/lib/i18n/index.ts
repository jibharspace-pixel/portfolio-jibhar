export { fr } from "./fr";
export { en } from "./en";
export type { Lang } from "./types";

import { fr } from "./fr";
import { en } from "./en";

const t = { fr, en } as const;
export default t;
