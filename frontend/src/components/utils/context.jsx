import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function ContextProvider({ children }) {
  const [state, setState] = useState("");

  return (
    <AppContext.Provider value={{
      state,
      setState,
    }}>
    {children}
  </AppContext.Provider>
);
}

export function getContext() {
  return useContext(AppContext);
}