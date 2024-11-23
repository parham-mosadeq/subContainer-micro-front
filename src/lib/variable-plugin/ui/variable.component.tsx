import React, { useEffect, useState } from "react";
import { PluginUiProps } from "@medad-mce/core";

import "./variable.styles.css";
import { variablesState } from "../states/variables.store";
import { IVariableType } from "../types";
import { VariableModel } from "../models/variable.model";
import { VariableTypes } from "../types/variable-plugin.type";

export function VariableModal(props: PluginUiProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVariable, setSelectedVariable] = useState<string>("__null");
  const [variables, setVariables] = useState<Record<string, IVariableType>>({});

  const onClose = () => {
    setSelectedVariable("__null");
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsOpen(true);
    setVariables(variablesState.state);
  };

  useEffect(() => {
    props.editor?.on("insert_variable_click", onOpen);

    return () => {
      props.editor?.off("insert_variable_click");
      setIsOpen(false);
    };
  }, [props.editor]);

  const createVariable = (variableModel: VariableModel) => {
    props.editor?.execCommand(
      "export_variables",
      false,
      (response: Record<string, IVariableType>) => {
        setVariables(response);
      }
    );
    props.editor?.execCommand("insert_variable", false, variableModel);
  };

  const createVariableReference = (variableKey: string) => {
    const { isRequired } = variables[variableKey];
    props.editor?.execCommand("insert_variable", false, {
      variableName: variableKey,
      isRequired: `${isRequired}`,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedVariable !== "__null") {
      createVariableReference(selectedVariable);
      onClose();
      return;
    }

    const variableName = event.currentTarget["variable_name"].value;
    const isRequired = event.currentTarget["is_required"].checked;
    const variableType = event.currentTarget["variableType"]
      .value as VariableTypes;

    createVariable(
      new VariableModel({
        isRequired,
        title: variableName,
        variableName,
        variableType,
      })
    );
    onClose();
  };

  const onVariableSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const variableName = event.currentTarget.value;
    setSelectedVariable(variableName);
  };

  if (!isOpen) return <></>;
  return (
    <div className="variable-modal-container">
      <div className="variable-modal-box">
        <h3>متغیر جدید</h3>
        <form action="#" onSubmit={onSubmit}>
          {variables && (
            <div>
              <select className="select-box" onChange={onVariableSelect}>
                <option value={"__null"}>هیچکدام</option>
                {Object.keys(variables).map((item, index) => (
                  <option value={item} key={`${item}-${index}`}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedVariable === "__null" ? (
            <>
              <div>
                <input
                  type="text"
                  name="variable_name"
                  required
                  placeholder="نام متغیر "
                />
              </div>
              <div dir="rtl">
                <label htmlFor="">نوع متغیر</label>
                <select
                  className="select-box"
                  defaultValue={"string"}
                  name="variableType"
                >
                  <option value={"string"}>متنی</option>
                  <option value={"number"}>عددی</option>
                  <option value={"boolean"}>بولی</option>
                </select>
              </div>
              <div className="checkbox">
                <label htmlFor="is_req">ضروری</label>
                <input
                  id="is_req"
                  type="checkbox"
                  name="is_required"
                  defaultChecked={false}
                />
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="action-bar" dir="rtl">
            <button type="submit">تایید !</button>
            <button type="reset" onClick={onClose}>
              ببند
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
