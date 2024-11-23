import { IBorder } from "../types/border.interface";
import { Directions } from "../types/directions.type";

export class Border implements IBorder {
  constructor() { }

  height: number = 0;
  color: string = 'transparent';
  directions: Directions[] = [];
  type: string = '';


  valueOf(): IBorder {
    return {
      height: this.height,
      color: this.color,
      directions: this.directions,
      type: this.type
    }
  }

  toCssValue() {
    return `${this.height}px ${this.type} ${this.color}`;
  }

  static fromObject(border: IBorder) {
    const newBorder = new Border();
    newBorder.color = border.color;
    newBorder.directions = border.directions || [];
    newBorder.type = border.type;
    newBorder.height = border.height;
    return newBorder;
  }

}