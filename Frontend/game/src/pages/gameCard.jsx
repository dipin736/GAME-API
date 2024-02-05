import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Spacer,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import api from "../service/api";
import PlatformIconList from "../components/PlatformIconList";
import { Link } from "react-router-dom";
import ReviewSummary from "../components/ReviewRating";

const GameCard = ({ game }) => {
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await api.get(`images/${game.id}`);
        const data = response.data;
        if (data.length > 0) {
          setImage(data[0].url);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await api.get(`games/${game.id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchImage();
    fetchReviews();
  }, [game.id]);

  // Calculate the average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <VStack
      as={Link}
      to={`/game/game_details/${game.id}`}
      borderRadius={20}
      overflow="hidden"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{
        boxShadow: "0px 0px 30px 1px rgba(0, 255, 117, 0.30)",
        transform: "scale(1.05)",
      }}
    >
      {image && <Image src={image} alt={`${game.title} Image`} />}
      <VStack spacing={2} p={4} align="start" width="100%">
        <Flex justify="space-between" width="100%">
          <Box>
            <PlatformIconList game={game} />
          </Box>
          <Box>
            <Text fontSize="1xl">₹{game.price}</Text>
          </Box>
        </Flex>
        <Heading fontSize="2xl">{game.title}</Heading>
        <Flex justify="space-between" width="100%">
          <Box>
            <ReviewSummary reviews={reviews} />
          </Box>
          <Box>
            <Text>{game.publisher}</Text>
          </Box>
        </Flex>
        <Text>
          Released Date:{" "}
          {new Date(game.release_date).toLocaleDateString("en-GB")}
        </Text>
        {/* Display the average rating using ReviewSummary */}
      </VStack>
    </VStack>
  );
};

export default GameCard;
