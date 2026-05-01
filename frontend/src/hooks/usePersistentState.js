import { useState, useEffect } from 'react';

const usePersistentState = (key, defaultValue) => {
  // Initialiser avec la valeur du localStorage ou la valeur par défaut
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(`Erreur lecture localStorage key "${key}":`, e);
    }
    return defaultValue;
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(`Erreur écriture localStorage key "${key}":`, e);
    }
  }, [key, state]);

  return [state, setState];
};

export default usePersistentState;