import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";

const [changeToken$, setToken] = createSignal<string>();
const [useToken, token$] = bind(changeToken$, "");
export { useToken, setToken, token$ };
