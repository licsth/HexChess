import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";

export function updateBoardState(selectedPiece: PositionedPiece, targetPosition: Position, currentPlayerPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[]) {
  const isWhitePromotionField = targetPosition.x === 0 || targetPosition.y - targetPosition.x === 5;
  const isBlackPromotionField = targetPosition.x - targetPosition.y === 5 || targetPosition.x === 10;
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
        (isWhitePromotionField && selectedPiece.color === PieceColor.WHITE
          || isBlackPromotionField && selectedPiece.color === PieceColor.BLACK)
        ? ChessPiece.QUEEN
        : selectedPiece.type,
    x: targetPosition.x,
    y: targetPosition.y,
  });
  return [newCurrentPlayerPIeces, otherPlayerPieces.filter((piece) => piece.x !== targetPosition.x || piece.y !== targetPosition.y)]
}