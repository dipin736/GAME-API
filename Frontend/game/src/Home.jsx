import React from "react";
import {
  Skeleton,
  SkeletonText,
  Show,
  GridItem,
  Heading,
  Text,
  VStack,
  Link as ChakraLink,
  Icon,
  HStack,
  Box,
} from "@chakra-ui/react";
import { FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";

import GameGrid from "./components/GameGrid";
import { Link } from "react-router-dom";
import NewReleasesList from "./components/NewReleasesList";
import TopReleases from "./components/TopReleases";
import SortSelector from "./components/SortSelector";
import GenresList from "./components/GenresList";

const Home = ({ loading, filteredGames }) => {
  return loading ? (
    <>
      <Skeleton height="20px" mb="4" />
      <SkeletonText noOfLines={4} spacing="4" />
    </>
  ) : (
    <>
      <Show above="lg">
        <GridItem area="aside" >
          {/* Navigation Links */}
          <VStack
            fontSize={"20px"}
            align="start"
            spacing={5}
            padding={11}
            fontWeight={"700"}
            mt={"1rem"}
            // mb={'4rem'}
            color={"gray.50"}
          >
            <ChakraLink as={Link} to="/">
              <Icon as={FaHome} mr={2} />
              Home {/* Home icon */}
              {/* <Text>Home</Text> */}
            </ChakraLink>
            <ChakraLink as={Link} to="/about">
              <Icon as={FaInfoCircle} mr={2} />
              About {/* Info/About icon */}
              {/* <Text>About</Text> */}
            </ChakraLink>
            <ChakraLink as={Link} to="/contact">
              <Icon as={FaEnvelope} mr={2} />
              Contact {/* Contact icon */}
              {/* <Text>Contact</Text> */}
            </ChakraLink>
          </VStack>
          <VStack
            fontSize={"20px"}
            align="start"
            padding={11}
            fontWeight={"700"}
            color={"gray.50"}
          >
            <NewReleasesList />
            <TopReleases />
          </VStack>
          <Heading p={"11"}>Genres</Heading>
          {filteredGames.length === 0 ? (
            <Text>No matching games found</Text>
          ) : (
            filteredGames.map((game) => (
              <GenresList key={game.id} genres={game.genres} game={game} />
            ))
          )}
        </GridItem>
      </Show>
      <GridItem area="main">
      <Box ><SortSelector/></Box>

        {filteredGames.length === 0 ? (
          <Heading>No matching games found</Heading>
        ) : (
          <GameGrid games={filteredGames} />
        )}
      </GridItem>
    </>
  );
};

export default Home;
