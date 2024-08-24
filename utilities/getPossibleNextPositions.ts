import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { possibleMoves } from "../types/possibleMoves";

/**
 * Returns all the possible next positions for the given piece
 * @param selectedPiece the piece to get the possible next positions for
 * @param pieces all pieces on the board
 * @param capturesOnly internal parameter. If true, only capture moves ignoring cheks are returned 
 * @returns all possible next positions for the given piece
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

/**
 * Returns all legal moves for a given color
 * @param pieces all pieces on the board
 * @param color the color to get the legal moves for
 * @returns all legal moves for the given color
 */
export function getAllLegalMoves(pieces: PositionedPiece[], color: PieceColor): [PositionedPiece, Position][] {
  const ownPieces = pieces.filter((piece) => piece.color === color);
  const res: [PositionedPiece, Position][] = [];
  for (const piece of ownPieces) {
    for (const move of getPossibleNextPositions(piece, pieces)) {
      res.push([piece, move]);
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
function kingInCheckAfterMove(x: number, y: number, selectedPiece: PositionedPiece, ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[]): boolean {
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

/**
 * Returns the new board state after a move
 * @param selectedPiece the piece to move
 * @param targetPosition the position to move selectedPiece to
 * @param pieces all pieces on the board
 * @returns the new board state after the move
 */
export function simulateMove(selectedPiece: PositionedPiece, targetPosition: Position, pieces: PositionedPiece[]): PositionedPiece[] {
  return pieces.filter((p) => p.x != targetPosition.x || p.y != targetPosition.y) //remove captured piece
    .map((p) => p === selectedPiece ? { ...p, x: targetPosition.x, y: targetPosition.y } : p) // move piece
    .map((p) => p.type === ChessPiece.PAWN && // check for promotion
      ((p.color === PieceColor.WHITE && (p.x === 0 || p.y - p.x === 5))
        || (p.color === PieceColor.BLACK && (p.x === 10 || p.x - p.y === 5)))
      ? { ...p, type: ChessPiece.QUEEN } : p);
}