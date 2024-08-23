import { PieceColor } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { possibleMoves } from "../types/possibleMoves";

/**
 * Returns the possible next positions for a given piece
 * @param selectedPiece The piece to get the next moves for
 * @param whitePieces Current white pieces on the board
 * @param blackPieces Current black pieces on the board
 */
export function getPossibleNextPositions(selectedPiece: PositionedPiece, whitePieces: PositionedPiece[], blackPieces: PositionedPiece[], capturesOnly: boolean = false, ignoreFieldThreats: boolean = false): Position[] {
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
      // check field is on the board
      if (y > x + 5) continue;
      if (y > 10 || x > 10 || y < 0 || x < 0) continue;
      if (x > 5 && y < x - 5) continue;
      const opponentOnField =
        otherPlayerPieces.some(
          (piece) => piece.x === x && piece.y === y
        );
      // check field is threatened
      let fieldThreat = false;
      if (!ignoreFieldThreats) {
        const newOwnPieces = ownPieces.map((piece) =>
          piece.x === selectedPiece.x && piece.y === selectedPiece.y ? { ...piece, x, y } : piece
        );
        const newOtherPlayerPieces = otherPlayerPieces.filter(
          (piece) => piece.x !== x || piece.y !== y
        );
        for (const piece of newOtherPlayerPieces) {
          const moves = getPossibleNextPositions(piece, selectedPiece.color === PieceColor.WHITE ? newOwnPieces : newOtherPlayerPieces, selectedPiece.color === PieceColor.BLACK ? newOwnPieces : newOtherPlayerPieces, true, true);
          if (moves.some(move => move.x === x && move.y === y)) {
            console.log(selectedPiece, x, y, " is threatened by", piece);
            fieldThreat = true;
            break;
          }
        }
      }
      if (
        move.constraint &&
        !move.constraint(selectedPiece, selectedPiece.color, opponentOnField || capturesOnly, fieldThreat)
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