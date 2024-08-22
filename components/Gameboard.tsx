import { FunctionComponent, useEffect, useState } from "react";
import { range } from "lodash";
import { Hex } from "./Hex";
import useWindowDimensions, { Breakpoints } from "../hooks/useWindowDimensions";
import { ChessPiece } from "../types/ChessPiece";
import { blackStartPosition, whiteStartPosition } from "../types/startPosition";

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

  const { width } = useWindowDimensions();

  const rowOffset = width > Breakpoints.SM ? 30 : 20;
  const columnOffset = width > Breakpoints.SM ? 51 : 34;

  const [whitePieces, setWhitePieces] = useState<
    {
      type: ChessPiece;
      x: number;
      y: number;
    }[]
  >(whiteStartPosition);

  const [blackPieces, setBlackPieces] = useState<
    {
      type: ChessPiece;
      x: number;
      y: number;
    }[]
  >(blackStartPosition);

  return (
    <div className="grid justify-center content-center h-screen bg-slate-800 overflow-hidden relative justify-items-center">
      <div className="relative w-[374px] sm:w-[560px] h-[440px] sm:h-[660px]">
        {rows.map((rowLength, rowIndex) => (
          <div key={rowIndex}>
            {range(rowLength).map((i) => {
              const x = i + (rowIndex > 5 ? 11 - rowLength : 0);
              const y = x - rowIndex + 5;
              const whitePiece = whitePieces.find(
                (piece) => piece.x === x && piece.y === y
              );
              const blackPiece = blackPieces.find(
                (piece) => piece.x === x && piece.y === y
              );
              return (
                <div
                  style={{
                    position: "absolute",
                    top: `${(rowIndex + i + (rowIndex > 5 ? 11 - rowLength : 0)) * rowOffset}px`,
                    marginLeft: `${(i + (rowIndex > 5 ? 11 - rowLength : 0) - rowIndex) * columnOffset + columnOffset * 5}px`,
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
                    piece={
                      whitePiece
                        ? { type: whitePiece.type, color: "white" }
                        : blackPiece
                          ? { type: blackPiece.type, color: "black" }
                          : undefined
                    }
                  >
                    {/* {piece?.type === ChessPiece.PAWN && "P"}
                    {piece?.type === ChessPiece.ROOK && "R"}
                    {piece?.type === ChessPiece.KNIGHT && "N"}
                    {piece?.type === ChessPiece.BISHOP && "B"}
                    {piece?.type === ChessPiece.QUEEN && "Q"}
                    {piece?.type === ChessPiece.KING && "K"} */}
                    {/* {x} {y} */}
                  </Hex>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex sm:flex-col sm:absolute right-0 top-0 gap-y-10 pt-5 pr-8 flex-wrap sm:flex-nowrap gap-x-5 justify-center">
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
    </div>
  );
};
