import { PluginFactory } from "@medad-mce/core";
import { EMPTY_VALUE, ElementBuilder } from "@medad-mce/utils";
import { BUTTONS } from "./layouts.constants";

export class LayoutsPlugin extends PluginFactory {
  constructor() {
    super("layouts", {
      name: "Layouts",
    });
  }

  override onInit(): void {
    this.registerButton();
  }

  private injectToBody(element: HTMLElement) {
    if (!this.editor) return;
    const document = this.editor.getDoc();
    const body = this.editor.selection.getNode();

    const div = document.createElement("div");
    div.appendChild(element);
    div.classList.add("line-wrapper");
    const newRow = document.createElement("div");
    newRow.classList.add("line-wrapper");
    newRow.innerHTML = EMPTY_VALUE;
    body.appendChild(div);
    body.appendChild(newRow);
  }

  private registerButton() {
    this.editor?.ui.registry.addButton(BUTTONS.layouts, {
      onAction: () => this.onButtonClick(),
      text: "Create layout",
    });
  }

  private onButtonClick() {
    console.log(this.editor?.getElement());
    const document = this.editor?.getDoc();

    const mainElement = new ElementBuilder(
      document as Document,
      "div"
    ).addClass("three-row");

    const model = new ElementBuilder(document as Document, "div")
      .append(
        new ElementBuilder(document as Document, "p").put(EMPTY_VALUE).element
      )
      .addClass("row");

    this.injectToBody(
      mainElement.append(
        model.element,
        model.clone().element,
        model.clone().element
      ).element
    );
  }
}
