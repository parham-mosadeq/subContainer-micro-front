import { Padding } from "../models/padding.model"

export type PaddingMeasurementUnits = "mm" | "cm" | "inch";

export type PaddingOpenSignalPayload = {
  defaultValue?: Padding,
}

export type InsertPaddingPayload = {
  unit: PaddingMeasurementUnits,
  padding: Padding,
}