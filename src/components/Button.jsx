import React from "react";

import { useStateContext } from "../contexts/ContextProvider";

const Button = ({
  icon,
  bgColor,
  color,
  bgHoverColor,
  size,
  text,
  borderRadius,
  width,
  margin,
  onClickFuntion
}) => {
  const { setIsClicked, initialState } = useStateContext();

  return (
    <button
      type="button"
      onClick={onClickFuntion}
      style={{ backgroundColor: bgColor, color, borderRadius,margin }}
      className={` text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor} `}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
