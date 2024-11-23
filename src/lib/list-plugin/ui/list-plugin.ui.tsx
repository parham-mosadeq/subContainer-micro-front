import React, { useEffect, useState } from "react";
import { PluginUiProps } from "@medad-mce/core";
import "./list-modal.styles.css";
import { COMMANDS, EVENTS } from "../constants/list-plugin.constants";

export default function ListPluginUi(props: PluginUiProps) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    props.editor?.on(EVENTS.insert, () => {
      setIsOpen(true);
    });
  }, []);

  const stopPropagation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const separator = event.currentTarget.listSeparator.value;
    const name = event.currentTarget.listName.value;

    props.editor?.execCommand(COMMANDS.insert, false, {
      separator,
      name,
    });

    onClose();
  };

  if (!isOpen) return <></>;
  return (
    <div className="list-modal-container" onClick={onClose}>
      <div className="list-modal-box" onClick={stopPropagation}>
        <form onSubmit={onFormSubmit}>
          <div>
            <input
              type="text"
              name="listName"
              required
              placeholder="نام متغیر "
            />
          </div>
          <div>
            <input type="text" name="listSeparator" placeholder="جدا کننده" />
          </div>
          <div>
            <button type="submit">بساز !</button>
            <button type="reset" onClick={onClose}>
              ببند
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
