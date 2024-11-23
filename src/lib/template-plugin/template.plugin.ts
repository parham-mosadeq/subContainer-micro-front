import { PluginFactory } from "@medad-mce/core";
import { EMPTY_VALUE, ElementBuilder, MetadataHelper } from "@medad-mce/utils";
import { BUTTONS } from './template.constants';

export class TemplatePlugin extends PluginFactory {
  constructor() {
    super("header", {
      name: "Header",
    });
  }

  private _metadata?: MetadataHelper;

  protected onModulesInitiated(): void {
    if (this.editor) {
      this._metadata = new MetadataHelper(this.editor, 'header_footer');
    }
  }

  override styles: string | undefined = `
    .header {
      width: 100%;
      top: 0;
      left: 0;
    }
    .footer , .header {
      background-color: #ddd;
      position: relative;
    }

    .header::before {
      content: "Header";
      position: absolute;
      bottom: 0;
      left: 10px;
      background: white;
      font-size: x-small;
      border-radius: 5px;
      padding: 4px;
      transform: translateY(50%);
      z-index: 10;
      border: 1px dashed #aaa;
    }
    
    .header::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: 1px dashed #aaa;
      z-index: 1;
    }
    
    .footer::before {
      content: "Footer";
      position: absolute;
      font-size: x-small;
      top: 0;
      left: 10px;
      background: white;
      border-radius: 5px;
      padding: 4px;
      transform: translateY(-50%);
      z-index: 10;
      border: 1px dashed #aaa;
    }
    
    .footer::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      border-top: 1px dashed #aaa;
      z-index: 1;
    }

    .header .right-text {
      text-align: right;
    }
    .header div,
    .footer div {
      width: 100%;
    }

    header .line-wrapper {
      padding: 0;
    }
  `;

  override onInit(): void {
    this.editor?.ui.registry.addButton(BUTTONS.addHeader, {
      onAction: () => this.onHeaderClick("header"),
      text: "Add Header",
    });

    this.editor?.ui.registry.addButton(BUTTONS.addFooter, {
      onAction: () => this.onHeaderClick("footer"),
      text: "Add Footer",
    });
  }

  private onHeaderClick(tag: "footer" | "header") {
    const doc = this.editor?.getDoc() as Document;

    const element = new ElementBuilder(doc as Document, tag)
      .addClass(tag)
      .append(
        new ElementBuilder(doc as Document, "div")
          .addClass("line-wrapper")
          .put(EMPTY_VALUE).element
      );

    const docBody = new ElementBuilder(
      doc,
      tag === 'footer' ? this.bottomElement as HTMLDivElement : this.topElement as HTMLElement
    );

    if (tag === "header") {
      docBody.addAtFirst(element.element);
      return;
    }

    docBody.append(element.element);
  }

  onSaving(): void {
    if (!this._metadata) return;
    this._metadata.metadata = {
      headerHeight: this.topElement?.clientHeight,
      footerHeight: this.bottomElement?.clientHeight,
    }
  }
}
