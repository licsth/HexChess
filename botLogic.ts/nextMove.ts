import { ChessPiece, PieceColor } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { getPossibleNextPositions } from "../utilities/getPossibleNextPositions";

/**
 * Calculates the bots next move
 * @param pieces the pieces on the board
 * @param botColor the color the bot is playing
 * @returns 
 */
export function getNextBotMove(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
  let move = undefined;
  const botPieces = pieces.filter((piece) => piece.color === botColor && getPossibleNextPositions(piece, pieces).length > 0);
  if (botPieces.length === 0) {
    throw new Error("Bot has no valid moves left. This is a win screen I guess :)");
  }
  let botPiece = botPieces[Math.floor(Math.random() * botPieces.length)]
  while (move === undefined) {
    botPiece = botPieces[Math.floor(Math.random() * botPieces.length)];
    const moves = getPossibleNextPositions(botPiece, pieces);
    if (moves.length > 0) {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
  }
  return [botPiece, move];
}