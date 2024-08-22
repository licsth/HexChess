import { FunctionComponent, PropsWithChildren } from "react";
import { classNames } from "../utilities/classNames";
import { ChessPiece } from "../types/ChessPiece";
import useWindowDimensions, { Breakpoints } from "../hooks/useWindowDimensions";

interface Props extends PropsWithChildren {
  className?: string;
  color?: string;
  variant: number;
  piece?: { type: ChessPiece; color: "white" | "black" };
}

export const Hex: FunctionComponent<Props> = ({
  className = "",
  color = "slate",
  variant,
  children,
  piece,
}) => {
  const { width } = useWindowDimensions();

  return (
    <div
      className={classNames("relative group", piece ? "cursor-pointer" : "")}
    >
      <div className={classNames("hex", className)}>
        <div
          className={classNames(
            "left",
            `border-${color}-${variant}`,
            piece ? "group-hover:border-r-white" : ""
          )}
        ></div>
        <div
          className={classNames(
            "middle",
            `bg-${color}-${variant}`,
            piece ? "group-hover:bg-white" : ""
          )}
        >
          {children}
        </div>
        <div
          className={classNames(
            "right",
            `border-${color}-${variant}`,
            piece ? "group-hover:border-l-white" : ""
          )}
        ></div>
      </div>
      {piece && (
        <div
          className="absolute inset-0 grid items-center justify-items-center"
          style={{
            width: width > Breakpoints.SM ? 60 : 40,
            height: width > Breakpoints.SM ? 52 : 34,
          }}
        >
          <img
            src={`/piece_images/${piece.color}-${piece.type}.png`}
            alt=""
            width={width > Breakpoints.SM ? 45 : 30}
          />
        </div>
      )}
    </div>
  );
};
