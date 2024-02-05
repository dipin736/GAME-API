import React, { useState } from "react";
import api from "../service/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { RiAddLine } from 'react-icons/ri';
import { useNavigate} from "react-router";
import { toast } from 'react-toastify';
import { Button } from "@chakra-ui/react";

const AddToCartButton = ({gameId }) => {
  const [cartId, setCartId] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const createCart = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await api.post('carts/', {}, { headers: { Authorization: `Bearer ${authToken}` } });
      setCartId(response.data.id);
      console.log(response.data.id)
      toast.success('Cart created successfully!', {
        position: 'top-right',
        autoClose: 3000, //
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  };
  

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
  
    try {
      if (!cartId) {
        const response = await createCart();
        const newCartId = response.data.id; 
        setCartId(newCartId); 
      }
      const authToken = localStorage.getItem('token');
      await api.post(`carts/${cartId}/items/`, { game_id: gameId, quantity: 1, user: user.id, },{ headers: { Authorization: `Bearer ${authToken}` } });
      console.log("Review Payload:", {
        game_id: gameId,
        
        user: user.id,
      });
      toast.success('Game added to cart!', {
        position: 'top-right',
        autoClose: 3000, // 3 seconds
        hideProgressBar: true,
      });
     
    } catch (error) {
      console.error("Error adding game to cart:", error);
     
    }
  };
  
  return (
    <Button onClick={addToCart}>
      Add to cart <RiAddLine />
    </Button>
  );
};


export default AddToCartButton;


































// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { Text, Box, Flex, Image, Heading, Button } from "@chakra-ui/react";
// import api from "../service/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Carousel, Form } from "react-bootstrap";
// import ReviewForm from "./ReviewForm";
// import { useAuth } from "../context/AuthContext";
// import GameDetailsSkeleton from "./GameDetailsSkeleton";
// import { RiAddLine, RiCheckLine } from 'react-icons/ri';
// import { v4 as uuidv4 } from 'uuid';

// const GameDetails = () => {
//   const { id } = useParams();
//   const [gameDetails, setGameDetails] = useState(null);
//   const [expanded, setExpanded] = useState(false);
//   const [cartDetails, setCartDetails] = useState(null);
//   const [cartItems, setCartItems] = useState([]);
//   const navigate = useNavigate();

// const [userCartUUID] = useState(uuidv4())

//   const [reviews, setReviews] = useState([]);

//   const { user } = useAuth();

//   const fetchGameDetails = async () => {
//     try {
//       const response = await api.get(`games/${id}`);
//       console.log("Game Details Response:", response.data);
//       setGameDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching game details:", error);
//     }
//   };

//   const fetchGameReviews = async () => {
//     try {
//       const response = await api.get(`games/${id}/reviews/`);
//       setReviews(response.data);
//       console.log("Review API Response:", response.data);
//       const userIds = response.data.map((review) => review.user);
//     } catch (error) {
//       console.error("Error fetching game reviews:", error);
//     }
//   };

//   const fetchCartDetails = async () => {
//     try {
//       const response = await api.get(`/carts/${userCartUUID}/`);
//       setCartDetails(response.data);
//       setCartItems(response.data.cart_items);
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const addToCart = async () => {
//     try {
//       const newCartItem = {
//         game_id: gameDetails.id,
//         quantity: 1,
//       };

//       await api.post(`/carts/${userCartUUID}/items/`, newCartItem);
//       console.log("Adding item to cart with game_id:", newCartItem.game_id);
//       fetchCartDetails();  // Refresh cart details after adding an item
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     }
//   };
  

//   useEffect(() => {
//     fetchGameDetails();
//     fetchGameReviews();
//     fetchCartDetails();
//   }, [id,userCartUUID]);

//   if (!gameDetails) {
//     // Render Skeleton while loading
//     return (
//       <Flex
//         direction={{ base: "column", md: "row" }}
//         align="center"
//         justify="center"
//         p={4}
//         width={{ base: "100%", md: "1500px" }}
//         mx="auto"
//       >
//         <GameDetailsSkeleton />
//         <Box flex="1" margin={5}>
//           {/* ... rest of the skeleton code ... */}
//         </Box>
//       </Flex>
//     );
//   }

//   return (
//     <>
//     <Flex
//       direction={{ base: "column", md: "row" }}
//       align="center"
//       justify="center"
//       p={4}
//       width={{ base: "100%", md: "1500px" }}
//       mx="auto"
//     >
//       {gameDetails.images && gameDetails.images.length > 0 && (
//         <Box
//           flex={{ base: "none", md: "1" }}
//           mb={{ base: 4, md: 0 }}
//           mr={{ base: 0, md: 4 }}
//           maxWidth={{ base: "100%", md: "50%" }}
//         >
//           <Carousel>
//             {gameDetails.images.map((image, index) => (
//               <Carousel.Item key={index}>
//                 <Image
//                   className="d-block w-100"
//                   src={image.url}
//                   alt={`Game Image ${index + 1}`}
//                 />
//               </Carousel.Item>
//             ))}
//           </Carousel>
//         </Box>
//       )}

