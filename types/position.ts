export interface Position {
  x: number;
  y: number;
}

export function xCoordinateLetter(x: number): string {
  return String.fromCharCode(97 + x);
}