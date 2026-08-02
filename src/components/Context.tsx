import { createContext, useContext, useState } from "react";
import type { DripmatchContextPropType } from "./types";


const DripmatchContext = createContext<any>(null);

export const DripmatchContextProvider = ({children}: DripmatchContextPropType) => {
  const [isDark, setIsDark] = useState<boolean>(true)

  const value = {
    isDark,
    setIsDark,
  }

  return (
    <DripmatchContext.Provider value={value}>
      {children}
    </DripmatchContext.Provider>
  )
}

export const useDripmatch = () => useContext(DripmatchContext);