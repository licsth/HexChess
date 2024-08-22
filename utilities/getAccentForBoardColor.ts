import { TailwindColor } from "../types/tailwindColor";

export function getAccentColorForBoardColor(boardColor: TailwindColor): TailwindColor {
  switch (boardColor) {
    case "red":
      return "blue";
    case "slate":
      return "red";
    case "orange":
      return "blue";
    case "yellow":
      return "blue";
    case "green":
      return "red";
    case "teal":
      return "red";
    case "blue":
      return "red";
    case "indigo":
      return "red";
    case "purple":
      return "yellow";
    default:
      return "blue";
  }
}