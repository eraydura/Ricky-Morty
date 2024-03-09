import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Character {
  id: number;
  name: string;
  species: string;
  status: string;
  gender: string;
  origin: { name: string };
  image: string;
}

interface FavoritesContextType {
  favorites: Character[];
  addToFavorites: (character: Character) => void;
  removeFromFavorites: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps): JSX.Element => {
  const [favorites, setFavorites] = useState<Character[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (character: Character): void => {
    setFavorites((prevFavorites) => [...prevFavorites, character]);
  };

  const removeFromFavorites = (id: number): void => {
    setFavorites((prevFavorites) => prevFavorites.filter(character => character.id !== id));
  };

  const contextValue: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
