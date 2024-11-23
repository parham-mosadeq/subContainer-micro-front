import React, { useEffect, useRef, useState } from 'react';
import { PluginUiProps } from '@medad-mce/core';
import { Modal } from '@medad-mce/components';

import { IVariableType } from '../../variable-plugin/types';
import { COMMANDS } from '../conditions.constants';
import './conditional-rendering.styles.css';
import { ConditionEquality, ConditionType } from '../types/conditional-rendering.types.ts';
import { onConditionDialogOpen } from '../events/conditional-rendering.events.ts';

export function ConditionalRenderingModal(props: PluginUiProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [variablesList, setVariablesList] = useState<string[]>([]);
  const instanceId = useRef<string>();

  const onFetchLists = () => {
    setVariablesList((vars) => {
      return [...vars, ...variablesList];
    });
  };

  const onFetchVariables = (list: Record<string, IVariableType>) => {
    setVariablesList([...variablesList, ...Object.keys(list)]);
    props.editor?.execCommand("get_lists", false, onFetchLists);
  };

  useEffect(() => {
    const sub = onConditionDialogOpen.subscribe({
      next: (data) => {
        if (isOpen) return;
        instanceId.current = data.instanceId;
        props.editor?.execCommand("export_variables", false, onFetchVariables);
        setIsOpen(true);
      }
    })

    return () => sub.unsubscribe();
  }, [0]);

  const onClose = (event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (event)
      event.preventDefault();
    setIsOpen(false);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ConditionType = {
      instanceId: instanceId.current || "",
      paramName: event.currentTarget.paramName.value,
      isShow: event.currentTarget.isShow.value === 'on',
      conditionValue: event.currentTarget.conditionValue.value,
      equality: event.currentTarget.equality.value as ConditionEquality
    };
    props.editor?.execCommand(COMMANDS.insert, false, payload);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} >
      {!variablesList.length ? (
        <>
          <p className="cant-process">متغیری وجود ندارد</p>
        </>
      ) : (
        <form method="#" onSubmit={onSubmit}>
          <figure>
            <select name="paramName">
              {variablesList.map((item: string, index: number) => (
                <option
                  key={`${item}-${index}-conditional-rendering-variables-list`}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </figure>
          <figure>
            <select name="equality">
              <option value={"=="}>مساوی</option>
              <option value={"!="}>نا مساوی</option>
            </select>
          </figure>
          <figure>
            <input type="text" name="conditionValue" placeholder="مقدار..." />
          </figure>
          <figure>
            <label htmlFor="conditional-rendering-isShow"> نمایش </label>
            <input
              type="checkbox"
              id="conditional-rendering-isShow"
              name="isShow"
            />
          </figure>
          <figure>
            <button type="submit">ثبت</button>
            <button onClick={() => onClose()} type="reset">انصراف</button>
          </figure>
        </form>
      )}
    </Modal>
  );
}