//       <Box flex="1" margin={5}>
//         <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4}>
//           {gameDetails.title}
//         </Heading>
//         <Text className="about" fontSize={{ base: "sm", md: "sm" }} mb={4}>
//           {expanded ? gameDetails.about : gameDetails.about.slice(0, 200)}
//           {!expanded && gameDetails.about.length > 150 && " ... "}
//           <Button
//             marginLeft={5}
//             fontWeight={"bold"}
//             borderColor={"gray.200"}
//             border="1px"
//             size="sm"
//             onClick={() => setExpanded(!expanded)}
//           >
//             {expanded ? "Show Less" : "Read More"}
//           </Button>
//         </Text>

//         <Text color={"grey"} fontSize={{ base: "sm", md: "sm" }} mb={4}>
//           <Text>
//             Released Date:{" "}
//             {new Date(gameDetails.release_date).toLocaleDateString("en-GB")}
//           </Text>
//         </Text>
//         <Text color={"grey"} fontSize={{ base: "md", md: "md" }} mb={4}>
//           Genres: {gameDetails.genres}
//         </Text>
//         <Text color={"grey"} fontSize={{ base: "md", md: "md" }} mb={4}>
//           Developers: {gameDetails.developers}
//         </Text>
//         <Text color={"grey"} fontSize={{ base: "md", md: "md" }}>
//           Publisher: {gameDetails.publisher}
//         </Text>
//         <Text fontSize={{ base: "md", md: "md" }} mt={2} fontFamily={'initial'}>
//           Price: ₹{gameDetails.price}
//         </Text>
//          <Button onClick={addToCart}>
//                 Add to cart <RiAddLine />
//         </Button>
       
//       </Box>
//       <Box mt={8}>
//           <Heading fontSize={{ base: "lg", md: "lg" }} mb={4}>
//             Reviews and Ratings
//           </Heading>

//           {reviews.length > 0 ? (
//             reviews.map((review) => (
//               <Box key={review.id} mb={1}>
//                 <Text fontSize={{ base: "sm", md: "sm" }}></Text>
//                 <Text color={"grey"} fontSize={{ base: "sm", md: "sm" }}>
//                   Rating: {review.rating} - Comment: {review.comment}
//                 </Text>
//                 {/* Add other review details as needed */}
//               </Box>
//             ))
//           ) : (
//             <Text>No reviews yet.</Text>
//           )}

//           {
//             <ReviewForm
//               gameId={id}
//               refreshReviews={() => {
//                 fetchGameDetails();
//                 fetchGameReviews();
//               }}
//             />
//           }
//           {/* Display a message or a link to login if the user is not authenticated */}
//           {/* {!user && (
//           <Text>
//             <Link to="/login">Login</Link> to add a review.
//           </Text>
//         )} */}
//         </Box>
//     </Flex>

//     </>

//   );
// };

// export default GameDetails;


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { Text, Box, Flex, Image, Heading, Button } from "@chakra-ui/react";
// import api from "../service/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Carousel, Form } from "react-bootstrap";
// import ReviewForm from "./ReviewForm";
// import { useAuth } from "../context/AuthContext";
// import GameDetailsSkeleton from "./GameDetailsSkeleton";
// import { RiAddLine, RiCheckLine } from 'react-icons/ri';
// const GameDetails = () => {
//   const { id } = useParams();
//   const [gameDetails, setGameDetails] = useState(null);
//   const [expanded, setExpanded] = useState(false);
//   const navigate = useNavigate();



//   const [reviews, setReviews] = useState([]);

//   const { user } = useAuth();

//   const fetchGameDetails = async () => {
//     try {
//       const response = await api.get(`games/${id}`);
//       console.log("Game Details Response:", response.data);
//       setGameDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching game details:", error);
//     }
//   };

//   const fetchGameReviews = async () => {
//     try {
//       const response = await api.get(`games/${id}/reviews/`);
//       setReviews(response.data);
//       console.log("Review API Response:", response.data);
//       const userIds = response.data.map((review) => review.user);
//     } catch (error) {
//       console.error("Error fetching game reviews:", error);
//     }
//   };
//   const addToCart = async (game) => {
   
//     try {
//       // Make an API request to add the game to the cart
//       const response = await api.post(`carts/${cartId}/items/`, {
//         game_id: game.id,
//         quantity: 1, // You can adjust the quantity as needed
//       });
  
