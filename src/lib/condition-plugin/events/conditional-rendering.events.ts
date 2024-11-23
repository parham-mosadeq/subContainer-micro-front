import { createSignal } from '@react-rxjs/utils';
import { ConditionType } from '../types/conditional-rendering.types'

export const [onInsertCondition, insertCondition] = createSignal<ConditionType>();
export const [onConditionDialogOpen, setOnConditionDialogOpen] = createSignal<{ instanceId: string }>();