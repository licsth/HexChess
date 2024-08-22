import { ChessPiece, PieceColor } from "./ChessPiece";
import { Position } from "./position";

export interface PositionedPiece extends Position {
  type: ChessPiece;
  color: PieceColor;
}