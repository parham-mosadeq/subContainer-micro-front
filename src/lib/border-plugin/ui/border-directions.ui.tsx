import { useState } from "react";
import { Directions } from "../types/directions.type";
import { BorderDirectionsPropsType } from "../types/props.type";

export function BorderDirections(props: BorderDirectionsPropsType) {
  const [directions, setDirections] = useState<Directions[]>(
    props.defaultDirections || []
  );

  const setDirectionsMiddleware = (directions: Directions[]) => {
    setDirections(directions);
    if (props.onChange) {
      props.onChange(directions);
    }
  };

  const append = (direction: Directions) => () => {
    if (directions.includes(direction)) {
      const clone = [...directions];
      const index = clone.indexOf(direction);
      clone.splice(index, 1);
      setDirectionsMiddleware(clone);
      return;
    }
    setDirectionsMiddleware([...directions, direction]);
  };

  const overrideDirections = (direction: Directions[]) => () => {
    setDirectionsMiddleware(direction);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <button
          className={`rounded-md shadow-md ${directions.includes("left") ? "bg-gray-400" : ""
            }`}
          onClick={append("left")}
        >
          <div className="border-l-2 border-black p-3"></div>
        </button>
        <button
          className={`rounded-md shadow-md ${directions.includes("right") ? "bg-gray-400" : ""
            }`}
          onClick={append("right")}
        >
          <div className="border-r-2 border-black p-3"></div>
        </button>
        <button
          className={`rounded-md shadow-md ${directions.includes("top") ? "bg-gray-400" : ""
            }`}
          onClick={append("top")}
        >
          <div className="border-t-2 border-black p-3"></div>
        </button>
        <button
          className={`rounded-md shadow-md ${directions.includes("bottom") ? "bg-gray-400" : ""
            }`}
          onClick={append("bottom")}
        >
          <div className="border-b-2 border-black p-3"></div>
        </button>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <button
          onClick={overrideDirections(["left", "right"])}
          className="rounded-md shadow-md"
        >
          <div className="border-l-2 border-r-2 border-black p-3"></div>
        </button>
        <button
          className="rounded-md shadow-md"
          onClick={overrideDirections(["top", "bottom"])}
        >
          <div className="border-t-2 border-b-2 border-black p-3"></div>
        </button>
        <button
          className="rounded-md shadow-md"
          onClick={overrideDirections(["left", "right", "bottom", "top"])}
        >
          <div className="border-2 border-black p-3"></div>
        </button>
      </div>
    </div>
  );
}
