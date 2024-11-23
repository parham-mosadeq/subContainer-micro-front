import { IVariableType } from "../types";
import { VariableTypes } from "../types/variable-plugin.type";

export class VariableModel implements IVariableType {
  public variableName: string = '';
  public isRequired: boolean = false;
  public title: string = '';
  public variableType: VariableTypes = 'string';

  constructor(data?: IVariableType) {
    if (data) {
      Object.assign(this, data);
    }
  }

  valueOf(): IVariableType {
    return {
      isRequired: this.isRequired,
      title: this.title,
      variableName: this.variableName,
      variableType: this.variableType
    }
  }
}