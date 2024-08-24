export enum ChessPiece {
  PAWN = 'pawn',
  ROOK = 'rook',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  QUEEN = 'queen',
  KING = 'king',
}

export function pieceAbbreveation(piece: ChessPiece): string {
  switch (piece) {
    case ChessPiece.PAWN:
      return 'P';
    case ChessPiece.ROOK:
      return 'R';
    case ChessPiece.KNIGHT:
      return 'N';
    case ChessPiece.BISHOP:
      return 'B';
    case ChessPiece.QUEEN:
      return 'Q';
    case ChessPiece.KING:
      return 'K';
  }
}

export function pieceValue(type: ChessPiece): number {
  switch (type) {
    case ChessPiece.PAWN:
      return 1;
    case ChessPiece.ROOK:
      return 5;
    case ChessPiece.KNIGHT:
      return 3;
    case ChessPiece.BISHOP:
      return 2;
    case ChessPiece.QUEEN:
      return 9;
    default:
      return 0;
  }
}

export enum PieceColor {
  WHITE = 'white',
  BLACK = 'black',
}