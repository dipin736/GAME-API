// AboutUs.jsx
import React from 'react';
import { Box, Center, Heading, Image, Text } from '@chakra-ui/react';

const AboutUs = () => {
  return (
    <Center>
      <Box p={4} textAlign="center">
        <Heading mb={4}>About</Heading>
        <Box display="inline-block">
          <Image
            src="https://cdn.dribbble.com/userupload/10683739/file/original-54cb9ea1be7e682e6aa7866af15b8137.png?resize=1200x626" // Replace with the actual path or URL of your image
            alt="About Us Image"
            mb={4}
            borderRadius="md"
            maxH="400px" // Adjust the maximum height as needed
            objectFit="cover"
          />
        </Box>
        <Text textAlign="justify">
          Welcome to our gaming platform! We are passionate about creating a space where gamers can
          discover, connect, and immerse themselves in the world of video games. Our platform is designed
          to cater to all types of gamers, from casual players to hardcore enthusiasts.
        </Text>
        <Text mt={4} textAlign="justify">
          Our mission is to provide a comprehensive gaming experience, offering a diverse collection of games
          across various genres. Whether you're into action, strategy, adventure, or racing games, you'll find
          a curated selection to suit your preferences.
        </Text>
        <Text mt={4} textAlign="justify">
          Connect with other gamers, share your gaming experiences, and stay up-to-date with the latest releases.
          Our community-driven platform is built with the idea that gaming is more fun when shared.
        </Text>
        <Text mt={4} textAlign="justify">
          Thank you for being a part of our gaming community. We're excited to embark on this gaming journey with you!
        </Text>
       
      </Box>
    </Center>
  );
};

export default AboutUs;
