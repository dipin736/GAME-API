import React, { useEffect, useState } from "react";
import { Text, Box, Flex, Image, Heading, Button } from "@chakra-ui/react";
import api from "../service/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../context/AuthContext";
import GameDetailsSkeleton from "../components/GameDetailsSkeleton";
import { useParams } from "react-router";
import AddToCartButton from "../components/addToCart";
import YouTube from "react-youtube";

const GameDetailsq = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchGameDetails = async () => {
    try {
      const response = await api.get(`games/${id}`);
      setGameDetails(response.data);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  };

  const fetchGameReviews = async () => {
    try {
      const response = await api.get(`games/${id}/reviews/`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching game reviews:", error);
    }
  };

  useEffect(() => {
    fetchGameDetails();
    fetchGameReviews();
  }, [id]);

  if (!gameDetails) {
    return (
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        p={4}
        width={{ base: "100%", md: "1500px" }}
        mx="auto"
      >
        <GameDetailsSkeleton />
        <Box flex="1" margin={5}></Box>
      </Flex>
    );
  }

  return (
    <>
      <Box
       height={'620px'}
       backgroundColor={'transparent'}
       backgroundImage={`linear-gradient(rgba(15, 15, 15, 0), rgb(21, 21, 21)), linear-gradient(rgba(21, 21, 21, 0.8), rgba(21, 21, 21, 0.5)), url(${gameDetails.images[0]?.url || ''})`}
       maxHeight={'100%'}
       backgroundSize={'cover'}
       backgroundRepeat={'no-repeat'}
       backgroundPosition={'top'}
       transition={'background .3s'}
        display={{ base: "block", md: "flex" }}
        alignItems={{ md: "center" }}
        justifyContent={{ md: "center" }}
        p={8}
        maxWidth={{ base: "100%", md: "1550px" }}
        mx="auto"
      >
        {gameDetails.images && gameDetails.images.length > 0 && (
          <Box
            mb={{ base: 4, md: 0 }}
            mr={{ base: 0, md: 4 }}
            maxWidth={{ base: "100%", md: "50%" }}
          >
            <Carousel>
              {gameDetails.images.map((image, index) => (
                <Carousel.Item key={index}>
                  <Image
                    className="d-block w-100"
                    src={image.url}
                    alt={`Game Image ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Box>
        )}

        <Box flex="1" margin={5}>
          <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4}>
            {gameDetails.title}
          </Heading>
          <Text className="about" fontSize={{ base: "sm", md: "sm" }} mb={4}>
            {expanded ? gameDetails.about : gameDetails.about.slice(0, 200)}
            {!expanded && gameDetails.about.length > 150 && " ... "}
            <Button
              marginLeft={5}
              fontWeight={"bold"}
              borderColor={"gray.200"}
              border="1px"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "Read More"}
            </Button>
          </Text>

          <Text color={"grey"} fontSize={{ base: "sm", md: "sm" }} mb={4}>
            <Text>
              Released Date:{" "}
              {new Date(gameDetails.release_date).toLocaleDateString("en-GB")}
            </Text>
          </Text>
          <Text color={"grey"} fontSize={{ base: "md", md: "md" }} mb={4}>
            Genres: {gameDetails.genres}
          </Text>
          <Text color={"grey"} fontSize={{ base: "md", md: "md" }} mb={4}>
            Developers: {gameDetails.developers}
          </Text>
          <Text color={"grey"} fontSize={{ base: "md", md: "md" }}>
            Publisher: {gameDetails.publisher}
          </Text>
          <Text
            fontSize={{ base: "md", md: "md" }}
            mt={2}
            fontFamily={"initial"}
          >
            Price: ₹{gameDetails.price}
          </Text>
          {/* <Button onClick={addToCart}>
        Add to cart <RiAddLine />
      </Button> */}
          <AddToCartButton gameId={id} />
        </Box>

        <Box mt={{ base: 8, md: 0 }}>
          <Heading fontSize={{ base: "lg", md: "lg" }} mb={4}>
            Reviews and Ratings
          </Heading>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Box key={review.id} mb={1}>
                <Text fontSize={{ base: "sm", md: "sm" }}></Text>
                <Text color={"grey"} fontSize={{ base: "sm", md: "sm" }}>
                  Rating: {review.rating} - Comment: {review.comment}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No reviews yet.</Text>
          )}

          {
            <ReviewForm
              gameId={id}
              refreshReviews={() => {
                fetchGameDetails();
                fetchGameReviews();
              }}
            />
          }
        </Box>
      </Box>
    </>
  );
};

export default GameDetailsq;
