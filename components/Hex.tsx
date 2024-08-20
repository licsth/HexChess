import { FunctionComponent } from "react";
import { classNames } from "../utilities/classNames";

export const Hex: FunctionComponent<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={classNames("hex", className)}>
      <div className="left"></div>
      <div className="middle"></div>
      <div className="right"></div>
    </div>
  );
};
