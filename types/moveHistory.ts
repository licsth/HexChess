import { ChessPiece, PieceColor } from "./ChessPiece";
import { Position } from "./position";

export interface MoveHistory {
  from: Position;
  to: Position;
  color: PieceColor;
  pieceType: ChessPiece;
  capture: boolean;
  check: boolean;
}