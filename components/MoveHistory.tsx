import { FunctionComponent } from "react";
import { MoveHistory } from "../types/moveHistory";
import { pieceAbbreveation } from "../types/ChessPiece";
import { xCoordinateLetter } from "../types/position";

const limit = 15;

interface Props {
  moveHistory: MoveHistory[];
}

export const MoveHistoryDisplay: FunctionComponent<Props> = ({
  moveHistory,
}) => {
  return (
    <div className="absolute inset-0 p-8 text-white">
      {moveHistory.map((move, index) => {
        if (moveHistory.length - index > limit) return null;
        return (
          <div key={index} className="flex gap-2">
            <div>{index + 1}.</div>
            <div>
              {pieceAbbreveation(move.pieceType)}
              {xCoordinateLetter(move.from.x)}
              {move.from.y + 1}
              {move.capture ? "x" : "-"}
              {xCoordinateLetter(move.to.x)}
              {move.to.y + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};
