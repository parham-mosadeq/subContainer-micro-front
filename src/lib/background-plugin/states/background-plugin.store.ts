export class BackgroundStore {
  constructor() {}

  bodyBackground: string = "";

  private static _instance: BackgroundStore;

  static createInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new BackgroundStore();
    return this._instance;
  }
}
