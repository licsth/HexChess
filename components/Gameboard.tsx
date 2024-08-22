import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { range } from "lodash";
import { Hex } from "./Hex";
import useWindowDimensions, { Breakpoints } from "../hooks/useWindowDimensions";
import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { blackStartPosition, whiteStartPosition } from "../types/startPosition";
import { possibleMoves } from "../types/possibleMoves";

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

interface Position {
  x: number;
  y: number;
}

interface PositionedPiece extends Position {
  type: ChessPiece;
  color: PieceColor;
}

export const Gameboard: FunctionComponent = ({}) => {
  const [color, setColor] = useState("slate");
  const accentColor = useMemo(() => {
    switch (color) {
      case "red":
        return "blue";
      case "slate":
        return "red";
      case "orange":
        return "blue";
      case "yellow":
        return "blue";
      case "green":
        return "red";
      case "teal":
        return "red";
      case "blue":
        return "red";
      case "indigo":
        return "red";
      case "purple":
        return "yellow";
      case "pink":
        return "blue";
    }
  }, [color]);

  const { width } = useWindowDimensions();

  const rowOffset = width > Breakpoints.SM ? 30 : 20;
  const columnOffset = width > Breakpoints.SM ? 51 : 34;

  const [whitePieces, setWhitePieces] = useState<PositionedPiece[]>(
    whiteStartPosition.map((piece) => ({ ...piece, color: PieceColor.WHITE }))
  );

  const [blackPieces, setBlackPieces] = useState<PositionedPiece[]>(
    blackStartPosition.map((piece) => ({ ...piece, color: PieceColor.BLACK }))
  );

  const [selectedPiece, setSelectedPiece] = useState<PositionedPiece | null>(
    null
  );

  const possibleNextPositions = useMemo(() => {
    if (!selectedPiece) return [];
    const moves = possibleMoves[selectedPiece.type];
    const sign = selectedPiece.color === PieceColor.WHITE ? 1 : -1;
    const res = [];
    const ownPieces =
      selectedPiece.color === PieceColor.WHITE ? whitePieces : blackPieces;
    const otherPlayerPieces =
      selectedPiece.color === PieceColor.WHITE ? blackPieces : whitePieces;
    for (const moveList of moves) {
      for (const move of moveList) {
        const x = selectedPiece.x + sign * move.x;
        const y = selectedPiece.y + sign * move.y;
        if (ownPieces.some((piece) => piece.x === x && piece.y === y)) {
          break;
        }
        res.push({
          x,
          y,
        });
        if (otherPlayerPieces.some((piece) => piece.x === x && piece.y === y)) {
          break;
        }
      }
    }
    return res;
  }, [selectedPiece]);

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
              const isSelected =
                selectedPiece?.x === x && selectedPiece?.y === y;
              const isPossibleNextPosition = possibleNextPositions.some(
                (position) => position.x === x && position.y === y
              );
              return (
                <div
                  style={{
                    position: "absolute",
                    top: `${(rowIndex + i + (rowIndex > 5 ? 11 - rowLength : 0)) * rowOffset}px`,
                    marginLeft: `${(i + (rowIndex > 5 ? 11 - rowLength : 0) - rowIndex) * columnOffset + columnOffset * 5}px`,
                  }}
                  onClick={() => {
                    if (!isPossibleNextPosition || !selectedPiece)
                      setSelectedPiece(whitePiece || blackPiece || null);
                    else {
                      const setCurrentPlayerPieces =
                        selectedPiece?.color === PieceColor.WHITE
                          ? setWhitePieces
                          : setBlackPieces;
                      const setOtherPlayerPieces =
                        selectedPiece?.color === PieceColor.WHITE
                          ? setBlackPieces
                          : setWhitePieces;
                      // move the piece
                      setCurrentPlayerPieces((pieces) => {
                        const newPieces = pieces.filter(
                          (piece) =>
                            piece.x !== selectedPiece.x ||
                            piece.y !== selectedPiece.y
                        );
                        newPieces.push({ ...selectedPiece, x, y });
                        setSelectedPiece(null);
                        return newPieces;
                      });
                      // remove other player's pieces on the new position
                      setOtherPlayerPieces((pieces) =>
                        pieces.filter((piece) => piece.x !== x || piece.y !== y)
                      );
                    }
                  }}
                  key={i}
                >
                  <Hex
                    variant={
                      isSelected
                        ? 600
                        : isPossibleNextPosition
                          ? 400
                          : variantRotation[
                              (rowIndex +
                                i +
                                (rowIndex > 5 ? 11 - rowLength : 0)) %
                                3
                            ]
                    }
                    color={
                      isSelected || isPossibleNextPosition ? accentColor : color
                    }
                    hoverColor={!isSelected}
                    piece={
                      whitePiece
                        ? { type: whitePiece.type, color: PieceColor.WHITE }
                        : blackPiece
                          ? { type: blackPiece.type, color: PieceColor.BLACK }
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
