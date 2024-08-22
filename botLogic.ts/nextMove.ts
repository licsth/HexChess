import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";

/**
 * Calculates the next move for the bot
 * @param botPieces the bot's currently alive pieced
 * @param opponentPieces the opponent's currently alive pieces
 * @returns the piece to move and the target position
 */
export function getNextBotMove(botPieces: PositionedPiece[], opponentPieces: PositionedPiece[]): [PositionedPiece, Position] {
  // dummy output: just don't move 
  return [botPieces[0], botPieces[0]];
}