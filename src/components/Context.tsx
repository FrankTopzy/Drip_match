import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { DripmatchContextPropType, SavedResult } from "./types";


const DripmatchContext = createContext<any>(null);

// ─── localStorage helpers ──────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const DripmatchContextProvider = ({children}: DripmatchContextPropType) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === "darkMode"
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(() => {
    return window.innerWidth > 768 && false
  });

  // ─── Favorites & Drafts ────────────────────────────────────────────
  const [favorites, setFavorites] = useState<SavedResult[]>(() =>
    loadFromStorage<SavedResult[]>('drip_favorites', [])
  );
  const [drafts, setDrafts] = useState<SavedResult[]>(() =>
    loadFromStorage<SavedResult[]>('drip_drafts', [])
  );

  // ─── Settings ──────────────────────────────────────────────────────
  const [autoSaveDrafts, setAutoSaveDrafts] = useState<boolean>(() =>
    loadFromStorage<boolean>('drip_autoSaveDrafts', true)
  );

  // Persist favorites
  useEffect(() => {
    saveToStorage('drip_favorites', favorites);
  }, [favorites]);

  // Persist drafts
  useEffect(() => {
    saveToStorage('drip_drafts', drafts);
  }, [drafts]);

  // Persist autoSaveDrafts setting
  useEffect(() => {
    saveToStorage('drip_autoSaveDrafts', autoSaveDrafts);
  }, [autoSaveDrafts]);

  // ─── Favorite actions ──────────────────────────────────────────────
  const addFavorite = useCallback((item: SavedResult) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id)) return prev;
      return [item, ...prev];
    });
    // Remove from drafts if it was there
    setDrafts(prev => prev.filter(d => d.id !== item.id));
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // ─── Draft actions ─────────────────────────────────────────────────
  const addDraft = useCallback((item: SavedResult) => {
    if (!autoSaveDrafts) return;
    setDrafts(prev => {
      if (prev.some(d => d.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, [autoSaveDrafts]);

  const removeDraft = useCallback((id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  }, []);

  const clearDrafts = useCallback(() => {
    setDrafts([]);
  }, []);

  const moveDraftToFavorite = useCallback((id: string) => {
    setDrafts(prev => {
      const draft = prev.find(d => d.id === id);
      if (draft) {
        setFavorites(faves => {
          if (faves.some(f => f.id === draft.id)) return faves;
          return [draft, ...faves];
        });
      }
      return prev.filter(d => d.id !== id);
    });
  }, []);

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
    setMenuOpen,
    // Favorites
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    // Drafts
    drafts,
    addDraft,
    removeDraft,
    clearDrafts,
    moveDraftToFavorite,
    // Settings
    autoSaveDrafts,
    setAutoSaveDrafts,
  }

  return (
    <DripmatchContext.Provider value={value}>
      {children}
    </DripmatchContext.Provider>
  )
}

export const useDripmatch = () => useContext(DripmatchContext);