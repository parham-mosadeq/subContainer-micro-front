import { createSignal } from "@react-rxjs/utils";
import { IVariableType } from '../types';

export const [variableInsert$, onVariableInsert] = createSignal<IVariableType>();
