import { PluginFactory } from "@medad-mce/core";
import { BUTTONS } from './pagination.constants'

const ALLOWED_KEYS = [
  "Backspace",
  "Enter",
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
];

export class PaginationPlugin extends PluginFactory {
  private initialHeight: number = 0;
  private _pageCount = 0;

  private get pageCount() {
    return this._pageCount;
  }

  private set pageCount(value: number) {
    // if (value !== this._pageCount) {
    //   this.onPageChange(value);
    // }
    this._pageCount = value;
  }

  constructor() {
    super("pagination", {
      name: "Pagination",
    });
  }

  private btnAPI?: { setText(text: string): void };

  // private onPageChange(value: number) {
  //   console.log("New page");
  //   const items = document.getElementsByClassName("page-spliter");
  //   for (let index = 0; index < items.length; index++) items[index].remove();
  //   // this.generateLine(value);
  // }

  override onInit(): void {
    this.editor?.ui.registry.addButton(BUTTONS.pages, {
      enabled: false,
      onAction() { },
      onSetup: (api) => {
        this.btnAPI = api;
        return () => { };
      },
      text: "1/1",
    });

    this.editor?.getDoc().addEventListener("keyup", this.onKeyPress);
    this.editor?.getDoc().addEventListener("click", this.onChange);
    this.editor?.on("paste", this.onChange);
  }

  override onDestroy(): void {
    this.editor?.getDoc().removeEventListener("keyup", this.onKeyPress);
    this.editor?.getDoc().removeEventListener("click", this.onChange);
    this.editor?.off("paste", this.onChange);
  }

  onKeyPress = (event: KeyboardEvent) => {
    if (!ALLOWED_KEYS.includes(event.key)) return;
    this.onChange();
  };

  onChange = () => {
    if (!this.initialHeight) {
      this.initialHeight =
        this.editor?.getBody().offsetHeight || this.initialHeight;
    }

    const count = this.pageIndex.toFixed();
    const total = this.totalPageCount.toFixed();
    this.pageCount = +total;

    // this.generateLine(+total);
    this.btnAPI?.setText(`${count}/${total}`);
  };

  // private generateLine(pageCount: number) {
  //   const document = this.editor?.getDoc() as Document;
  //   const body = new ElementBuilder(
  //     document,
  //     this.editor?.getBody() as HTMLBodyElement
  //   );
  //   for (let index = 0; index < pageCount - 1; index++) {
  //     const line = new ElementBuilder(document, "div").addClass(
  //       "page-spliter"
  //     ).element;
  //     line.style.top = `${(index + 1) * this.initialHeight}px`;
  //     line.style.left = `0px`;
  //     body.append(line);
  //   }
  // }

  private get totalPageCount(): number {
    const body = this.editor?.getBody() as HTMLBodyElement;
    const height = body.offsetHeight || this.initialHeight;
    const totalPage = Math.ceil(height / this.initialHeight);
    return Math.ceil(totalPage);
  }

  private get pageIndex(): number {
    const node = this.editor?.selection.getNode() as HTMLElement;
    const totalPage = Math.ceil((node?.offsetTop || 0) / this.initialHeight);
    return Math.max(Math.ceil(totalPage), 1);
  }
}
