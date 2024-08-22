import { ChessPiece } from "./ChessPiece";

export const possibleMoves: Record<ChessPiece, { x: number, y: number }[][]> = {
  [ChessPiece.PAWN]: [[{ x: -1, y: 0 }]],
  [ChessPiece.ROOK]: [],
  [ChessPiece.KNIGHT]: [[{ x: -1, y: 2 }]],
  [ChessPiece.BISHOP]: [
    [{ x: -1, y: 1 }, { x: -2, y: 2 }, { x: -3, y: 3 }, { x: -4, y: 4 }, { x: -5, y: 5 }, { x: -6, y: 6 }, { x: -7, y: 7 }, { x: -8, y: 8 }, { x: -9, y: 9 }, { x: -10, y: 10 }],
    [{ x: -2, y: -1 }, { x: -4, y: -2 }, { x: -6, y: -3 }, { x: -8, y: -4 }, { x: -10, y: -5 }],
    [{ x: 2, y: 1 }, { x: 4, y: 2 }, { x: 6, y: 3 }, { x: 8, y: 4 }, { x: 10, y: 5 }],
    [{ x: 1, y: -1 }, { x: 2, y: -2 }, { x: 3, y: -3 }, { x: 4, y: -4 }, { x: 5, y: -5 }, { x: 6, y: -6 }, { x: 7, y: -7 }, { x: 8, y: -8 }, { x: 9, y: -9 }, { x: 10, y: -10 }],
    [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 8 }, { x: 5, y: 10 }],
    [{ x: -1, y: -2 }, { x: -2, y: -4 }, { x: -3, y: -6 }, { x: -4, y: -8 }, { x: -5, y: -10 }],],
  [ChessPiece.QUEEN]: [],
  [ChessPiece.KING]: [
    [{ x: -1, y: 0 }],
    [{ x: -1, y: 1 }],
    [{ x: 0, y: 1 }],
    [{ x: 1, y: 1 }],
    [{ x: 1, y: 0 }],
    [{ x: 1, y: -1 }],
    [{ x: 0, y: -1 }],
    [{ x: -1, y: -1 }],
    [{ x: -2, y: -1 }],
    [{ x: 2, y: 1 }],
    [{ x: -1, y: -2 }],
    [{ x: 1, y: 2 }]
  ]
}