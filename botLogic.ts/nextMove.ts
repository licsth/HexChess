import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { getPossibleNextPositions } from "../utilities/getPossibleNextPositions";

/**
 * Calculates the next move for the bot
 * @param botPieces the bot's currently alive pieced
 * @param opponentPieces the opponent's currently alive pieces
 * @returns the piece to move and the target position
 */
export function getNextBotMove(botPieces: PositionedPiece[], opponentPieces: PositionedPiece[]): [PositionedPiece, Position] {
  let move = undefined;
  let botPiece = botPieces[Math.floor(Math.random() * botPieces.length)]
  while (move === undefined) {
    botPiece = botPieces[Math.floor(Math.random() * botPieces.length)];
    const moves = getPossibleNextPositions(botPiece, opponentPieces, botPieces);
    if (moves.length > 0) {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
  }
  return [botPiece, move];
}