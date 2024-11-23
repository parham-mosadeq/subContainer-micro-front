import { PluginFactory } from '@medad-mce/core';
import { EMPTY_VALUE, MetadataHelper } from '@medad-mce/utils';

import { BUTTONS, COMMANDS } from './conditions.constants';
import { setOnConditionDialogOpen } from './events/conditional-rendering.events.ts';
import { ConditionalMetadataType, ConditionType } from './types/conditional-rendering.types';


export class ConditionPlugin extends PluginFactory {
  constructor() {
    super('conditions', {
      name: 'conditions',
    });
  }

  private _metadata?: MetadataHelper<ConditionalMetadataType>;

  protected onModulesInitiated() {
    if (this.editor) {
      this._metadata = new MetadataHelper(this.editor, this.pluginName);
    }
  }

  override onLoadUi = () => import('./ui');

  override onInit(): void {
    this.editor?.ui.registry.addButton(BUTTONS.insert, {
      onAction: () => {
        this.onButtonClick();
      },
      text: 'conditional rendering',
    });

    this.activateEvents();
  }

  private onNewConditionSet(condition: ConditionType) {
    if (!this._metadata) return;

    this._metadata.metadata = {
      ...this._metadata.metadata,
      [condition.instanceId]: condition,
    };
  }

  private activateEvents() {
    this.editor?.addCommand(COMMANDS.insert, (_, data: ConditionType) => {
      this.onNewConditionSet(data);
    });
  }

  private onButtonClick() {
    const selection = this.selection?.getContent({ format: 'html' });

    const instanceId = Date.now().toString(16);


    this.selection?.setContent(`
      <div id="${instanceId}" class='condtional-section'> ${selection} </div>
      <div class="line-wrapper">${EMPTY_VALUE}</div>
    `);


    setOnConditionDialogOpen({
      instanceId,
    });
  }
}
