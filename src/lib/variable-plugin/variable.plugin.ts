import { PluginFactory } from '@medad-mce/core';
import { MetadataHelper, EMPTY_VALUE } from '@medad-mce/utils';

import { variablesState } from './states/variables.store';
import { VariableModel } from './models/variable.model';
import { IVariableType } from './types';

import { BUTTONS, COMMANDS, CONTEXT_TOOLBAR } from './variable.constants'

export class VariablePlugin extends PluginFactory {
  constructor() {
    super("variable", {
      name: "variable",
    }, ['mdd']);
  }
  private _metadata?: MetadataHelper<Record<string, IVariableType>>;
  private readonly VARIABLE_ATTR_NAME = "data-param-name";
  private readonly REQUIRED_VAR_ATTR_NAME = "data-variable-required";
  private readonly TYPE_ATTR_NAME = "data-type";

  override onInit(): void {
    this.editor?.addCommand(
      COMMANDS.insert_variable,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_, value: VariableModel) => this.onVariableInsert(value)
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.editor?.addCommand(
      COMMANDS.export_variables,
      (_, value: (list: Record<string, IVariableType>) => void) =>
        this.onExportVariables(value)
    );

    this.editor?.ui.registry.addContextToolbar(CONTEXT_TOOLBAR.insert_variable, {
      predicate: () => {
        // Prevent from selecting image element
        if (
          this.selectedNode?.tagName?.toLowerCase() === 'img' ||
          this.selectedNode?.firstElementChild?.tagName?.toLowerCase() == 'img'
        ) {
          return false;
        }

        // Return true when the selected node (or its parent) is a text node
        return this.editor?.selection.isCollapsed() === false;
      },
      items: `${BUTTONS.insert_variable}`,
      position: "selection",
    });

    this.editor?.ui.registry.addButton(BUTTONS.insert_variable, {
      onAction: () => {
        this.onButtonClick();
      },
      text: "Set/Unset variable",
    });
  }

  protected override onModulesInitiated(): void {
    if (this.editor) {
      this._metadata = new MetadataHelper(this.editor, this.pluginName);

    }
  }


  private onButtonClick() {
    const node = this.editor?.selection.getNode();
    if (node?.hasAttribute(this.VARIABLE_ATTR_NAME)) {
      const text = this.editor?.selection.getContent({ format: "text" });
      if (text) {
        this.editor?.selection.setContent(text);
        node.remove();
      }
      return;
    }
    this.editor?.fire("insert_variable_click");
  }

  private onExportVariables(
    factory: (data: Record<string, IVariableType>) => void
  ) {
    const report = this.exportVariable();
    factory(report);
    this.editor?.fire("variable_export", report);
  }

  private exportVariable(): Record<string, IVariableType> {
    const report: Record<string, IVariableType> = {};
    const document = this.editor?.getDoc() as Document;
    const elements = document.querySelectorAll(
      `[${this.VARIABLE_ATTR_NAME}]`
    );
    for (const item of elements) {
      const variableName = item.getAttribute(this.VARIABLE_ATTR_NAME);
      if (!variableName) continue;
      if (Object.keys(report).includes(variableName)) continue;
      const isRequired = item.getAttribute(this.REQUIRED_VAR_ATTR_NAME);
      report[variableName] = new VariableModel({
        isRequired: isRequired === 'true',
        title: variableName,
        variableName,
        variableType: 'boolean'
      });
    }
    return report;
  }

  onLoadUi = () => import('./ui/variable.component').then(response => ({ default: response.VariableModal }));

  private onVariableInsert(data: VariableModel) {
    console.log(data);
    const value = this.editor?.selection.getContent({ format: "text" });
    if (!value) {
      return;
    }

    this.editor?.selection.setContent(
      `<mdd data-title='${value}' class='variable-container ${data.isRequired ? "variable-required" : ""
      }' title='${data.title}' ${this.TYPE_ATTR_NAME}='${data.variableType}' ${this.VARIABLE_ATTR_NAME
      }='${data.variableName}' ${this.REQUIRED_VAR_ATTR_NAME
      }='${data.isRequired}'>${value}</mdd>${EMPTY_VALUE}`
    );

    variablesState.emitState(data);

    if (this._metadata) {
      this._metadata.metadata = {
        ...(this._metadata.metadata || {}),
        [data.variableName]: data
      };
    }
  }
}
