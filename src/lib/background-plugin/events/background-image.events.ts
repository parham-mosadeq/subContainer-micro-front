import { createSignal } from "@react-rxjs/utils";

export const [onImageUploadRequest$, emitImageUploadRequest] = createSignal<{
  currentImageBuffer?: string;
}>();
