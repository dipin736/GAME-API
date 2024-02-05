import React from 'react';
import { Box, Flex, Text, Icon, Image } from "@chakra-ui/react";
import { FaThumbsUp, FaSmile, FaMeh, FaThumbsDown } from 'react-icons/fa';
import eye from '../assets/Emojis/bulls-eye.webp'
import thumb from '../assets/Emojis/thumbs-up.webp'
import smile from '../assets/Emojis/meh.webp'



const calculateRatingPercentage = (rating, totalReviews) => {
  const percentage = (rating / totalReviews) * 100;
  return percentage.toFixed(2);
};

const getRatingCategory = (percentage) => {
  if (percentage >= 50) {
    return 'Exceptional';
  } else if (percentage >= 20) {
    return 'Recommended';
  } else if (percentage >= 10) {
    return 'Meh';
  } else {
    return 'Skip';
  }
};

const getRatingIcon = (percentage) => {
  if (percentage >= 50) {
    return  <Image src={thumb}  boxSize="20px" margin={1}/>
  } else if (percentage >= 20) {
    return <Image src={smile}  boxSize="20px" margin={1}/>
  } else if (percentage >= 10) {
    return <FaMeh />;
  } else {
    return  <Image src={eye}  boxSize="20px" margin={1}/>
  }
};

const ReviewSummary = ({ reviewstar }) => {
  const totalReviews = reviewstar.length;

  const exceptionalPercentage = calculateRatingPercentage(
    reviewstar.filter((review) => review.rating >= 4).length,
    totalReviews
  );

  const recommendedPercentage = calculateRatingPercentage(
    reviewstar.filter((review) => review.rating === 3).length,
    totalReviews
  );

  const mehPercentage = calculateRatingPercentage(
    reviewstar.filter((review) => review.rating === 2).length,
    totalReviews
  );

  const skipPercentage = calculateRatingPercentage(
    reviewstar.filter((review) => review.rating === 1).length,
    totalReviews
  );

  return (
    <Flex direction="row" spacing={14} >
      <Box mr={4} >
        <Flex align="center">
          {getRatingIcon(exceptionalPercentage)}
          <Text ml={2}>({getRatingCategory(exceptionalPercentage)})</Text>
        </Flex>
        Exceptional: {exceptionalPercentage}%{' '}  
      </Box>
      <Box  mr={4} >
        <Flex align="center">
          {getRatingIcon(recommendedPercentage)}
          <Text ml={2}>({getRatingCategory(recommendedPercentage)})</Text>
        </Flex>
        Recommended: {recommendedPercentage}%{' '}
      </Box>
      <Box  mr={4}>
        <Flex align="center">
          {getRatingIcon(mehPercentage)}
          <Text ml={2}>({getRatingCategory(mehPercentage)})</Text>
        </Flex>
        Meh: {mehPercentage}%{' '}
      </Box>
      <Box  mr={4}>
        <Flex align="center">
          {getRatingIcon(skipPercentage)}
          <Text ml={2}>({getRatingCategory(skipPercentage)})</Text>
        </Flex>
        Skip: {skipPercentage}%{' '}
      </Box>
    </Flex>
  );
};

export default ReviewSummary;
