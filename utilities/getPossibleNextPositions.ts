import { Position, PositionedPiece } from "../components/Gameboard";
import { PieceColor } from "../types/ChessPiece";
import { possibleMoves } from "../types/possibleMoves";

/**
 * Returns the possible next positions for a given piece
 * @param selectedPiece The piece to get the next moves for
 * @param whitePieces Current white pieces on the board
 * @param blackPieces Current black pieces on the board
 */
export function getPossibleNextPositions(selectedPiece: PositionedPiece, whitePieces: PositionedPiece[], blackPieces: PositionedPiece[]): Position[] {
  const moves = possibleMoves[selectedPiece.type];
  const sign = selectedPiece.color === PieceColor.WHITE ? 1 : -1;
  const res: Position[] = [];
  const ownPieces =
    selectedPiece.color === PieceColor.WHITE ? whitePieces : blackPieces;
  const otherPlayerPieces =
    selectedPiece.color === PieceColor.WHITE ? blackPieces : whitePieces;
  for (const moveList of moves) {
    for (const move of moveList) {
      const x = selectedPiece.x + sign * move.x;
      const y = selectedPiece.y + sign * move.y;
      const opponentOnField = otherPlayerPieces.some(
        (piece) => piece.x === x && piece.y === y
      );
      if (
        move.constraint &&
        !move.constraint(selectedPiece, selectedPiece.color, opponentOnField)
      )
        break;
      if (ownPieces.some((piece) => piece.x === x && piece.y === y)) {
        break;
      }
      res.push({
        x,
        y,
      });
      if (opponentOnField) {
        break;
      }
    }
  }
  return res;
}