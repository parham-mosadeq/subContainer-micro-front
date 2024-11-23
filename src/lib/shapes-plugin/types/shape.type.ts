import { Shapes } from "./shapes.enum";


export type ShapePropertyType = {
    shape: Shapes,
    scale: number,
    width: number,
    height: number,
}

export type ShapeVisualType = {
    backgroundColor: string; 
    border: {
        color: string,
        width: number,
    },
}

export type ShapeType = ShapePropertyType & Partial<ShapeVisualType>;
