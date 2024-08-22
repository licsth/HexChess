import { range } from "lodash";
import { ChessPiece, PieceColor } from "./ChessPiece";
import { Position } from "../components/Gameboard";
import { blackStartPosition, whiteStartPosition } from "./startPosition";

export const possibleMoves: Record<ChessPiece, { x: number, y: number, constraint?: (currentPosition: Position, color: PieceColor) => boolean }[][]> = {
  [ChessPiece.PAWN]: [[{ x: -1, y: 0 }], [{
    x: -2, y: 0, constraint: (position, color) => {
      if (color === PieceColor.WHITE) {
        return whiteStartPosition.some(piece => piece.type === ChessPiece.PAWN && position.x === piece.x && position.y === piece.y)
      }
      return blackStartPosition.some(piece => piece.type === ChessPiece.PAWN && position.x === piece.x && position.y === piece.y)
    }
  }]],
  [ChessPiece.ROOK]: [
    range(10).map(i => ({ x: -(i + 1), y: 0 })),
    range(10).map(i => ({ x: (i + 1), y: 0 })),
    range(10).map(i => ({ x: 0, y: i + 1 })),
    range(10).map(i => ({ x: 0, y: -(i + 1) })),
    range(10).map(i => ({ x: -(i + 1), y: -(i + 1) })),
    range(10).map(i => ({ x: i + 1, y: (i + 1) })),

  ],
  [ChessPiece.KNIGHT]: [
    [{ x: -1, y: 2 }],
    [{ x: -2, y: 1 }],
    [{ x: -3, y: -1 }],
    [{ x: -3, y: -2 }],
    [{ x: -2, y: -3 }],
    [{ x: -1, y: -3 }],
    [{ x: 3, y: 1 }],
    [{ x: 3, y: 2 }],
    [{ x: 1, y: 3 }],
    [{ x: 2, y: 3 }],
    [{ x: 2, y: -1 }],
    [{ x: 1, y: -2 }],
  ],
  [ChessPiece.BISHOP]: [
    range(10).map(i => ({ x: -(i + 1), y: i + 1 })),
    [{ x: -2, y: -1 }, { x: -4, y: -2 }, { x: -6, y: -3 }, { x: -8, y: -4 }, { x: -10, y: -5 }],
    [{ x: 2, y: 1 }, { x: 4, y: 2 }, { x: 6, y: 3 }, { x: 8, y: 4 }, { x: 10, y: 5 }],
    range(10).map(i => ({ x: (i + 1), y: -i - 1 })),
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

possibleMoves[ChessPiece.QUEEN] = possibleMoves[ChessPiece.ROOK].concat(possibleMoves[ChessPiece.BISHOP])