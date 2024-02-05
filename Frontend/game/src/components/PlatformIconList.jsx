import { Flex, Box } from '@chakra-ui/react';
import React from 'react';
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
} from 'react-icons/fa';
import { MdPhoneIphone } from 'react-icons/md';
import { SiNintendo } from 'react-icons/si';
import { BsGlobe } from 'react-icons/bs';

const PlatformIconList = ({ game }) => {
  const iconMap = {
    pc: FaWindows,
    playstation: FaPlaystation,
    xbox: FaXbox,
    nintendo: SiNintendo,
    mac: FaApple,
    linux: FaLinux,
    android: FaAndroid,
    ios: MdPhoneIphone,
    web: BsGlobe,
  };

  const platforms = game.platforms.split(','); 

  return (
    <Flex  marginY={3} color={'grey'}>
      {platforms.map((platform) => {
        const Icon = iconMap[platform.trim().toLowerCase()];
        if (Icon) {
          return (
            <Box key={platform} mr={2}>
              <Icon size={20} />
            </Box>
          );
        }
        return null;
      })}
    </Flex>
  );
};

export default PlatformIconList;
