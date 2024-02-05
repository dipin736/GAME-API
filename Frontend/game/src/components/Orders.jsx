import React, { useState, useEffect } from "react";
import api from "../service/api";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Box,
  Text,
  Heading,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Center,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router";

const Orders = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.get(`orders/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data && response.data.length > 0) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <VStack spacing={4} align="stretch">
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
            View Orders
          </Button>
        </Box>
      </Center>
    </Box>
      
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Your Orders</DrawerHeader>

            <DrawerBody>
              {orders.length > 0 ? (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Cart ID</Th>
                      <Th>Payment Status</Th>
                      <Th>Items</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orders.map((order) => (
                      <Tr key={order.id}>
                        <Td>#00{order.id}</Td>
                        <Td>{order.cart}</Td>
                        <Td>{order.payment_status}</Td>
                        <Td>
                          <ul>
                            {order.order_items.map((item) => (
                              <li key={item.id}>
                                {item.quantity} x {item.game.title}
                              </li>
                            ))}
                          </ul>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="gray.500" mb={4}>
                    You have no orders yet.
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

export default Orders;
