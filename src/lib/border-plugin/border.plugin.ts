import { MetadataHelper } from "@medad-mce/utils";
import { PluginFactory } from "@medad-mce/core";
import { emitOpenBorderPanel } from "./events/border.events";
import { Border } from "./models/border.model";
import { IBorder } from "./types/border.interface";
import { BUTTONS, COMMANDS } from './border.constants'

export class BorderPlugin extends PluginFactory {
  private _metadata?: MetadataHelper<IBorder>;

  constructor() {
    super("Border", {
      name: "border",
    });
  }


  onLoadUi = () => import('./ui/border.ui');

  override onInit(): void {
    this.registerUI();
    this.registerCommands();
  }

  public onCacheLoaded(): void {
    if (this._metadata?.metadata) {
      this.onInsertBorder(this._metadata.metadata);
    }
  }

  protected onModulesInitiated(): void {
    if (!this.editor) return;
    this._metadata = new MetadataHelper(this.editor, this.pluginName);
  }


  private registerUI() {
    this.editor?.ui.registry.addButton(BUTTONS.default, {
      text: "insert border",
      onAction: () => this.onUiButtonClick(),
    });
  }

  private registerCommands() {
    this.editor?.addCommand(COMMANDS.INSERT, (_, value: Border) => this.onInsertBorder(value));
  }

  private removeBorder() {
    if (!this.editorBody) return;
    this.editorBody.style.borderTop = '';
    this.editorBody.style.borderLeft = '';
    this.editorBody.style.borderRight = '';
    this.editorBody.style.borderBottom = '';
  }

  private onInsertBorder(value: IBorder) {
    if (!this.editorBody) return;
    this.removeBorder();

    const body = this.editorBody;
    const border = Border.fromObject(value);


    if (border.directions.includes('top')) {
      body.style.borderTop = border.toCssValue();
    }

    if (border.directions.includes('bottom')) {
      body.style.borderBottom = border.toCssValue();
    }

    if (border.directions.includes('left')) {
      body.style.borderLeft = border.toCssValue();
    }

    if (border.directions.includes('right')) {
      body.style.borderRight = border.toCssValue();
    }

    if (this._metadata) {
      this._metadata.metadata = border.valueOf();
    }
  }

  private onUiButtonClick() {
    console.log(this._metadata?.metadata);
    if (!this._metadata?.metadata) {
      emitOpenBorderPanel(new Border());
      return;
    }
    emitOpenBorderPanel(Border.fromObject(this._metadata.metadata));
  }
}
