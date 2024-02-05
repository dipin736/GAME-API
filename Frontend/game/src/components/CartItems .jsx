import React, { useEffect, useState } from "react";
import {
  VStack,
  Heading,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Link,
  Center,
} from "@chakra-ui/react";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from "../service/api";

const Cartitems = () => {
  const { userId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cartData, setCartData] = useState(null);
  const fetchCartData = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await api.get(`carts/${userId}`, { headers: { Authorization: `Bearer ${authToken}` } });

      if (response.data && response.data.length > 0) {
        setCartData(response.data);
      } else {
        setCartData(null);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleDeleteItem = async (cartId, itemId) => {
    try {
      const authToken = localStorage.getItem('token');
      const deleteItemResponse = await api.delete(`carts/${cartId}/items/${itemId}`, { headers: { Authorization: `Bearer ${authToken}` } });

      if (deleteItemResponse.status === 204) {
        toast.success('Item deleted from cart!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });

   
        await fetchCartData();
      } else {
        console.error("Error deleting item from cart. Unexpected response:", deleteItemResponse);
        toast.error('Error deleting item from cart. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      toast.error('Error deleting item from cart. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleDeleteCart = async (cartId) => {
    try {
      const authToken = localStorage.getItem('token');
      const deleteCartResponse = await api.delete(`carts/${cartId}`, { headers: { Authorization: `Bearer ${authToken}` } });

      if (deleteCartResponse.status === 204) {
        toast.success('Cart deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });

        // Fetch updated cart data after deleting the cart
        await fetchCartData();
      } else {
        console.error("Error deleting cart. Unexpected response:", deleteCartResponse);
        toast.error('Error deleting cart. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error deleting cart:", error);
      toast.error('Error deleting cart. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleCheckout = async (cartId) => {
    try {
      const authToken = localStorage.getItem('token');
      const payload = { cart_id: cartId, user: userId };
      console.log('Checkout Payload:', payload);
      const checkoutResponse = await api.post(`orders/`, payload, { headers: { Authorization: `Bearer ${authToken}` } });

      if (checkoutResponse.status === 201) {
        toast.success('Checkout successful!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });

        // Fetch updated cart data after completing the checkout
        await fetchCartData();
      } else {
        console.error("Error completing checkout. Unexpected response:", checkoutResponse);
        toast.error('Error completing checkout. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error completing checkout:", error);
      toast.warning('Cart has already been ordered.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
  };
  useEffect(() => {
    console.log("Fetching initial cart data...");
    fetchCartData();
  }, [userId]);

  return (
    <VStack spacing={{ base: 4, md: 8 }} align="stretch" >
 
   
    <Box
      bgImage="url('https://wallpapers.com/images/hd/pubg-full-screen-armed-player-jo9xyb8k0ncjdqs4.jpg')"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="top"
      transition="background .3s"
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="80vh"
      w="100vw"
    >
      <Center h="100%">
        <Box textAlign="center">
          <Button colorScheme="blue" size="md" onClick={onOpen}>
            View Cart
          </Button>
        </Box>
      </Center>
    </Box>

    {/* Drawer component */}
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Your Cart</DrawerHeader>

          {/* Drawer body */}
          <DrawerBody>
            {cartData && cartData.length > 0 ? (
              <VStack spacing={4}>
                {cartData.map((cart) => (
                  <Box key={cart.id}>
                    <Table variant="simple" size={['xs', 'sm', 'md', 'lg']} overflowX="auto">
                      <Thead>
                        <Tr>
                          <Th>Cart ID</Th>
                          <Th>Total Price</Th>
                          <Th>Items</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{cart.id}</Td>
                          <Td>{cart.total_price}</Td>
                          <Td>
                            <ul>
                              {cart.cart_items.map((item) => (
                                <li key={item.id}>
                                  {item.quantity} x {item.game.title}
                                </li>
                              ))}
                            </ul>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                    <Flex justify="flex-end" mt={4} flexWrap="wrap">
                    {/* <Button ml={2} colorScheme="red" size="sm" onClick={() => handleDeleteItem(cart.id, item.id)}>
                              Delete item
                            </Button> */}
                      <Button colorScheme="red" size="sm" onClick={() => handleDeleteCart(cart.id)}>
                        Delete cart
                      </Button>
                      <Box>
                        <Button colorScheme="blue" size="sm" ml={2} onClick={() => handleCheckout(cart.id)}>
                          Checkout
                        </Button>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="gray.500" mb={4}>
                  Your cart is currently empty.
                </Text>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  </VStack>
  
  
);
};



export default Cartitems;
