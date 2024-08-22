import { FunctionComponent, PropsWithChildren } from "react";
import { classNames } from "../utilities/classNames";

interface Props extends PropsWithChildren {
  className?: string;
  color?: string;
  variant: number;
}

export const Hex: FunctionComponent<Props> = ({
  className = "",
  color = "slate",
  variant,
  children,
}) => {
  return (
    <div className={classNames("hex", className)}>
      <div className={classNames("left", `border-${color}-${variant}`)}></div>
      <div className={classNames("middle", `bg-${color}-${variant}`)}>
        {children}
      </div>
      <div className={classNames("right", `border-${color}-${variant}`)}></div>
    </div>
  );
};
