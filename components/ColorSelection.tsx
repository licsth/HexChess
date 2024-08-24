import { FunctionComponent } from "react";
import { TailwindColor, tailwindColors } from "../types/tailwindColor";
import { Hex } from "./Hex";

export const ColorSelection: FunctionComponent<{
  setColor: (c: TailwindColor) => void;
}> = ({ setColor }) => {
  return (
    <div className="flex sm:flex-col sm:absolute right-0 top-0 gap-y-10 pt-8 sm:pr-8 flex-wrap sm:flex-nowrap gap-x-5 justify-center">
      {tailwindColors.map((color) => (
        <div
          key={color}
          className="cursor-pointer"
          onClick={() => setColor(color)}
        >
          <Hex variant={400} color={color} />
        </div>
      ))}
    </div>
  );
};
