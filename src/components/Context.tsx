import { createContext, useContext, useEffect, useState } from "react";
import type { DripmatchContextPropType } from "./types";


const DripmatchContext = createContext<any>(null);

export const DripmatchContextProvider = ({children}: DripmatchContextPropType) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === "darkMode"
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(() => {
    return window.innerWidth > 768 && false
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

  //console.log(menuOpen);
  

  const value = {
    isDark,
    setIsDark,
    menuOpen,
    setMenuOpen
  }

  return (
    <DripmatchContext.Provider value={value}>
      {children}
    </DripmatchContext.Provider>
  )
}

export const useDripmatch = () => useContext(DripmatchContext);