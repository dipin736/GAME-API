import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, HStack, Image, Button, Heading } from '@chakra-ui/react';
import api from '../service/api';

const GenreList = ({ genres, game }) => {
  const genresArray = Array.isArray(genres) ? genres : [genres];
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await api.get(`images/${game.id}/`);

        console.log('API Response:', response);
        const data = response.data;
        console.log('Image Data:', data);
        if (data.length > 0) {
          setImage(data[0].url);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [game.id]);

  return (
    <Box>
      <List listStyleType="none" pl={1}>
        {genresArray.map((genre) => (
          <ListItem key={genre} >
            <HStack>
              {image  && <Image src={image} boxSize={31} borderRadius={18}  alt={`${game.title} Image`} />}
              <Button transition={'color .2s ease'}
				_hover={{ color: 'hsla(0,0%,100%,.4)' }}
				fontSize={'16px'}
				fontWeight={'700'}
			
				color={'gray.50'}  onClick={()=>{
                onSelectGenre(genre)
                console.log('genre')
              }} variant='link'>{genre}</Button>
            </HStack>
          </ListItem>
        ))}z
      </List>
    </Box>
  );
};

export default GenreList;
