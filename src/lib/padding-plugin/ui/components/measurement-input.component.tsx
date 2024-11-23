import { PaddingMeasurementUnits } from "../../types/padding.types";

type MeasurementPropsType = {
  unit: PaddingMeasurementUnits;
  name: string;
  label: string;
  defaultValue?: number;
  dir?: "rtl" | "ltr";
};

export default function MeasurementInput(props: MeasurementPropsType) {
  return (
    <figure className="flex flex-col">
      <label
        dir={props.dir || "ltr"}
        className={`${
          (props.dir || "ltr") === "ltr" ? "text-left" : "text-right"
        }`}
      >
        {props.label} :{" "}
      </label>
      <figure className="flex items-center justify-center gap-4">
        <input
          defaultValue={props.defaultValue || 0}
          type="number"
          name={props.name}
        />
        <p>{props.unit || "mm"}</p>
      </figure>
    </figure>
  );
}
