import { PluginFactory } from "@medad-mce/core";
import { ElementBuilder, EMPTY_VALUE } from "@medad-mce/utils";

import {
  ATTRIBUTES,
  COMMANDS,
  EVENTS,
  LIST_PLUGIN_NAME,
  UI_ELEMENTS
} from './constants/list-plugin.constants';
import { ListItemType } from "./types/list-plugin.types";

export class ListPlugin extends PluginFactory {
  constructor() {
    super(LIST_PLUGIN_NAME, {
      name: LIST_PLUGIN_NAME
    }, ['dynamic-mdd'])


  }

  private _lists: string[] = []

  override styles = `
    .list-container {
      color: #000;
      border: 2px dashed #888;
      background-color: #f5f5f5;
      border-radius: 5px;
    }

    .block {
      display: inline-block;
    }
  `;

  override onLoadUi = () => import('./ui/list-plugin.ui')

  private createDynamicMdd() {
    return this.editorDocument?.createElement('dynamic-mdd');
  }

  override onInit(): void {
    // commands
    this.editor?.addCommand(COMMANDS.insert, (_, value: ListItemType) => {
      this.onListInsert(value);
    });

    this.editor?.addCommand(COMMANDS.get_lists, (_, value: (list: string[]) => void) => {
      value(this._lists);
    })

    // buttons
    this.editor?.ui.registry.addButton(UI_ELEMENTS.buttons.insert.name, {
      onAction: () => this.onButtonClick(),
      text: UI_ELEMENTS.buttons.insert.text
    });

    // context toolbar
    this.editor?.ui.registry.addContextToolbar(UI_ELEMENTS.buttons.insert.name, {
      items: UI_ELEMENTS.buttons.insert.name,
      position: 'selection',
      predicate: () => {
        if (
          this.selectedNode?.tagName?.toLowerCase() === 'img' ||
          this.selectedNode?.firstElementChild?.tagName?.toLowerCase() == 'img'
        ) {
          return false;
        }
        return this.editor?.selection.isCollapsed() === false
      }
    });

    const table = this.editor?.ui.registry.getAll().contextMenus?.table;

    if (!table) return;


    this.editor?.ui.registry.addMenuItem(UI_ELEMENTS.buttons.insert.name, {
      text: UI_ELEMENTS.buttons.insert.text,
      onAction: () => this.onButtonClick()
    });

    this.editor?.ui.registry.addContextMenu('table', {
      update: (element) => {
        const tables = table.update(element)
        return tables + `| ${UI_ELEMENTS.buttons.insert.name}`;
      }
    });
  }

  private onListInsert(data: ListItemType) {
    const htmlContent = this.selection?.getContent({ format: 'html' });

    if (this.selectedNode?.tagName.toLowerCase() === 'td') {
      new ElementBuilder(
        this.editorDocument as Document,
        this.selectedNode.parentElement as HTMLTableRowElement,
      )
        .addAttr(ATTRIBUTES.iterator, 'true')
        .addClass('list-container');

      return;
    }

    const html = new ElementBuilder(
      this.editorDocument as Document,
      this.createDynamicMdd() as HTMLElement
    )
      .put(htmlContent || EMPTY_VALUE)
      .addAttr(ATTRIBUTES.iterator, "true")
      .addAttr(ATTRIBUTES.paramName, data.name)
      .addAttr(ATTRIBUTES.separator, data.separator)
      .addClass('list-container', 'inline-block')
      .element
      .outerHTML;


    this._lists.push(data.name);

    this.selection?.setContent(html + EMPTY_VALUE);
  }

  private onButtonClick() {
    this.editor?.fire(EVENTS.insert);
    const node = this.editor?.selection.getNode();

    if (!node?.hasAttribute(ATTRIBUTES.iterator)) {
      this.editor?.fire(EVENTS.insert);
      return;
    }

    node.removeAttribute(ATTRIBUTES.iterator)
  }
}