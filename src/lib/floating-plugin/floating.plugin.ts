import { EMPTY_VALUE } from "@medad-mce/utils";
import { ElementBuilder } from "@medad-mce/utils";
import { PluginFactory } from "@medad-mce/core";
import { COMMANDS, BUTTONS, CONTEXT_MENU, CONTEXT_TOOLBAR, MENU_ITEMS } from './floating.constants'

export class FloatingPlugin extends PluginFactory {
  constructor() {
    super("floating", {
      name: "floating",
    });
  }

  override styles = `.floating {
    position: absolute;
    border: 1px dashed black;
    transition: rotate 0.25s ease;
  }`;

  private startPointX: number = 0;
  private startPointY: number = 0;

  private predictElement(element: Element) {
    return Boolean(element.classList.contains('floating') || element.parentElement?.classList?.contains('floating'));
  }

  private registerUI() {
    this.editor?.ui.registry.addContextToolbar(CONTEXT_TOOLBAR.floating_element, {
      items: `${BUTTONS.floating_element_btn}`,
      position: "selection",
      predicate: () => {
        return this.editor?.selection.isCollapsed() === false;
      },
    });

    // this.editor?.ui.registry.addButton("floating_delete_element", {
    //   onAction: () => this.toggleElementFloating(this.editor?.selection.getNode() as HTMLElement),
    //   text: "Delete element",
    // });

    this.editor?.ui.registry.addMenuItem(MENU_ITEMS.floating_rotate_45deg, {
      text: "45deg",
      onAction: () =>
        this.rotateElement(this.editor?.selection.getNode() as HTMLElement, 45),
    });

    this.editor?.ui.registry.addMenuItem(MENU_ITEMS["floating_rotate_-45deg"], {
      text: "-45deg",
      onAction: () =>
        this.rotateElement(
          this.editor?.selection.getNode() as HTMLElement,
          -45
        ),
    });

    this.editor?.ui.registry.addContextMenu(CONTEXT_MENU.floating, {
      update: (element) => {
        if (this.predictElement(element))
          return `${MENU_ITEMS.floating_rotate_45deg} | ${MENU_ITEMS["floating_rotate_-45deg"]}`;
        return "";
      },
    });

    this.editor?.ui.registry.addContextToolbar(CONTEXT_TOOLBAR.floating, {
      predicate: (e) => {
        return (
          this.predictElement(e) && !this.editor?.selection.isCollapsed()
        );
      },
      type: "contexttoolbar",
      items: `${MENU_ITEMS.floating_rotate_45deg} | ${MENU_ITEMS["floating_rotate_-45deg"]}`,
      position: "node",
      scope: "editor",
    });

    this.editor?.ui.registry.addToggleButton(BUTTONS.floating_element_btn, {
      onAction: (api) => {
        this.toggleElementFloating(this.editor?.selection.getNode() as HTMLElement);
        api.setActive(this.isElementFloating());
      },
      onSetup: (api) => {
        api.setActive(this.isElementFloating());
        return () => {
          api.setActive(!api.isActive());
        };
      },
      text: "Set Floating",
    });

  }

  private registerCommands() {
    this.editor?.addCommand(COMMANDS.add_floating_element, (_, id: string) => {
      const element = this.editorDocument?.getElementById(id) as HTMLElement;
      this.setAbsoluteElementFloating(element);
    });
  }

  override onInit(): void {
    this.registerUI();
    this.registerCommands();
  }

  private isElementFloating() {
    const node = this.editor?.selection.getNode() as HTMLElement;
    return node.classList.contains("floating");
  }

  private toggleElementFloating(node: HTMLElement) {
    // const node = this.editor?.selection.getNode() as HTMLElement;

    if (node.classList.contains("floating")) {
      this.onSetElementStatic(node);
      return;
    }

    this.editor?.selection
      .getSelectedBlocks()
      .map((node) => this.onSetElementFloating(node as HTMLElement));

    return;
  }

