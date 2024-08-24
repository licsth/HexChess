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

export function getTrailColorForBoardColor(boardColor: TailwindColor): TailwindColor {
  switch (boardColor) {
    case "red":
      return "yellow";
    case "slate":
      return "pink";
    case "orange":
      return "pink";
    case "yellow":
      return "pink";
    case "green":
      return "pink";
    case "teal":
      return "pink";
    case "blue":
      return "pink";
    case "indigo":
      return "pink";
    case "purple":
      return "orange";
    default:
      return "green";
  }
}