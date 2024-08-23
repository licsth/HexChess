import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { possibleMoves } from "../types/possibleMoves";

/**
 * Returns the possible next positions for a given piece
 * @param selectedPiece The piece to get the next moves for
 * @param whitePieces Current white pieces on the board
 * @param blackPieces Current black pieces on the board
 */
export function getPossibleNextPositions(selectedPiece: PositionedPiece, pieces: PositionedPiece[], capturesOnly: boolean = false): Position[] {
  const moves = possibleMoves[selectedPiece.type];
  const sign = selectedPiece.color === PieceColor.WHITE ? 1 : -1;
  const res: Position[] = [];
  const ownPieces = pieces.filter((piece) => piece.color === selectedPiece.color);
  const otherPlayerPieces = pieces.filter((piece) => piece.color !== selectedPiece.color);
  for (const moveList of moves) {
    for (const move of moveList) {
      const x = selectedPiece.x + sign * move.x;
      const y = selectedPiece.y + sign * move.y;

      // move lists are consecutive, meaning that if own piece is in the way/the field is not on the board,
      // the rest of the moveList is invalid
      if (!isFieldOnBoard(x, y) || ownPieces.some((piece) => piece.x === x && piece.y === y)) {
        break;
      }
      // check if there is an opponent on the field for pawn captures
      const opponentOnField =
        otherPlayerPieces.some(
          (piece) => piece.x === x && piece.y === y
        );

      if (
        move.constraint &&
        !move.constraint(selectedPiece, selectedPiece.color, opponentOnField || capturesOnly)
      )
        break;
      if (capturesOnly || !kingInCheckAfterMove(x, y, selectedPiece, ownPieces, otherPlayerPieces)) {
        res.push({ x, y });
      }
      if (opponentOnField) break // moves are consecutive, so same as above
    }
  }
  return res;
}

function isFieldOnBoard(x: number, y: number): boolean {
  return y <= x + 5 && y <= 10 && x <= 10 && y >= 0 && x >= 0 && (x <= 5 || y >= x - 5);
}

/**
 * Checks whether selected piece can move to the given field without the king being in check
 * @param x the x coordinate to move to
 * @param y the y coordinate to move to
 * @param selectedPiece the piece that is moving
 * @param ownPieces the players own pieces
 * @param otherPlayerPieces the other players pieces
 * @returns whether the king is in check after the move
 */
export function kingInCheckAfterMove(
  x: number,
  y: number,
  selectedPiece: PositionedPiece,
  ownPieces: PositionedPiece[],
  otherPlayerPieces: PositionedPiece[],
): boolean {
  const newOwnPieces = ownPieces.map((piece) =>
    piece.x === selectedPiece.x && piece.y === selectedPiece.y ? { ...piece, x, y } : piece
  );
  const newOtherPlayerPieces = otherPlayerPieces.filter(
    (piece) => piece.x !== x || piece.y !== y
  );
  const king = newOwnPieces.find((piece) => piece.type === ChessPiece.KING);
  for (const piece of newOtherPlayerPieces) {
    if (getPossibleNextPositions(piece, newOwnPieces.concat(newOtherPlayerPieces), true).some((move) => move.x === king?.x && move.y === king?.y)) {
      return true;
    }
  }
  return false;
}