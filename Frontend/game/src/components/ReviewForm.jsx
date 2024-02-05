// ReviewForm.jsx
import React, { useState } from 'react';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router';
import {
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Button,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';

const ReviewForm = ({ gameId, refreshReviews }) => {
  const { id } = useParams();
  const {user}=useAuth()
  console.log('Current User:', user);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(1);
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  console.log('Submitting form...');
  if (!user) {
    navigate('/login');
  }
  e.preventDefault();

  try {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
console.log("Review Payload:", {
  game: gameId,
  comment: content,
  rating,
  user: user.id,
});
    await api.post(`games/${id}/reviews/`, {
      game: gameId,
      comment: content,
      rating,
     
      user: user.id,
    }, config);

 
    refreshReviews();


    setContent('');
    setRating(1);
     toast.success('Review Added Successfully', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
    });
   
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};


  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4}>
      <Flex width="100%" justifyContent="space-between">
        <FormControl id="content" flex="1">
          <FormLabel>Review</FormLabel>
          <Textarea
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </FormControl>
        <FormControl id="rating" ml={1} w="40%">
          <FormLabel>Rating</FormLabel>
          <Select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </FormControl>
      </Flex>
      <Button  type="submit">
        Submit Review
      </Button>
    </VStack>
  );
};

export default ReviewForm;
