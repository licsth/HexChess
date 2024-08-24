import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { getAllLegalMoves, getPossibleNextPositions } from "../utilities/getPossibleNextPositions";

/**
 * Calculates the bots next move.
 * @param pieces the pieces on the board
 * @param botColor the color the bot is playing
 * @returns 
 */
export function getNextBotMove(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
  if (!canMove(pieces, botColor)) {
    if (isCheked(pieces, botColor)) {
      throw new Error("Checkmate (I believe). This is a win screen I guess :)");
    }
    throw new Error("The bot says he cannot move, but is not in check. This counts as 3/4 of a win for you.")
  }
  // TODO: implement more sophisticated bot logic
  return oneMoveLookAhead(pieces, botColor);
}

/**
 * Returns a random legal move for the bot
 * @param pieces The pieces on the board
 * @param botColor the color the bot is playing as
 * @returns a random legal move for the bot
 */
function randomMove(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
  let move = undefined;
  const movableBotPieces = pieces.filter((piece) => piece.color === botColor && getPossibleNextPositions(piece, pieces).length > 0);
  let botPiece = movableBotPieces[Math.floor(Math.random() * movableBotPieces.length)]
  while (move === undefined) {
    botPiece = movableBotPieces[Math.floor(Math.random() * movableBotPieces.length)];
    const moves = getPossibleNextPositions(botPiece, pieces);
    if (moves.length > 0) {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
  }
  return [botPiece, move];
}

function oneMoveLookAhead(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
  let bestScore = -2000;
  let bestMove: [PositionedPiece, Position] = [pieces[0], { x: 0, y: 0 }];
  for (const [piece, move] of getAllLegalMoves(pieces, botColor)) {
    //TODO newPiecs does not consider promotion yet.
    const newPieces = pieces.filter((p) => p.x != move.x || p.y != move.y).map((p) => p === piece ? { ...p, x: move.x, y: move.y } : p);
    const score = basicEvaluatePosition(newPieces, botColor);
    if ((score == bestScore && Math.random() > 0.5) || score > bestScore) {
      bestScore = score;
      bestMove = [piece, move];
    }
  }
  return bestMove;
}

/**
 * Evaluates the current board position for a given color as a number.
 * @param pieces the pieces on the board
 * @param color the color to evaluate for
 */
function basicEvaluatePosition(pieces: PositionedPiece[], color: PieceColor): number {
  if (isChekmate(pieces, color)) return -1000;
  if (isChekmate(pieces, color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE)) return 1000;
  let score = 0;
  for (const piece of pieces) {
    score += piece.color === color ? pieceValue(piece.type) : -pieceValue(piece.type);
  }
  return score;
}

function pieceValue(type: PositionedPiece["type"]): number {
  switch (type) {
    case ChessPiece.PAWN:
      return 1;
    case ChessPiece.ROOK:
      return 5;
    case ChessPiece.KNIGHT:
      return 3;
    case ChessPiece.BISHOP:
      return 2;
    case ChessPiece.QUEEN:
      return 9;
    default:
      return 0;
  }
}

function canMove(pieces: PositionedPiece[], color: PieceColor): boolean {
  return pieces.filter((piece) => piece.color === color && getPossibleNextPositions(piece, pieces).length > 0).length > 0;
}

function isCheked(pieces: PositionedPiece[], color: PieceColor): boolean {
  const king = pieces.find((piece) => piece.type === ChessPiece.KING && piece.color === color);
  if (!king) return false;
  return pieces.filter((piece) => piece.color !== color).some((piece) => getPossibleNextPositions(piece, pieces, true).some((move) => move.x === king.x && move.y === king.y));
}

function isChekmate(pieces: PositionedPiece[], color: PieceColor): boolean {
  return !canMove(pieces, color) && isCheked(pieces, color);
}