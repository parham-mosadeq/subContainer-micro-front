import { Observable, Subscription } from "rxjs";
import { variableInsert$, onVariableInsert } from '../events/variable-insert.event-stream';
import { IVariableType } from "../types";
import { VariableEmitterFn } from "../types/variable-plugin.type";

class VariablesStore {

  private _variables: Record<string, IVariableType> = {};
  private readonly _subscription: Subscription;

  public get emitState() {
    return this._variableEmitter;
  }

  public get state() {
    return this._variables;
  }

  constructor(private readonly _variablesInsert$: Observable<IVariableType>, private readonly _variableEmitter: VariableEmitterFn) {
    this._subscription = _variablesInsert$
      .subscribe({
        next: (variableConfig: IVariableType) => this.variablePipe(variableConfig)
      })
  }

  public onVariableInsert(eventHandler: VariableEmitterFn) {
    this._variablesInsert$.subscribe({
      next(value: IVariableType) {
        eventHandler(value)
      },
    })
  }

  private variablePipe(variableConfig: IVariableType) {
    this._variables[variableConfig.variableName] = variableConfig;
  }

  public destroy() {
    this._subscription.unsubscribe();
  }


  private static _instance?: VariablesStore | undefined;
  static createInstance(variablesInsert$: Observable<IVariableType>, emitter: VariableEmitterFn): VariablesStore {
    if (!VariablesStore._instance) {
      VariablesStore._instance = new VariablesStore(variablesInsert$, emitter);
    }

    return VariablesStore._instance;
  }
}

export const variablesState = VariablesStore.createInstance(variableInsert$, onVariableInsert);