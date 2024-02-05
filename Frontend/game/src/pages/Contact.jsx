import React, { useState } from 'react';
import {
  Box,
  Heading,

  FormControl,
  FormLabel,

  
 
  Flex,
  Image
  , Button, Text, Textarea, Input, VStack
} from '@chakra-ui/react';
import { toast } from 'react-toastify';


import api from '../service/api';

const ContactUs = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const response = await api.post('contacts/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        // Status code 201 indicates successful creation (created resource)
        console.log('Data saved successfully');
        // Reset the form immediately after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        // Display a success toast message
        toast.success('We will Contact You Soon', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        console.error('Failed to save data to the database');
        // Optionally, you can display an error toast message here
        toast.error('Failed to save data. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error while saving data:', error);
      // Optionally, you can display an error toast message here as well
      toast.error('An error occurred. Please try again later.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };
  
  

  return (
    <Flex p={[4, 8]} align="center" direction={{ base: 'column', md: 'row' }}>
    <VStack
      align="stretch"
      spacing={4}
      borderRadius="16px"
      p="32px 24px"
      bgGradient="linear(to-r, #212128, #212121)"
      border="2px solid transparent"
      borderColor="transparent"
      fontSize="14px"
      color="white"
      boxSizing="border-box"
      w={{ base: '100%', md: '500px' }}
    >
      {/* Your form content */}
      <VStack align="stretch" spacing={4} className="form">
      <Box className="form-group">
  <label htmlFor="name">Name</label>
  <Input
    type="text"
    id="name"
    placeholder="Your Name"
    borderRadius="8px"
    borderColor="#414141"
    _placeholder={{ opacity: 0.5 }}
    _focus={{ borderColor: "#e81cff" }}
    color="#fff"
    bg="transparent"
    focusBorderColor="#e81cff"
    px="16px"
    py="12px"
    onChange={handleChange}
  />
</Box>


        <Box className="form-group">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            placeholder="Your Email"
            borderRadius="8px"
            borderColor="#414141"
            _placeholder={{ opacity: 0.5 }}
            _focus={{ borderColor: "#e81cff" }}
            color="#fff"
            bg="transparent"
            focusBorderColor="#e81cff"
            px="16px"
            py="12px"
            onChange={handleChange}
          />
        </Box>

        <Box className="form-group">
          <label htmlFor="phone">Contact</label>
          <Input
            type="tel"
            id="phone"
            placeholder="Your phone"
            borderRadius="8px"
            borderColor="#414141"
            _placeholder={{ opacity: 0.5 }}
            _focus={{ borderColor: "#e81cff" }}
            color="#fff"
            bg="transparent"
            focusBorderColor="#e81cff"
            px="16px"
            py="12px"
            onChange={handleChange}
          />
        </Box>

        <Box className="form-group">
          <label htmlFor="message">Message</label>
          <Textarea
            id="message"
            placeholder="Your Message"
            borderRadius="8px"
            borderColor="#414141"
            _placeholder={{ opacity: 0.5 }}
            _focus={{ borderColor: "#e81cff" }}
            color="#fff"
            bg="transparent"
            focusBorderColor="#e81cff"
            px="16px"
            py="12px"
            resize="none"
            height="96px"
            onChange={handleChange}
          />
        </Box>
      </VStack>

      <Button
        className="form-submit-btn"
        w={{ base: '100%', md: '40%' }}
        borderRadius="6px"
        borderColor="#414141"
        bg="#313131"
        color="#717171"
        fontWeight="600"
        p="12px 16px"
        fontSize="inherit"
        _hover={{ bg: "#fff", borderColor: "#fff" }}
        cursor="pointer"
        mt="8px"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </VStack>

    <Box flex="1" pl={{ base: 0, md: 8 }}>
      <Image
        src="https://wallpapers.com/images/hd/pubg-full-screen-armed-player-jo9xyb8k0ncjdqs4.jpg" // Replace with the actual URL of your image
        alt="Contact Image"
        borderRadius="md"
        boxSize="100%"
        objectFit="cover"
      />
    </Box>
  </Flex>
  );
};

export default ContactUs;

// https://github.com/orionEsu/rawg-rebuild-v2/blob/master/src/components/SideBar.tsx