import { FunctionComponent, useEffect, useState } from "react";
import { range } from "lodash";
import React from "react";
import { Hex } from "./Hex";

const rows = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];
const variantRotation = [200, 400, 600];
const tailwindColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
  "slate",
];

export const Gameboard: FunctionComponent = ({}) => {
  const [color, setColor] = useState("slate");

  return (
    <div className="grid justify-center content-center h-screen bg-slate-800 overflow-hidden relative">
      <div className="relative w-[560px] h-[660px]">
        {rows.map((rowLength, rowIndex) => (
          <div key={rowIndex}>
            {range(rowLength).map((i) => (
              <div
                style={{
                  position: "absolute",
                  top: `${(rowIndex + i + (rowIndex > 5 ? 11 - rowLength : 0)) * 30}px`,
                  marginLeft: `${(i + (rowIndex > 5 ? 11 - rowLength : 0) - rowIndex) * 51 + 255}px`,
                }}
                key={i}
              >
                <Hex
                  variant={
                    variantRotation[
                      (rowIndex + i + (rowIndex > 5 ? 11 - rowLength : 0)) % 3
                    ]
                  }
                  color={color}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col absolute right-0 top-0 gap-y-10 pt-5 pr-8">
        {tailwindColors.map((color) => (
          <div key={color} className="" onClick={() => setColor(color)}>
            <Hex variant={400} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
};
