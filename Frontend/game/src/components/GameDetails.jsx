import {
	Box,
	Button,
	Flex,
	Grid,
	HStack,
	Heading,
	Image,
	SimpleGrid,
	Spinner,
	Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GameDetailsSkeleton from "./GameDetailsSkeleton";
import api from "../service/api";
import AddToCartButton from "./addToCart";
import ReviewForm from "./ReviewForm";
import ReviewSummary from "./ReviewSummary";

const GameDetails = () => {

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
  

	// mt={{ base: 0, md: 6, xl: 12 }} p={{ base: 6, md: 16, xl: 12 }} pb={{ base: 8, md: 16 }}
	return (
		<>
  <Box  mt={{ base: 0, md: 6, xl: 8 }} p={{ base: 0, md: 4, xl:5 }} pb={{ base: 8, md: 16 }}>
    <Text
    fontSize={{ base: 'xs', lg: 'sm' }}
	mb={{ base: '42px', md: '24px' }}
	color={'hsla(0,0%,100%,.4)'}
	textAlign={{ base: 'center', lg: 'left' }}
    >
      <Button
        fontSize={"xs"}
        variant={"link"}
        color={"hsla(0,0%,100%,.4)"}
        fontWeight={"normal"}
        letterSpacing={"1.7px"}
        _hover={{
          textDecoration: "none",
          border: "none",
          color: "#fff",
        }}
      >
        <Link to={"/"}>HOME</Link>
      </Button>{" "}
      /{" "}
      <Button
        fontSize={"xs"}
        variant={"link"}
        color={"hsla(0,0%,100%,.4)"}
        fontWeight={"normal"}
        letterSpacing={"1.7px"}
        _hover={{
          textDecoration: "none",
          border: "none",
          color: "#fff",
        }}
      >
        <Link to={"/games"}> GAMES </Link>
      </Button>{" "}/
      {gameDetails.title}
    </Text>

    <Grid templateColumns={{ base: "1fr", lg: "1fr 0.6fr" }} gap={8}>
      <Box>
        <Box>
          <Flex
            align={"center"}
            gap={4}
            direction={{ base: "column", md: "row" }}
            justify={{ base: "center", lg: "flex-start" }}
          >
            <HStack gap={".6rem"}>{/* Add items to HStack if needed */}</HStack>
          </Flex>
          <Heading
            mt={4}
            size={{ base: "3xl", lg: "4xl" }}
            textAlign={{ base: "center", lg: "left" }}
            fontFamily={"orbitron"}
          >
            {gameDetails.title}
          </Heading>
        </Box>

        <Box mt={8}>
          <Heading fontSize={"2xl"} mb={3}>
            About
          </Heading>
          <Text
            className="about"
            fontSize={{ base: "sm", md: "sm" }}
            mb={4}
          >
            {expanded
              ? gameDetails.about
              : gameDetails.about.slice(0, 500)}
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
        </Box>

        <SimpleGrid
         columns={{ base: 1, md: 2 }} rowGap={5} columnGap={10} mt={8}
        >
          <Box width={{ base: '100%', md: '50%' }}>
            <Heading
              fontSize={"sm"}
              color={"hsla(0,0%,100%,.2)"}
              marginBottom={2}
            >
              Platforms
            </Heading>
            <Text color={"grey"} fontSize={{ base: "md", md: "md" }}>
              {gameDetails.platforms}
            </Text>
          </Box>

          <Box width={{ base: '100%', md: '50%' }}>
            <Heading
              fontSize={"sm"}
              color={"hsla(0,0%,100%,.2)"}
              marginBottom={2}
            >
              Genres
            </Heading>
            <Text
              color={"grey"}
              fontSize={{ base: "md", md: "md" }}
              mb={4}
            >
              {gameDetails.genres}
            </Text>
          </Box>

          <Box width={"100%"}>
            <Heading
              fontSize={"sm"}
              color={"hsla(0,0%,100%,.2)"}
              marginBottom={2}
            >
              Developers:
            </Heading>
            <Text
              color={"grey"}
              fontSize={{ base: "md", md: "md" }}
              mb={4}
            >
              {gameDetails.developers}
            </Text>
          </Box>

          <Box width={"100%"}>
            <Heading
              fontSize={"sm"}
              color={"hsla(0,0%,100%,.2)"}
              marginBottom={2}
            >
              Publisher:
            </Heading>
            <Text color={"grey"} fontSize={{ base: "md", md: "md" }}>
              {gameDetails.publisher}
            </Text>
          </Box>

          <Box>
            <Heading
              fontSize={"sm"}
              color={"hsla(0,0%,100%,.2)"}
              marginBottom={2}
            >
              Price
            </Heading>
            <Text  color={"grey"} fontSize={{ base: "md", xl: "xl" }}>
              {gameDetails.price}
            </Text>
          </Box>
          <Box width={"100%"}>
            <AddToCartButton fontSize={"sm"} marginBottom={2} gameId={id} />
          </Box>
        </SimpleGrid>

        <VStack align="start" spacing={4}>
      <Heading fontSize={{ base: 'lg', md: 'lg' }} mb={4}>
        Reviews and Ratings
      </Heading>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Box key={review.id} mb={1}>
            <Text fontSize={{ base: 'sm', md: 'sm' }} color="grey">
              {review.comment}
              <ReviewSummary reviewstar={reviews} />
            </Text>
          </Box>
        ))
      ) : (
        <Text>No reviews yet.</Text>
      )}

      <ReviewForm
        gameId={id}
        refreshReviews={() => {
          fetchGameDetails();
          fetchGameReviews();
        }}
      />
    </VStack>
      </Box>
      <Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {gameDetails.images.map((image, index) => (
            <Box key={index}>
              <Image
                className="d-block w-100"
                src={image.url}
                alt={`Game Image ${index + 1}`}
              />
            </Box>
          ))}
        </SimpleGrid>
        {/* <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/ja1rtSS4YlI?si=s0yKNkPCdntoO9Fp"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe> */}
           {/* <video src={gameDetails.youtube_video_url} width="800" height="400" controls /> */}
           <Box  mt={2}
      as='video'
      controls
      src={gameDetails.youtube_video_url}
      poster={gameDetails.images[0]?.url}
      alt='Big Buck Bunny'
      objectFit='contain'
      sx={{
        aspectRatio: '16/9'
      }}
  />
      </Box>
    </Grid>
  </Box>

  <Box
    position={"absolute"}
    top={0}
    left={0}
    width={"100%"}
    height={"100%"}
    zIndex={"-2"}
  >
    <Box height={"500px"} className="art-wrapper">
      <Box
        height={"500px"}
        backgroundColor={"transparent"}
        backgroundImage={`linear-gradient(rgba(15, 15, 15, 0), rgb(21, 21, 21)), linear-gradient(rgba(21, 21, 21, 0.8), rgba(21, 21, 21, 0.5)), url(${gameDetails.images[0]?.url || ''})`}
        maxHeight={"100%"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        backgroundPosition={"top"}
        transition={"background .3s"}
      ></Box>
    </Box>
  </Box>
</>

  );
};

export default GameDetails;