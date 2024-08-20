import { FunctionComponent } from "react";
import { classNames } from "../utilities/classNames";

export const Hex: FunctionComponent<{
  className?: string;
  color?: string;
  variant: number;
}> = ({ className = "", color = "slate", variant }) => {
  return (
    <div className={classNames("hex", className)}>
      <div className={classNames("left", `border-${color}-${variant}`)}></div>
      <div className={classNames("middle", `bg-${color}-${variant}`)}></div>
      <div className={classNames("right", `border-${color}-${variant}`)}></div>
    </div>
  );
};
