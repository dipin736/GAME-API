import React from 'react';
import { Heading, SimpleGrid, Text } from '@chakra-ui/react';
import useGames from '../hooks/useGames';  
import GameCard from '../pages/gameCard';

const GameGrid = ({ games }) => {
  const {  error } = useGames();

  return (
    <div>
      {error && <Text>Error</Text>}
        <Heading marginTop={2}  >Games</Heading>
      {games.length === 0 && <Text>No matching games found</Text>}
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3,xl:4 }} padding='10px' spacing={10}>
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}   
      </SimpleGrid>
    </div>
  );
};

export default GameGrid;
