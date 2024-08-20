import { FunctionComponent } from "react";
import { range } from "lodash";
import React from "react";
import { Hex } from "./Hex";

const rows = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];

export const Gameboard: FunctionComponent = ({}) => {
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
                <Hex />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
