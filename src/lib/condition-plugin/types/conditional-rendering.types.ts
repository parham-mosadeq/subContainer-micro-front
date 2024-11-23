export enum ConditionEquality {
  equals = '==',
  notEquals = '!='
}

export type ConditionType = {
  instanceId: string;
  equality: ConditionEquality;
  paramName: string;
  conditionValue: string;
  isShow: boolean;
};

export type ConditionalMetadataType = Record<string, ConditionType>;