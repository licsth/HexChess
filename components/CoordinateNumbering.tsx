import { range } from "lodash";
import { FunctionComponent } from "react";
import { xCoordinateLetter } from "../types/position";

interface Props {
  rowOffset: number;
  columnOffset: number;
}

export const CoordinateNumbering: FunctionComponent<Props> = ({
  rowOffset,
  columnOffset,
}) => {
  return (
    <>
      {range(11).map((x) => {
        const rowIndex = Math.max(0, x - 5);
        return (
          <div
            className="absolute text-white"
            style={{
              top: `${(rowIndex + x) * rowOffset - rowOffset / 3}px`,
              marginLeft: `${(x - rowIndex) * columnOffset + columnOffset * 5 + 2 * rowOffset}px`,
            }}
            key={x}
          >
            {xCoordinateLetter(x)}
          </div>
        );
      })}
      {range(11).map((i) => {
        const x = Math.min(10, 5 + i);
        const rowIndex = Math.min(10, 15 - i);
        return (
          <div
            className="absolute text-white"
            style={{
              top: `${(rowIndex + x) * rowOffset + columnOffset + 4}px`,
              marginLeft: `${(x - rowIndex) * columnOffset + columnOffset * 5 + rowOffset - 5}px`,
            }}
            key={i}
          >
            {i + 1}
          </div>
        );
      })}
    </>
  );
};
