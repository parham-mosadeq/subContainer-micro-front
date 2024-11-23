import { ShapePropertyType, ShapeVisualType } from "./shape.type";

type BasicComponentProps<T> =  {
    onClose?(): void;
    onSubmit?(data: T): void;
};

export type ShapesPropertyProps = BasicComponentProps<ShapePropertyType>;
export type ShapesVisualProps = BasicComponentProps<ShapeVisualType>;
