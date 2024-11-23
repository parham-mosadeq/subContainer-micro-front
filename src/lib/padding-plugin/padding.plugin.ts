import { ComponentType } from "react";
import { PluginFactory } from "@medad-mce/core";
import { MetadataHelper } from "@medad-mce/utils";

import { InsertPaddingPayload } from "./types/padding.types";
import { emitOpenPadding } from "./events/padding-plugin.events";
import { Padding } from "./models/padding.model";
import { BUTTONS, COMMANDS } from "./padding.constants";

export class PaddingPlugin extends PluginFactory {
  constructor() {
    super("padding", {
      name: "Padding",
    });
  }

  private _metadataHandler?: MetadataHelper<Padding>;

  private _defaultPadding?: Padding;

  private get defaultPadding() {
    if (!this._defaultPadding) this._defaultPadding = Padding.createDefault();
    return this._defaultPadding;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoadUi?: (() => Promise<{ default: ComponentType<any> }>) | undefined =
    () => import("./ui/padding-plugin.ui");

  onInit(): void {
    this.registerCommands();
    this.registerUi();
    this.loadCurrentDefaultData();
  }

  public onCacheLoaded(): void {
    if (!this._metadataHandler?.metadata) {
      return;
    }

    this._defaultPadding = Padding.createFromObjectStruct(
      this._metadataHandler.metadata
    );
    this.onPaddingInsert({
      padding: this._defaultPadding,
      unit: "mm",
    });
  }

  protected onModulesInitiated(): void {
    if (this.editor) {
      this._metadataHandler = new MetadataHelper<Padding>(
        this.editor,
        this.pluginName
      );
    }
  }

  private registerUi(): void {
    this.editor?.ui.registry.addButton(BUTTONS.padding, {
      onAction: () => this.onActionButtonClick(),
      icon: "preferences",
    });
  }

  private registerCommands(): void {
    this.editor?.addCommand(
      COMMANDS.insert_padding,
      (_, value: InsertPaddingPayload) => {
        this.onPaddingInsert(value);
      }
    );
  }

  private loadCurrentDefaultData(): void {
    const unit = this.contentElement?.getAttribute("data-padding-unit");
    if (!unit) return;

    const padding = (this.contentElement as HTMLDivElement).style.padding;
    if (!padding) return;

    const info = padding.split(" ").map((item: string) => {
      const directionPaddingAsString = item.replace(unit, "");
      const directionPadding = Number(directionPaddingAsString) || 0; // if direction is string sets default value to 0 value;
      return directionPadding;
    });

    switch (info.length) {
      case 1:
        this._defaultPadding = Padding.createFromObjectStruct({
          top: info?.at(0) || 0,
          right: info?.at(0) || 0,
          bottom: info?.at(0) || 0,
          left: info?.at(0) || 0,
        });
        break;
      case 2:
        this._defaultPadding = Padding.createFromObjectStruct({
          top: info?.at(0) || 0,
          right: info?.at(1) || 0,
          bottom: info?.at(0) || 0,
          left: info?.at(1) || 0,
        });
        break;
      case 3:
        this._defaultPadding = Padding.createFromObjectStruct({
          top: info?.at(0) || 0,
          right: info?.at(1) || 0,
          bottom: info?.at(2) || 0,
          left: info?.at(1) || 0,
        });
        break;
      case 4:
        this._defaultPadding = Padding.createFromObjectStruct({
          top: info?.at(0) || 0,
          right: info?.at(1) || 0,
          bottom: info?.at(2) || 0,
          left: info?.at(3) || 0,
        });
        break;
      default:
        break;
    }
  }

  private onActionButtonClick(): void {
    this.loadCurrentDefaultData();
    emitOpenPadding({
      defaultValue: this.defaultPadding,
    });
  }

  private onPaddingInsert(data: InsertPaddingPayload): void {
    (this.contentElement as HTMLDivElement).style.padding =
      data.padding.toCssProperty(data.unit);
    (this.contentElement as HTMLDivElement).setAttribute(
      "data-padding-unit",
      data.unit
    );
    if (this._metadataHandler) this._metadataHandler.metadata = data.padding;
  }
}
