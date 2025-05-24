/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from "react";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_OPEN_APIURL);
  const [showSearch, setShowSearch] = useState(false);

  // dark system set up
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const value = useMemo(
    () => ({
      apiUrl,
      setApiUrl,
      showSearch,
      setShowSearch,
      darkMode,
      setDarkMode,
      toggleDarkMode,
    }),
    [apiUrl, showSearch, darkMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