//       // Handle the response as needed (e.g., show a success message)
//       console.log("Game added to cart:", response.data);
  
//       // Optionally, you can refresh the game details or cart data
//       fetchGameDetails();
//     } catch (error) {
//       console.error("Error adding game to cart:", error);
//       // Handle the error (e.g., show an error message to the user)
//     }
//   };
  

//   useEffect(() => {
//     fetchGameDetails();
//     fetchGameReviews();
//     addToCart()
//   }, [id]);

//   if (!gameDetails) {
//     // Render Skeleton while loading
//     return (
//       <Flex
//         direction={{ base: "column", md: "row" }}
//         align="center"
//         justify="center"
//         p={4}
//         width={{ base: "100%", md: "1500px" }}
//         mx="auto"
//       >
//         <GameDetailsSkeleton />
//         <Box flex="1" margin={5}>
//           {/* ... rest of the skeleton code ... */}
//         </Box>
//       </Flex>
//     );
//   }

//   return (
//     <>
//     <Flex
//       direction={{ base: "column", md: "row" }}
//       align="center"
//       justify="center"
//       p={4}
//       width={{ base: "100%", md: "1500px" }}
//       mx="auto"
//     >
//       {gameDetails.images && gameDetails.images.length > 0 && (
//         <Box
//           flex={{ base: "none", md: "1" }}
//           mb={{ base: 4, md: 0 }}
//           mr={{ base: 0, md: 4 }}
//           maxWidth={{ base: "100%", md: "50%" }}
//         >
//           <Carousel>
//             {gameDetails.images.map((image, index) => (
//               <Carousel.Item key={index}>
//                 <Image
//                   className="d-block w-100"
//                   src={image.url}
//                   alt={`Game Image ${index + 1}`}
//                 />
//               </Carousel.Item>
//             ))}
//           </Carousel>
//         </Box>
//       )}

//       <Box flex="1" margin={5}>
//         <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4}>
//           {gameDetails.title}
//         </Heading>
//         <Text className="about" fontSize={{ base: "sm", md: "sm" }} mb={4}>
//           {expanded ? gameDetails.about : gameDetails.about.slice(0, 200)}
//           {!expanded && gameDetails.about.length > 150 && " ... "}
//           <Button
//             marginLeft={5}
//             fontWeight={"bold"}
//             borderColor={"gray.200"}
//             border="1px"
//             size="sm"
//             onClick={() => setExpanded(!expanded)}
//           >
//             {expanded ? "Show Less" : "Read More"}
//           </Button>
//         </Text>

//         <Text color={"grey"} fontSize={{ base: "sm", md: "sm" }} mb={4}>
//           <Text>
//             Released Date:{" "}
//             {new Date(gameDetails.release_date).toLocaleDateString("en-GB")}
//           </Text>
//         </Text>
//         <Text color={"grey"} fontSize={{ base: "md", md: "md" }} mb={4}>
//           Genres: {gameDetails.genres}
//         </Text>
//         <Text color={"grey"} fontSize={{ base: "md", md: "md" }} mb={4}>
//           Developers: {gameDetails.developers}
//         </Text>
//         <Text color={"grey"} fontSize={{ base: "md", md: "md" }}>
//           Publisher: {gameDetails.publisher}
//         </Text>
//         <Text fontSize={{ base: "md", md: "md" }} mt={2} fontFamily={'initial'}>
//           Price: ₹{gameDetails.price}
//         </Text>
//          <Button handleClick={() => addToCart(setGameDetails)}>
//                 Add to cart <RiAddLine />
//         </Button>
       
//       </Box>
//       <Box mt={8}>
//           <Heading fontSize={{ base: "lg", md: "lg" }} mb={4}>
//             Reviews and Ratings
//           </Heading>

//           {reviews.length > 0 ? (
//             reviews.map((review) => (
//               <Box key={review.id} mb={1}>
//                 <Text fontSize={{ base: "sm", md: "sm" }}></Text>
//                 <Text color={"grey"} fontSize={{ base: "sm", md: "sm" }}>
//                   Rating: {review.rating} - Comment: {review.comment}
//                 </Text>
//                 {/* Add other review details as needed */}
//               </Box>
//             ))
//           ) : (
//             <Text>No reviews yet.</Text>
//           )}

//           {
//             <ReviewForm
//               gameId={id}
//               refreshReviews={() => {
//                 fetchGameDetails();
//                 fetchGameReviews();
//               }}
//             />
//           }
//           {/* Display a message or a link to login if the user is not authenticated */}
//           {/* {!user && (
//           <Text>
//             <Link to="/login">Login</Link> to add a review.
//           </Text>
//         )} */}
//         </Box>
//     </Flex>

//     </>

//   );
// };

// export default GameDetails;
