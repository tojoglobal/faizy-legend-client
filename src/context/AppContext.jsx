/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, useState } from "react";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_OPEN_APIURL);
  const [openVideo, setOpenVideo] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const value = useMemo(
    () => ({
      apiUrl,
      setApiUrl,
      openVideo,
      setOpenVideo,
      selectedCard,
      setSelectedCard,
    }),
    [apiUrl, openVideo, selectedCard]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
