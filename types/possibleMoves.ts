import { range } from "lodash";
import { ChessPiece, PieceColor } from "./ChessPiece";
import { blackStartPosition, whiteStartPosition } from "./startPosition";
import { Position } from "./position";

export const possibleMoves: Record<ChessPiece, { x: number, y: number, constraint?: (currentPosition: Position, color: PieceColor, opponentOnField: boolean) => boolean }[][]> = {
  [ChessPiece.PAWN]: [
    [
      { x: -1, y: 0, constraint: (_p, _c, opponentOnField) => !opponentOnField },
      {
        x: -2, y: 0, constraint: (position, color, opponentOnField) => {
          if (opponentOnField) return false;
          if (color === PieceColor.WHITE) {
            return whiteStartPosition.some(piece => piece.type === ChessPiece.PAWN && position.x === piece.x && position.y === piece.y)
          }
          return blackStartPosition.some(piece => piece.type === ChessPiece.PAWN && position.x === piece.x && position.y === piece.y)
        }
      }
    ],
    [{ x: 0, y: 1, constraint: (_p, _c, opponentOnField) => opponentOnField }],
    [{ x: -1, y: -1, constraint: (_p, _c, opponentOnField) => opponentOnField }],
  ],
  [ChessPiece.ROOK]: [
    range(1, 10).map(i => ({ x: -i, y: 0 })),
    range(1, 10).map(i => ({ x: i, y: 0 })),
    range(1, 10).map(i => ({ x: 0, y: i })),
    range(1, 10).map(i => ({ x: 0, y: -i })),
    range(1, 10).map(i => ({ x: -i, y: -i })),
    range(1, 10).map(i => ({ x: i, y: i })),
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
    range(1, 10).map(i => ({ x: -i, y: i })),
    range(1, 5).map(i => ({ x: -2 * i, y: -i })),
    range(1, 5).map(i => ({ x: 2 * i, y: i })),
    range(1, 10).map(i => ({ x: i, y: -i })),
    range(1, 5).map(i => ({ x: i, y: 2 * i })),
    range(1, 5).map(i => ({ x: -i, y: -2 * i })),
  ],
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