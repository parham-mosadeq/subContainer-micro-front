import React, { useState } from "react";
import { BorderDetailsPropsType, BorderDetailType } from "../types/props.type";


export function BorderDetails(props: BorderDetailsPropsType) {
  const [color, setColor] = useState<string>('#000');

  const onEffect = (detail: BorderDetailType) => {
    if (props.borderRef) {
      props.borderRef.color = detail.color;
      props.borderRef.height = detail.height;
      props.borderRef.type = detail.type;
    }

    if (props.onChange) {
      props.onChange(detail);
    }
  };

  const convertTargetToModel = (
    currentTarget: EventTarget & HTMLFormElement
  ): BorderDetailType => {
    return {
      color: currentTarget["border-color"].value as string,
      height: +currentTarget["border-height"].value || 0,
      type: currentTarget["border-type"].value as string,
    };
  };

  const onSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    onEffect(convertTargetToModel(formEvent.currentTarget));
  };

  const onBlur = (
    blurEvent: React.FocusEvent<HTMLFormElement, HTMLElement>
  ) => {
    const borderDetails = convertTargetToModel(blurEvent.currentTarget);
    onEffect(borderDetails);
  };

  return (
    <form target="#" onBlur={onBlur} onSubmit={onSubmit}>
      <figure style={{ padding: "10px" }}>
        <label style={{
          padding: '3px 20px',
          backgroundColor: props.defaultValue?.color || color
        }} htmlFor="border-panel-color">

        </label>
        <input type="color" defaultValue={props.defaultValue?.color} style={{ opacity: '0' }} id="border-panel-color" name="border-color" onBlur={e => {
          setColor(e.currentTarget.value as string);
        }} />
      </figure>

      <figure>
        <input type="number" name="border-height" defaultValue={props.defaultValue?.height || 1} />
      </figure>

      <figure>
        <select name="border-type" defaultValue={props.defaultValue?.type}>
          <option value="solid">خط</option>
          <option value="dashed">خط چین</option>
          <option value="dotted">نقطه چین</option>
          <option value="double">دوتایی</option>
        </select>
      </figure>
    </form>
  );
}
