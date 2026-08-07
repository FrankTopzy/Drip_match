import { createContext, useContext, useEffect, useState } from "react";
import type { DripmatchContextPropType } from "./types";


const DripmatchContext = createContext<any>(null);

export const DripmatchContextProvider = ({children}: DripmatchContextPropType) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === "darkMode"
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'darkMode')
    } else {
       document.documentElement.classList.add('light-mode');
       localStorage.setItem('theme', 'lightMode')
    }

    //console.log(localStorage.getItem('theme'));
    
  }, [isDark])

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