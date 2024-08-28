import { ChessPiece, getOtherColor, PieceColor, pieceValue } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { getFieldColorMap } from "../utilities/getFieldColorMap";
import { getAllLegalMoves, getPossibleNextPositions, simulateMove } from "../utilities/getPossibleNextPositions";

/**
 * Calculates the bots next move.
 * @param pieces the pieces on the board
 * @param botColor the color the bot is playing
 * @returns 
 */
export function getNextBotMove(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
  const fieldColorMap = getFieldColorMap(pieces);
  const botPieces = pieces.filter((piece) => piece.color === botColor);
  const otherPlayerPieces = pieces.filter((piece) => piece.color !== botColor);
  if (isGameOver(botPieces, otherPlayerPieces, fieldColorMap)) {
    if (isChecked(botPieces, otherPlayerPieces, fieldColorMap)) {
      throw new Error("Checkmate (I believe). This is a win screen I guess :)");
    }
    throw new Error("The bot says he cannot move, but is not in check. This counts as 3/4 of a win for you.")
  }
  // TODO: bot should choose which function to use based on difficulty
  return nMoveLookAhead(botPieces, otherPlayerPieces, 2);
}

/**
 * Returns a random legal move for the bot
 * @param pieces The pieces on the board
 * @param botColor the color the bot is playing as
 * @returns a random legal move for the bot
 */
// function randomMove(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
//   let move = undefined;
//   const ownPieces = pieces.filter((piece) => piece.color === botColor);
//   const otherPlayerPieces = pieces.filter((piece) => piece.color !== botColor);
//   const movableBotPieces = ownPieces.filter((piece) => getPossibleNextPositions(piece, ownPieces, otherPlayerPieces).length > 0);
//   let botPiece = movableBotPieces[Math.floor(Math.random() * movableBotPieces.length)]
//   while (move === undefined) {
//     botPiece = movableBotPieces[Math.floor(Math.random() * movableBotPieces.length)];
//     const moves = getPossibleNextPositions(botPiece, ownPieces, otherPlayerPieces);
//     if (moves.length > 0) {
//       move = moves[Math.floor(Math.random() * moves.length)];
//     }
//   }
//   return [botPiece, move];
// }

// function oneMoveLookAhead(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
//   let bestScore = -2000;
//   let bestMove: [PositionedPiece, Position] = [pieces[0], { x: 0, y: 0 }];
//   for (const [piece, move] of getAllLegalMoves(pieces, botColor)) {
//     const newPieces = simulateMove(piece, move, pieces);
//     const score = basicEvaluatePosition(newPieces, botColor);
//     if ((score == bestScore && Math.random() > 0.5) || score > bestScore) {
//       bestScore = score;
//       bestMove = [piece, move];
//     }
//   }
//   return bestMove;
// }

/**
 * Performs an n-move lookahead to determine the best move for the bot.
 * @param pieces The current list of pieces on the board.
 * @param botColor The bot's color.
 * @param depth The depth of the lookahead (number of moves).
 * @returns The best move as a tuple [PositionedPiece, Position].
 */
function nMoveLookAhead(botPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[], depth: number): [PositionedPiece, Position] {
  let bestScore = -Infinity;
  let bestMove: [PositionedPiece, Position] = [botPieces[0], { x: 0, y: 0 }];
  const fieldColorMap = getFieldColorMap(botPieces.concat(otherPlayerPieces));
  for (const [piece, move] of getAllLegalMoves(botPieces, otherPlayerPieces, fieldColorMap)) {
    const [newBot, newOther] = simulateMove(piece, move, botPieces, otherPlayerPieces);
    const newFieldColorMap = fieldColorMap.slice();
    newFieldColorMap[piece.x * 11 + piece.y] = null;
    newFieldColorMap[move.x * 11 + move.y] = piece.color;
    const score = minimax(newBot, newOther, newFieldColorMap, depth - 1, false, -Infinity, Infinity);

    if (score > bestScore || (score >= bestScore && Math.random() > 0.5)) {
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
function basicEvaluatePosition(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[], fieldColorMap: (PieceColor | null)[]): number {
  if (isCheckmate(ownPieces, otherPlayerPieces, fieldColorMap)) return -1000;
  if (isCheckmate(otherPlayerPieces, ownPieces, fieldColorMap)) return 1000;
  let score = 0;
  for (const piece of ownPieces) {
    score += pieceValue(piece.type);
  }
  for (const piece of otherPlayerPieces) {
    score -= pieceValue(piece.type)
  }
  return score;
}


/**
 * Returns whether the game is over.
 * @param pieces The pieces on the board
 * @param color the color to move next
 * @returns whether the game is over
 */
export function isGameOver(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[], fieldColorMap: (PieceColor | null)[]): boolean {
  return ownPieces.every((piece) => getPossibleNextPositions(piece, ownPieces, otherPlayerPieces, fieldColorMap).length === 0);
}

export function isChecked(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[], fieldColorMap: (PieceColor | null)[]): boolean {
  const king = ownPieces.find((piece) => piece.type === ChessPiece.KING);
  if (!king) return false;
  return otherPlayerPieces.some((piece) => getPossibleNextPositions(piece, otherPlayerPieces, ownPieces, fieldColorMap, true).some((move) => move.x === king.x && move.y === king.y));
}

function isCheckmate(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[], fieldColorMap: (PieceColor | null)[]): boolean {
  return isGameOver(ownPieces, otherPlayerPieces, fieldColorMap) && isChecked(ownPieces, otherPlayerPieces, fieldColorMap);
}

/**
 * Minimax algorithm with alpha-beta pruning.
 * @param pieces The current list of pieces on the board.
 * @param depth The depth to look ahead (number of moves).
 * @param isMaximizing True if it's the maximizing player's turn (bot), false if minimizing (opponent).
 * @param alpha The best value that the maximizer currently can guarantee.
 * @param beta The best value that the minimizer currently can guarantee.
 * @param botColor The bot's color.
 * @returns The evaluation score of the board.
 */
function minimax(botPieces: PositionedPiece[], playerPieces: PositionedPiece[], fieldColorMap: (PieceColor | null)[], depth: number, isMaximizing: boolean, alpha: number, beta: number): number {

  if (depth === 0 || isGameOver(isMaximizing ? botPieces : playerPieces, isMaximizing ? playerPieces : botPieces, fieldColorMap)) {
    return basicEvaluatePosition(botPieces, playerPieces, fieldColorMap);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const [piece, move] of getAllLegalMoves(botPieces, playerPieces, fieldColorMap)) {
      const [newBot, newPlayer] = simulateMove(piece, move, botPieces, playerPieces);
      const newFieldColorMap = fieldColorMap.slice();
      newFieldColorMap[piece.x * 11 + piece.y] = null;
      newFieldColorMap[move.x * 11 + move.y] = piece.color;
      const evaluation = minimax(newBot, newPlayer, newFieldColorMap, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const [piece, move] of getAllLegalMoves(playerPieces, botPieces, fieldColorMap)) {
      const [newPlayer, newBot] = simulateMove(piece, move, playerPieces, botPieces);
      const newFieldColorMap = fieldColorMap.slice();
      newFieldColorMap[piece.x * 11 + piece.y] = null;
      newFieldColorMap[move.x * 11 + move.y] = piece.color;
      const evaluation = minimax(newBot, newPlayer, newFieldColorMap, depth - 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return minEval;
  }
}

