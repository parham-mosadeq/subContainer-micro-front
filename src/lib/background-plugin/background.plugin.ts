import { Editor } from "tinymce";
import { MetadataHelper } from "@medad-mce/utils";
import { PluginFactory } from "@medad-mce/core";
import { emitImageUploadRequest } from "./events/background-image.events";
import * as constants from './background.constant';

export class BackgroundPlugin extends PluginFactory {
  private _lastRequestMode?: "selection" | "document";

  constructor() {
    super("background", {
      name: "background",
    });
  }

  private documentBackground = "";
  private _metadataHelper?: MetadataHelper;

  public onCacheLoaded(): void {
    if (!this._metadataHelper) return;
    this.onInsertDocumentBackground(this._metadataHelper.metadata?.backgroundImage);
  }

  private registerCommands() {
    this.editor?.addCommand(constants.COMMANDS.insert, (_, value) => {
      if (this._lastRequestMode === "selection") {
        this.onInsertBackground(value);
        return;
      }

      this.onInsertDocumentBackground(value);
    });
  }

  private registerUI() {
    this.editor?.ui.registry.addButton(constants.BUTTONS.default, {
      onAction: () => this.onButtonClick("document"),
      text: "background",
    });

    this.editor?.ui.registry.addButton(constants.BUTTONS.context, {
      onAction: () => this.onButtonClick(),
      text: "background image",
    });


    this.editor?.ui.registry.addContextToolbar(constants.CONTEXT_TOOLBAR.default, {
      items: `${constants.BUTTONS.context}`,
      position: "selection",
      predicate: () => {
        if (!this.selectedNode) return false;
        if (this.editor?.selection.isCollapsed() !== false) return false;
        return (
          (this.editor?.selection.isCollapsed() &&
            this.selectedNode?.classList.contains("header")) ||
          this.selectedNode?.classList.contains("footer")
        );
      },
    });

    this.editor?.ui.registry.addMenuItem(constants.MENU_ITEMS.default, {
      text: "background",
      onAction: () => this.onButtonClick(),
    });
  }

  onLoadUi = () => import("./ui/background-plugin.ui");
  onInit(): void {
    this.registerUI();
    this.registerCommands();
  }

  protected onModulesInitiated(): void {
    try {
      this._metadataHelper = new MetadataHelper(this.editor as Editor, this.pluginName)
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }

  onButtonClick = (mode: "selection" | "document" = "selection") => {
    this._lastRequestMode = mode;

    if (mode === "document") {
      emitImageUploadRequest({
        currentImageBuffer: this.documentBackground,
      });
      return;
    }
    emitImageUploadRequest({
      currentImageBuffer: undefined,
    });
  };

  onInsertBackground = (data: string) => {
    if (!this.selectedNode) {
      return;
    }
    let node: HTMLElement = this.selectedNode;

    while (
      !node.classList.contains("header") ||
      !node.classList.contains("footer")
    ) {
      if (!node.parentElement) break;
      node = node.parentElement;
      if (node.classList.contains('header') || node.classList.contains('footer')) {
        break;
      }
    }

    if (
      !(node.classList.contains("header") || node.classList.contains("footer"))
    ) {
      return;
    }

    node.style.backgroundImage = `url('${data}')`;
    node.style.backgroundRepeat = `none`;
    node.style.backgroundSize = `cover`;
  };

  private deleteDocumentBackground() {
    if (!this.editorBody) return;
    this.editorBody.style.backgroundImage = '';

    if (this._metadataHelper?.metadata) {
      this._metadataHelper.removeMetadata('backgroundImage');
    }
  }

  private onInsertDocumentBackground = (data: string) => {
    if (!this.editorBody) return;
    this.documentBackground = data;

    if (!data) {
      this.deleteDocumentBackground();
      return;
    }

    if (this._metadataHelper?.metadata) {
      this._metadataHelper.metadata = {
        backgroundImage: data,
      };
    }

    this.editorBody.style.backgroundImage = `url('${data}')`;
    this.editorBody.style.backgroundRepeat = `repeat-y`;
    this.editorBody.style.backgroundSize = "100% auto";
  };
}
