// useGames.js
import { useState, useEffect } from 'react';
import api from '../service/api';

const useGames = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch (error) {
      setError(`Error fetching games: ${error.message}`);
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []); 

  return { games, error, loading };
};

export default useGames;
