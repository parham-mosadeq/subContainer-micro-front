import { Directions } from "./directions.type";

export interface IBorder {
  height: number;
  color: string;
  directions: Directions[];
  type: string;
}