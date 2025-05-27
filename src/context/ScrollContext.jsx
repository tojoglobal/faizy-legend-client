/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const ScrollContext = createContext();

export function ScrollProvider({ children }) {
  const [scrollToSection, setScrollToSection] = useState(null);

  return (
    <ScrollContext.Provider value={{ scrollToSection, setScrollToSection }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
}
