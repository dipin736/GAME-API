import React from "react";
import { Box, Skeleton } from "@chakra-ui/react";

const GameDetailsSkeleton = () => {
  return (
    <Box
      flex={{ base: "none", md: "1" }}
      mb={{ base: 4, md: 0 }}
      mr={{ base: 0, md: 4 }}
      maxWidth={{ base: "100%", md: "50%" }}
    >
      <Skeleton height="300px" width="100%" />
    </Box>
    
  );
};

export default GameDetailsSkeleton;
