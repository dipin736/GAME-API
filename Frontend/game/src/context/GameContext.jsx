// GameContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../service/api';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data);
      } catch (error) {
        setError(`Error fetching games: ${error.message}`);
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false); // Set loading to false after data fetching, whether successful or not
      }
    };

    fetchGames();
  }, []);

  const searchGames = (searchTerm) => {
    return games.filter((game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <GameContext.Provider value={{ games, error, searchGames, loading }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};
