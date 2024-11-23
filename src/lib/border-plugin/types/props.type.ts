import { Border } from "../models/border.model";
import { Directions } from "./directions.type";

export type BorderDirectionsPropsType = {
  onChange?(directions: Directions[]): void;
  defaultDirections?: Directions[]
};

export type BorderDetailType = { type: string, color: string, height: number };

export type BorderDetailsPropsType = {
  borderRef?: Border;
  onChange?(data: BorderDetailType): void;
  defaultValue?: BorderDetailType;
}
