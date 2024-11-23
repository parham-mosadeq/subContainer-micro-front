import { createSignal } from "@react-rxjs/utils";
import { Border } from "../models/border.model";

export const [openBorderPanel$, emitOpenBorderPanel] = createSignal<Border>();
export const [onBorderInsert$, emitBorderInsert] = createSignal<Border>();