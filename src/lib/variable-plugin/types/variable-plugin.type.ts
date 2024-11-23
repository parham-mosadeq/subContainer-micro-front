export type VariableTypes = 'string' | 'number' | 'boolean'

export interface IVariableType {
  variableName: string;
  isRequired: boolean;
  title: string;
  variableType: VariableTypes
}


export type VariableEmitterFn = (data: IVariableType) => void;