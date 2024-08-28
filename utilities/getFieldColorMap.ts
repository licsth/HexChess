import { PositionedPiece } from "../types/positionedPiece";

export function getFieldColorMap(pieces: PositionedPiece[]) {
  const fieldColorMap = new Array(11 * 11).fill(null);
  for (const piece of pieces) {
    fieldColorMap[piece.x * 11 + piece.y] = piece.color;
  }
  return fieldColorMap;
}