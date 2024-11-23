import React, { useEffect, useState } from "react";
import { Button, Modal } from "@medad-mce/components";
import MeasurementInput from "./components/measurement-input.component";
import { Padding } from "../models/padding.model";
import { paddingOpen$ } from "../events/padding-plugin.events";
import {
  InsertPaddingPayload,
  PaddingOpenSignalPayload,
} from "../types/padding.types";
import { PluginUiProps } from "@medad-mce/core";

export default function PaddingUi(props: PluginUiProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [defaultPadding, setDefaultPadding] = useState<Padding | null>(null);

  const [isXAxisLinked, setIsXAxisLinked] = useState<boolean>(false);
  const [isYAxisLinked, setIsYAxisLinked] = useState<boolean>(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = (value: PaddingOpenSignalPayload) => {
    if (isOpen) return;
    setIsOpen(true);
    setDefaultPadding(value.defaultValue || null);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const padding = Padding.createFromFormEvent(event);

    if (isXAxisLinked) {
      padding.left = event.currentTarget.xAxis.value as number;
      padding.right = event.currentTarget.xAxis.value as number;
    }

    if (isYAxisLinked) {
      padding.bottom = event.currentTarget.yAxis.value as number;
      padding.top = event.currentTarget.yAxis.value as number;
    }

    onClose();
    const payload: InsertPaddingPayload = {
      padding,
      unit: "mm",
    };
    props.editor?.execCommand("insert_padding", false, payload);
  };

  const onInputChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name;
    const inputState = event.currentTarget.checked;

    if (inputName === "xAxisLinked") {
      setIsXAxisLinked(inputState);
      return;
    }

    if (inputName === "yAxisLinked") {
      setIsYAxisLinked(inputState);
    }
  };

  useEffect(() => {
    const subscription = paddingOpen$.subscribe({
      next: onOpen,
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Modal onClose={onClose} open={isOpen}>
      <form className="flex flex-col gap-5" action="#" onSubmit={onSubmit}>
        <figure className="flex flex-col">
          <figure className="flex">
            <label htmlFor="padding-link-axis-y"> یک تناسب </label>
            <input
              id="padding-link-axis-y"
              type="checkbox"
              onChange={onInputChecked}
              name="yAxisLinked"
              checked={isYAxisLinked}
            />
          </figure>

          {isYAxisLinked ? (
            <>
              <MeasurementInput
                defaultValue={defaultPadding?.top}
                dir="rtl"
                label="محور عمودی"
                name="yAxis"
                unit="mm"
              />
            </>
          ) : (
            <>
              <MeasurementInput
                defaultValue={defaultPadding?.top}
                dir="rtl"
                label="بالا"
                name="top"
                unit="mm"
              />
              <MeasurementInput
                defaultValue={defaultPadding?.bottom}
                dir="rtl"
                label="پایین"
                name="bottom"
                unit="mm"
              />
            </>
          )}
        </figure>

        <figure className="flex flex-col">
          <figure className="flex">
            <label htmlFor="padding-link-axis-x"> یک تناسب </label>
            <input
              id="padding-link-axis-x"
              onChange={onInputChecked}
              name="xAxisLinked"
              type="checkbox"
              checked={isXAxisLinked}
            />
          </figure>

          {isXAxisLinked ? (
            <>
              <MeasurementInput
                defaultValue={defaultPadding?.left}
                dir="rtl"
                label="محور افقی"
                name="xAxis"
                unit="mm"
              />
            </>
          ) : (
            <>
              <MeasurementInput
                defaultValue={defaultPadding?.left}
                dir="rtl"
                label="چپ"
                name="left"
                unit="mm"
              />
              <MeasurementInput
                defaultValue={defaultPadding?.right}
                dir="rtl"
                label="راست"
                name="right"
                unit="mm"
              />
            </>
          )}
        </figure>
        <figure className="flex flex-row-reverse gap-x-5">
          <Button variant="primary" type="submit">
            ثبت
          </Button>
          <Button variant="secondary" type="reset" onClick={onClose}>
            بستن
          </Button>
        </figure>
      </form>
    </Modal>
  );
}
