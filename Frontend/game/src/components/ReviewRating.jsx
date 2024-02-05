import React from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import thumb from '../assets/Emojis/thumbs-up.webp';
import smile from '../assets/Emojis/meh.webp';
import eye from '../assets/Emojis/bulls-eye.webp';

const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

const getRatingIcon = (averageRating) => {
  if (averageRating >= 3) {
    return <Image src={thumb} boxSize="20px" margin={1} />;
  } else if (averageRating >= 1) {
    return <Image src={smile} boxSize="20px" margin={1} />;
  } else {
    return <Image src={eye} boxSize="20px" margin={1} />;
  }
};

const ReviewSummary = ({ reviews }) => {
  const averageRating = calculateAverageRating(reviews);

  return (
    <Flex direction="row" spacing={14}>
      <Box mr={4}>
        <Flex align="center">
          {getRatingIcon(averageRating)}
          {/* <Text ml={2}>({averageRating.toFixed(2)})</Text> */}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ReviewSummary;
