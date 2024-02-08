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





