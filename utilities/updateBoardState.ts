import { Position, PositionedPiece } from "../components/Gameboard";
import { ChessPiece } from "../types/ChessPiece";

export function updateBoardState(selectedPiece: PositionedPiece, targetPosition: Position, currentPlayerPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[]) {
  const isEndOfBoard =
    targetPosition.x === 0 || targetPosition.x - targetPosition.y === 5 || targetPosition.y - targetPosition.x === 5 || targetPosition.x === 10;
  // move the piece
  const newCurrentPlayerPIeces = currentPlayerPieces.filter(
    (piece) =>
      piece.x !== selectedPiece.x ||
      piece.y !== selectedPiece.y
  );
  newCurrentPlayerPIeces.push({
    ...selectedPiece,
    type:
      selectedPiece.type === ChessPiece.PAWN &&
        isEndOfBoard
        ? ChessPiece.QUEEN
        : selectedPiece.type,
    x: targetPosition.x,
    y: targetPosition.y,
  });
  return [newCurrentPlayerPIeces, otherPlayerPieces.filter((piece) => piece.x !== targetPosition.x || piece.y !== targetPosition.y)]
}