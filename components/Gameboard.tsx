import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { range, sum } from "lodash";
import { Hex } from "./Hex";
import useWindowDimensions, { Breakpoints } from "../hooks/useWindowDimensions";
import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { blackStartPosition, whiteStartPosition } from "../types/startPosition";
import { getPossibleNextPositions } from "../utilities/getPossibleNextPositions";
import { getNextBotMove } from "../botLogic.ts/nextMove";
import { updateBoardState } from "../utilities/updateBoardState";
import { PositionedPiece } from "../types/positionedPiece";
import { TailwindColor, tailwindColors } from "../types/tailwindColor";
import {
  getAccentColorForBoardColor,
  getTrailColorForBoardColor,
} from "../utilities/getAccentForBoardColor";
import { ColorSelection } from "./ColorSelection";
import { Position, xCoordinateLetter } from "../types/position";
import { MoveHistory } from "../types/moveHistory";
import { MoveHistoryDisplay } from "./MoveHistory";

const rows = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];
const variantRotation = [200, 400, 600];
const showCoordinateGrid = false;
const botDelay = 300; // delay of bot's move in ms (so that you can see what it does)

export const Gameboard: FunctionComponent = ({}) => {
  const [color, setColor] = useState<TailwindColor>("slate");
  const [isPlayingAgainstBot, setIsPlayingAgainstBot] = useState(true);
  const accentColor = useMemo(
    () => getAccentColorForBoardColor(color),
    [color]
  );
  const trailColor = useMemo(() => getTrailColorForBoardColor(color), [color]);
  const [trailFields, setTrailFields] = useState<Position[]>([]);

  const { width } = useWindowDimensions();
  const [currentPlayer, setCurrentPlayer] = useState(PieceColor.WHITE);

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

  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([]);

  const possibleNextPositions = useMemo(() => {
    if (!selectedPiece) return [];
    return getPossibleNextPositions(
      selectedPiece,
      whitePieces.concat(blackPieces)
    );
  }, [selectedPiece]);

  useEffect(() => {
    console.log(
      "Number of legal next moves:",
      sum(
        (currentPlayer === PieceColor.WHITE ? whitePieces : blackPieces).map(
          (piece) =>
            getPossibleNextPositions(piece, whitePieces.concat(blackPieces))
              .length
        )
      )
    );
  }, [currentPlayer]);

  function playPosition(x: number, y: number) {
    if (!selectedPiece) return;
    const [currentPlayerPieces, setCurrentPlayerPieces] =
      selectedPiece?.color === PieceColor.WHITE
        ? [whitePieces, setWhitePieces]
        : [blackPieces, setBlackPieces];
    const [otherPlayerPieces, setOtherPlayerPieces] =
      selectedPiece?.color === PieceColor.WHITE
        ? [blackPieces, setBlackPieces]
        : [whitePieces, setWhitePieces];
    let {
      newCurrent: newCurrentPlayerPieces,
      newOther: newOtherPlayerPieces,
      capture,
    } = updateBoardState(
      selectedPiece,
      { x, y },
      currentPlayerPieces,
      otherPlayerPieces
    );
    setMoveHistory((moveHistory) => [
      ...moveHistory,
      {
        from: { x: selectedPiece.x, y: selectedPiece.y },
        to: { x, y },
        color: selectedPiece.color,
        pieceType: selectedPiece.type,
        capture,
        check: false, // TODO
      },
    ]);
    setSelectedPiece(null);
    setCurrentPlayerPieces(newCurrentPlayerPieces);
    setOtherPlayerPieces(newOtherPlayerPieces);
    // switch player or let bot move
    // TODO: bot can only be black currently
    if (isPlayingAgainstBot) {
      setTimeout(() => {
        const [botSelectedPiece, botTargetPosition] = getNextBotMove(
          newOtherPlayerPieces.concat(newCurrentPlayerPieces),
          PieceColor.BLACK
        );

        setTrailFields([botTargetPosition, botSelectedPiece]);
        const updatedBoardState = updateBoardState(
          botSelectedPiece,
          botTargetPosition,
          newOtherPlayerPieces,
          newCurrentPlayerPieces
        );
        newOtherPlayerPieces = updatedBoardState.newCurrent;
        newCurrentPlayerPieces = updatedBoardState.newOther;

        setMoveHistory((moveHistory) => [
          ...moveHistory,
          {
            from: { x: botSelectedPiece.x, y: botSelectedPiece.y },
            to: botTargetPosition,
            color: botSelectedPiece.color,
            pieceType: botSelectedPiece.type,
            capture: updatedBoardState.capture,
            check: false, // TODO
          },
        ]);
        setCurrentPlayerPieces(newCurrentPlayerPieces);
        setOtherPlayerPieces(newOtherPlayerPieces);
      }, botDelay);
    } else
      setCurrentPlayer((currentPlayer) =>
        currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE
      );
  }

  return (
    <div className="grid justify-center content-center h-screen bg-slate-800 overflow-hidden relative justify-items-center font-mono">
      {width > Breakpoints.MD && (
        <MoveHistoryDisplay moveHistory={moveHistory} />
      )}
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
              const piece = whitePiece || blackPiece || null;
              const isSelected =
                selectedPiece?.x === x && selectedPiece?.y === y;
              const isPossibleNextPosition = possibleNextPositions.some(
                (position) => position.x === x && position.y === y
              );
              const isTrail = trailFields.some(
                (position) => position.x === x && position.y === y
              );
              return (
                <div
                  style={{
                    position: "absolute",
                    top: `${(rowIndex + x) * rowOffset}px`,
                    marginLeft: `${(x - rowIndex) * columnOffset + columnOffset * 5}px`,
                  }}
                  onClick={() => {
                    if (!isPossibleNextPosition || !selectedPiece)
                      setSelectedPiece(
                        currentPlayer === piece?.color ? piece : null
                      );
                    else {
                      playPosition(x, y);
                    }
                  }}
                  key={i}
                >
                  <Hex
                    variant={
                      isSelected
                        ? 600
                        : isPossibleNextPosition || isTrail
                          ? 400
                          : variantRotation[
                              (rowIndex +
                                i +
                                (rowIndex > 5 ? 11 - rowLength : 0)) %
                                3
                            ]
                    }
                    color={
                      isSelected || isPossibleNextPosition
                        ? accentColor
                        : isTrail
                          ? trailColor
                          : color
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
                    {showCoordinateGrid ? `${x} ${rowIndex}` : ""}
                  </Hex>
                </div>
              );
            })}
          </div>
        ))}
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
      </div>
      <ColorSelection setColor={setColor} />
    </div>
  );
};
