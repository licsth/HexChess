import { ChessPiece, PieceColor, pieceValue } from "../types/ChessPiece";
import { Position } from "../types/position";
import { PositionedPiece } from "../types/positionedPiece";
import { getAllLegalMoves, getOtherColor, getPossibleNextPositions, simulateMove } from "../utilities/getPossibleNextPositions";

/**
 * Calculates the bots next move.
 * @param pieces the pieces on the board
 * @param botColor the color the bot is playing
 * @returns 
 */
export function getNextBotMove(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
  if (isGameOver(pieces, botColor)) {
    if (isChecked(pieces, botColor)) {
      throw new Error("Checkmate (I believe). This is a win screen I guess :)");
    }
    throw new Error("The bot says he cannot move, but is not in check. This counts as 3/4 of a win for you.")
  }
  // TODO: bot should choose which function to use based on difficulty
  return nMoveLookAhead(pieces, botColor, 2);
}

/**
 * Returns a random legal move for the bot
 * @param pieces The pieces on the board
 * @param botColor the color the bot is playing as
 * @returns a random legal move for the bot
 */
function randomMove(pieces: PositionedPiece[], botColor: PieceColor): [PositionedPiece, Position] {
  let move = undefined;
  const ownPieces = pieces.filter((piece) => piece.color === botColor);
  const otherPlayerPieces = pieces.filter((piece) => piece.color !== botColor);
  const movableBotPieces = ownPieces.filter((piece) => getPossibleNextPositions(piece, ownPieces, otherPlayerPieces).length > 0);
  let botPiece = movableBotPieces[Math.floor(Math.random() * movableBotPieces.length)]
  while (move === undefined) {
    botPiece = movableBotPieces[Math.floor(Math.random() * movableBotPieces.length)];
    const moves = getPossibleNextPositions(botPiece, ownPieces, otherPlayerPieces);
    if (moves.length > 0) {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
  }
  return [botPiece, move];
}

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
function nMoveLookAhead(pieces: PositionedPiece[], botColor: PieceColor, depth: number): [PositionedPiece, Position] {
  let bestScore = -Infinity;
  let bestMove: [PositionedPiece, Position] = [pieces[0], { x: 0, y: 0 }];
  const ownPieces = pieces.filter((piece) => piece.color === botColor);
  const otherPlayerPieces = pieces.filter((piece) => piece.color !== botColor);
  for (const [piece, move] of getAllLegalMoves(ownPieces, otherPlayerPieces)) {
    const newPieces = simulateMove(piece, move, pieces);
    const score = minimax(newPieces, depth - 1, false, -Infinity, Infinity, botColor);

    if (score >= bestScore && Math.random() > 0.5) {
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
function basicEvaluatePosition(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[]): number {
  if (isCheckmate(ownPieces, otherPlayerPieces)) return -1000;
  if (isCheckmate(otherPlayerPieces, ownPieces)) return 1000;
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
export function isGameOver(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[]): boolean {
  return ownPieces.every((piece) => getPossibleNextPositions(piece, ownPieces, otherPlayerPieces).length === 0);
}

export function isChecked(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[]): boolean {
  const king = ownPieces.find((piece) => piece.type === ChessPiece.KING);
  if (!king) return false;
  return otherPlayerPieces.some((piece) => getPossibleNextPositions(piece, otherPlayerPieces, ownPieces, true).some((move) => move.x === king.x && move.y === king.y));
}

function isCheckmate(ownPieces: PositionedPiece[], otherPlayerPieces: PositionedPiece[]): boolean {
  return isGameOver(ownPieces, otherPlayerPieces) && isChecked(ownPieces, otherPlayerPieces);
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
function minimax(botPieces: PositionedPiece[], playerPieces: PositionedPiece[], depth: number, isMaximizing: boolean, alpha: number, beta: number, botColor: PieceColor): number {
  const currentColor = isMaximizing ? botColor : getOtherColor(botColor);

  if (depth === 0 || isGameOver(isMaximizing ? botPieces : playerPieces, isMaximizing ? playerPieces : botPieces)) {
    return basicEvaluatePosition(botPieces, playerPieces);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const [piece, move] of getAllLegalMoves(botPieces, playerPieces)) {
      const newPieces = simulateMove(piece, move, botPieces);
      const evaluation = minimax(newPieces, depth - 1, false, alpha, beta, botColor);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const [piece, move] of getAllLegalMoves(pieces, getOtherColor(botColor))) {
      const newPieces = simulateMove(piece, move, pieces);
      const evaluation = minimax(newPieces, depth - 1, true, alpha, beta, botColor);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return minEval;
  }
}

