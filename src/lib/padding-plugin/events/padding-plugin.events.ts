import { createSignal } from "@react-rxjs/utils";
import { PaddingOpenSignalPayload } from "../types/padding.types";

export const [paddingOpen$, emitOpenPadding] = createSignal<PaddingOpenSignalPayload>();
