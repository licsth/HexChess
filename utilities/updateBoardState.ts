import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";

export function updateBoardState(selectedPiece: PositionedPiece, targetPosition: Position, pieces: PositionedPiece[]) {
  const isWhitePromotionField = targetPosition.x === 0 || targetPosition.y - targetPosition.x === 5;
  const isBlackPromotionField = targetPosition.x - targetPosition.y === 5 || targetPosition.x === 10;
  // remove the piece from its current position
  let newPieces = pieces.filter(
    (piece) =>
      piece.x !== selectedPiece.x ||
      piece.y !== selectedPiece.y
  );
  // remove captured piece
  const capture = pieces.some(
    (piece) =>
      piece.x === targetPosition.x && piece.y === targetPosition.y && piece.color !== selectedPiece.color
  );
  newPieces = newPieces.filter(
    (piece) =>
      !(piece.x === targetPosition.x && piece.y === targetPosition.y && piece.color !== selectedPiece.color)
  );
  // add piece to new position
  newPieces.push({
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

  return { newPieces, capture }
}