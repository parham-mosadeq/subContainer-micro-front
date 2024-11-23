import React from "react";

export class Padding {
  constructor(
    public top: number,
    public bottom: number,
    public left: number,
    public right: number
  ) { }

  valueOf() {
    return {
      top: this.top,
      left: this.left,
      bottom: this.bottom,
      right: this.right,
    };
  }

  toCssProperty(unit?: string) {
    return `${this.top}${unit} ${this.right}${unit} ${this.bottom}${unit} ${this.left}${unit}`;
  }

  static createFromObjectStruct(struct: Record<'top' | 'bottom' | 'right' | 'left', number>) {
    return new Padding(
      struct.top,
      struct.bottom,
      struct.left,
      struct.right
    )
  }

  static createDefault() {
    return new Padding(0, 0, 0, 0)
  }

  static createFromFormEvent(formEvent: React.FormEvent<HTMLFormElement>) {
    return new Padding(
      formEvent.currentTarget.top?.value as number || 0,
      formEvent.currentTarget.bottom?.value as number || 0,
      formEvent.currentTarget.left?.value as number || 0,
      formEvent.currentTarget.right?.value as number || 0,
    )
  }
}