  private rotateElement(node: HTMLElement, rotation: number) {
    if (!node.classList.contains('floating')) {
      node = node.parentElement as HTMLElement;
    }

    if (!node.style.rotate) {
      node.style.rotate = `${rotation}deg`;
      return;
    }

    const degree = +node.style.rotate.replace("deg", "");
    node.style.rotate = `${degree + rotation}deg`;
  }

  private onSetElementStatic(node: HTMLElement) {
    node.classList.remove("floating");
    node.style.cursor = "default";

    node.oncontextmenu = null;
    node.onmousedown = null;

    const nodeContent = node.innerHTML;
    const refID = node.getAttribute("data-ref-id");

    const document = this.editor?.getDoc() as Document;

    node.remove();
    if (refID) {
      const containerElement = document.getElementById(refID);
      if (containerElement) {
        containerElement.id = "";
        containerElement.innerHTML += nodeContent;
        return;
      }

      new ElementBuilder(
        document,
        this.editor?.getBody() as HTMLBodyElement
      ).append(
        new ElementBuilder(document, "div")
          .addClass("line-wrapper")
          .put(nodeContent).element
      );
    }

    new ElementBuilder(
      document,
      this.editor?.getBody() as HTMLBodyElement
    ).append(
      new ElementBuilder(document, "div")
        .addClass("line-wrapper")
        .put(node.innerHTML).element
    );
  }

  private setAbsoluteElementFloating(node: HTMLElement) {
    // node.classList.add('floating');
    node.setAttribute('class', 'floating');

    this.editor?.selection.select(node);
    node.style.cursor = "grab";

    node.ondblclick = (e) => this.onNodeContextMenu(e, node);
    node.oncontextmenu = (e) => this.onNodeContextMenu(e, node);

    node.onmousedown = (e) => this.onDragStart(e, node);
  }

  private onSetElementFloating(selectionNode: HTMLElement) {
    const doc = this.editor?.getDoc() as Document;
    const body = this.editor?.getBody() as HTMLElement;
    const content = selectionNode.innerHTML;

    selectionNode.innerHTML = EMPTY_VALUE;
    const referenceID = `ref_${Date.now()}`;
    selectionNode.id = referenceID;
    const node = new ElementBuilder(doc, "div")
      .addClass("floating", "line-wrapper")
      .addAttr("data-ref-id", referenceID)
      .put(content).element;

    new ElementBuilder(doc, body).append(node);

    this.editor?.selection.select(node);
    node.style.cursor = "grab";

    node.ondblclick = (e) => this.onNodeContextMenu(e, node);
    node.oncontextmenu = (e) => this.onNodeContextMenu(e, node);

    node.onmousedown = (e) => this.onDragStart(e, node);
  }

  onNodeContextMenu(e: MouseEvent, node: HTMLElement) {
    e.preventDefault();
    this.editor?.selection.select(node);
  }

  onDragStart(e: MouseEvent, node: HTMLElement) {
    e.preventDefault();
    this.startPointX = e.clientX;
    this.startPointY = e.clientY;

    const document = this.editor?.getDoc() as Document;

    node.style.cursor = "grabbing";

    document.onmouseup = () => this.onDragEnd(node);
    document.onmousemove = (e) =>
      this.onDragging(e, node, this.editor?.getBody() as HTMLBodyElement);
  }

  private onDragging(e: MouseEvent, node: HTMLElement, body: HTMLBodyElement) {
    const x = this.startPointX - e.clientX;
    const y = this.startPointY - e.clientY;

    this.startPointX = e.clientX;
    this.startPointY = e.clientY;

    // DONE: When element is at right side: Just check 0;
    // DONE: When element is at left decrease element width from body offset;

    const maxOfLeft = body.offsetWidth - node.offsetWidth;
    const maxOfTop = body.offsetHeight - node.offsetHeight;

    const top = Math.min(Math.max(node.offsetTop - y, 0), maxOfTop);
    const left = Math.min(Math.max(node.offsetLeft - x, 0), maxOfLeft);

    node.style.top = `${top}px`;
    node.style.left = `${left}px`;
  }

  private onDragEnd(node: HTMLElement) {
    const document = this.editor?.getDoc() as Document;
    node.style.cursor = "grab";

    document.onmouseup = null;
    document.onmousemove = null;
  }
}
