// src/hooks/usePasswordToggle.js
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const Icon = (
    <span
      onClick={() => setVisible((prev) => !prev)}
      className="cursor-pointer"
      //   className="absolute right-3 top-2/4 -translate-y-1/2 cursor-pointer text-gray-500"
    >
      {visible ? <FaEyeSlash /> : <FaEye />}
    </span>
  );

  const inputType = visible ? "text" : "password";

  return [inputType, Icon];
};
